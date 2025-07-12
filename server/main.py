from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import pdfplumber

app = Flask(__name__)
CORS(app)

#config settings
app.config['uploadFolder'] = 'uploads'
app.config['processedFolder'] = 'processed'
app.config['maxContentSize'] = 50 * 1024 * 1024 #size * bytes * KB = MB
app.config['securityKey'] = 'security-key'

# checking to see if an upload folder exists
# makes one if it doesn't
FileTypes = {'pdf'}
if not os.path.exists(app.config['uploadFolder']): 
    os.makedirs(app.config['uploadFolder']) 

@app.route('/Status', methods=['GET'])
def checkStatus():
    return jsonify({
        'Status' : 'Live',
        'Time' : datetime.now().isoformat()
    })

#The person will need to convert to PDF themselves in order to maintain the same layout as the original file
def processPdf(pdfPath, charLimit):
    longLines = []
    allLines = []
    paragraphNum = 0
    LastLineEmpty = True
    with pdfplumber.open(pdfPath) as pdf:
        for pageNum, page in enumerate(pdf.pages, 1):
            lines = page.extract_text_lines()
            if lines:
                for lineNum, line in enumerate(lines, 1):
                    lineText = line['text'].strip()
                    if lineText:
                        if LastLineEmpty:
                            paragraphNum += 1  
                        lineInfo = { 
                            'page' : pageNum,
                            'lineNumber' : lineNum,
                            'charlength' : len(lineText),
                            'text' : lineText,
                            'exceeds limit' : len(lineText) > charLimit
                                }
                        allLines.append(lineInfo)
                        if len(lineText) > charLimit:
                            longLines.append(lineInfo)

                        LastLineEmpty = False
                    else:
                        LastLineEmpty = True

            else:
                text = page.extract_text()
                if text:
                    for lineNum, lineText in enumerate(text.split('\n'), 1):
                        lineText = lineText.strip()
                        if lineText:
                            if LastLineEmpty:
                                paragraphNum += 1
                            lineInfo = {
                                'page' : pageNum,
                                'lineNumber' : lineNum,
                                'charlength' : len(lineText),
                                'text' : lineText,
                                'exceeds limit' : len(lineText) > charLimit
                            }
                            allLines.append(lineInfo)
                            if len(lineText) > charLimit:
                                longLines.append(lineInfo)    

    return longLines, allLines


def FileTypeCheck(fileName):
        fileType = fileName.rsplit('.',1)[1].lower()
        if fileType not in FileTypes:
            return {'error' : 'Wrong File Type'}
        return fileType 

    
@app.route('/upload', methods=['POST'])
def uploadFile():
    if 'file' not in request.files:
        return jsonify({'error' : 'No File Present'})

    #remember to add functionality to request char limit from the frontend
    #charLimit = 
    file = request.files['file']
    fileName = secure_filename(file.filename)
    fileType = FileTypeCheck(fileName)

    charLimit = int(request.form.get('charLimit', 75))

    if fileName == '':
        return jsonify({'error' :  'No File' })
    
    if isinstance(fileType, dict):
        return jsonify(fileType)
    
    try:
        inputPath = os.path.join(app.config['uploadFolder'], fileName)
        file.save(inputPath)

        #baseName = os.path.splitext(fileName)[0]
        #pdfPath = os.path.join(app.config['processedFolder'], f"{baseName}.pdf")
        
        if fileType == 'pdf':
            pdfPath = inputPath
        else:
            return jsonify({'error' : 'unsupported file type'})
        
        longLines, allLines = processPdf(inputPath, charLimit)
        
        return jsonify({
            'message' : 'File processed successfully',
            'filename' : fileName,
            'character limit' : charLimit,
            'totalLines' : len(allLines),
            'longLinesCount' : len(longLines),
            'original_pdf_url': f"/download/{os.path.basename(pdfPath)}", 
            'long lines' : longLines
            })
    except Exception as e:
        print(f"Error Processing File: {str(e)}")
        return jsonify({'error' : 'File Failed To Save',
                        'fileName' : fileName})

    

if __name__ == '__main__':
    app.run(debug=True, port=5000)
