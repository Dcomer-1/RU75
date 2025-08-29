import io
from clerk_backend_api.utils import headers
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import pdfplumber
from realtime.types import Payload
from supabase import create_client
from dotenv import load_dotenv
import httpx
from clerk_backend_api import Clerk
from clerk_backend_api.security import authenticate_request
from clerk_backend_api.security.types import AuthenticateRequestOptions
from werkzeug.wrappers import response
from urllib.parse import unquote


app = Flask(__name__)
CORS(app)
load_dotenv()

clerk = Clerk(bearer_auth=os.environ.get('CLERK_SERVICE_KEY'))

FileTypes = {'pdf'}
supabaseUrl = os.environ.get('SUPABASE_URL')
supabaseApi = os.environ.get('SUPABASE_SERVICE_KEY')

if not supabaseUrl or not supabaseApi:
    raise ValueError("Error retrieving URL or API")

supabase = create_client(supabaseUrl , supabaseApi)

#config settings
app.config['maxContentSize'] = 50 * 1024 * 1024 #size * bytes * KB = MB
app.config['securityKey'] = 'security-key'

@app.route('/Status', methods=['GET'])
def checkStatus():
    return jsonify({
        'Status' : 'Live',
        'Time' : datetime.now().isoformat()
    })

def RemoveUser(userId):
    try:
        print(f"Starting Removal of User: {userId}")
        supabase.table('Users').delete().eq('clerk_id', userId).execute()

    except Exception as e:
        print (f'Error removing user: {userId} , {str(e)}')
        return False


@app.route('/webhook/clerk', methods=["POST"])
def clerk_Webhook():
    try:
       # payload = request.get_data()
       # signature = request.headers.get('svix-signatures')

       eventData = request.get_json()
       eventType = eventData.get('type')

       if eventType == "user.deleted":
           userData = eventData.get('data',{}) 
           userId = userData.get('id')

           RemoveUser(userId)

           print(f"Deleted User: {userId}")
           return jsonify({"successfully deleted user" : "user deletion success"})
    except Exception as e:
        print(f"Error Accessing WebHook: {str(e)}")
        return jsonify({'Error with webhook' : 'Interal Server Error'})
    finally:
        return jsonify({'message' : 'deletion operation completed'})

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

def getAuthUserId(flask_request):
    try:
            print("=== CLERK AUTH DEBUG ===")
            print(f"Method: {flask_request.method}")
            print(f"URL: {flask_request.url}")
            print(f"Headers: {dict(flask_request.headers)}")
            
            auth_header = flask_request.headers.get('Authorization')
            if auth_header:
                print(f"Auth header present: {auth_header[:50]}...")
                token_part = auth_header.replace('Bearer ', '')
                print(f"Token length: {len(token_part)}")
            else:
                print("❌ No Authorization header found!")
                return None
                
            sdk = Clerk(bearer_auth=os.getenv('CLERK_SERVICE_KEY'))
            
            httpx_request = httpx.Request(
                method=flask_request.method,
                url=str(flask_request.url),
                headers=dict(flask_request.headers),
                content=flask_request.get_data()
            )
            
            # Try without authorized_parties first
            print("Attempting authentication without authorized_parties...")
            request_state = sdk.authenticate_request(httpx_request,
                AuthenticateRequestOptions()          
            )
            
            print(f"Authentication result:")
            print(f"  - is_signed_in: {request_state.is_signed_in}")
            print(f"  - payload: {request_state.payload}")
            print(f"  - reason (if failed): {getattr(request_state, 'reason', 'No reason provided')}")
            
            return request_state.payload.get('sub') if request_state.payload else None
            
    except Exception as e:
        print(f"Exception during auth: {e}")
        import traceback
        traceback.print_exc()
        return None

@app.route('/deletePdf/<filename>', methods=['DELETE'])
def deleteFile(filename):

    user_Clerk_Id = getAuthUserId(request)
    try:
        
        supabase.storage.from_('pdf_storage').remove(
                [f'{user_Clerk_Id}/{filename}'])

        response = supabase.table('pdfs').delete().eq(
                'clerk_id', user_Clerk_Id).eq(
                        'filename', filename).execute()
       

        if response.data:
            return jsonify({f'{filename}' : 'Deleted Successfully'})
        else:
            return jsonify({f'{filename}' : 'File does not exist or could not be found'})

    except Exception as e:
        print(f"Error Deleting {filename} : {e}")
        return jsonify({"Error: ": str(e)})

@app.route('/upload', methods=['POST'])
def uploadFile():


    if 'file' not in request.files:
        return jsonify({'error' : 'No File Present'})
    
    file = request.files['file']

    if file.filename == None:
        return jsonify({'error' :  'No File' })

    fileName = file.filename
    fileType = FileTypeCheck(fileName)
    charLimit = int(request.form.get('charLimit', 75))


    try:

        user_Clerk_Id = getAuthUserId(request)
        bucketPath = f"{user_Clerk_Id}/{fileName}"
        response = supabase.storage.from_("pdf_storage").upload(
            bucketPath,
            file=file.stream.read(),
            file_options={"content-type": file.mimetype}
        )

        pdfPublicUrl = supabase.storage.from_("pdf_storage").get_public_url(bucketPath)
        supabase.table("pdfs").insert([
           {
            "clerk_id" : user_Clerk_Id,
            "filename" : fileName,
            "char_limit" : charLimit,
            "pdf_url" : pdfPublicUrl,
            }
        ]).execute()

        fileData = supabase.storage.from_("pdf_storage").download(bucketPath)
        fileBuffer = io.BytesIO(fileData)
        longLines, allLines = processPdf(fileBuffer, charLimit)
        
        return jsonify({
            'message' : 'File processed successfully',
            'filename' : fileName,
            'character limit' : charLimit,
            'totalLines' : len(allLines),
            'longLinesCount' : len(longLines),
            'supabaseUrl' : pdfPublicUrl, 
            'long lines' : longLines
            })
    except Exception as e:
        print(f"Error Processing File: {str(e)}")
        return jsonify({'error' : 'File Failed To Save',
                        'fileName' : fileName})

    

if __name__ == '__main__':
    app.run(debug=True, port=5000)
