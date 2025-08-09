import React, { useState, useCallback } from 'react';
import type { UploadResponse, LineInfo} from './types';
import { v4 as uuidv4  } from 'uuid';
import ResultsPage from './resultsPage.tsx';
import UploadPage from './UploadPage.tsx';
import { Box} from '@mui/material';
import logoImage from './assets/RU75-01.png';


const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<UploadResponse | null>(null);
    const [, setError] = useState<string | null>(null);
    const [charLimitSubmit, setcharLimitSubmit] = useState<number> (75); 
    const [selectedPage, setSelectedPage] = useState<number | null> (null);
    const [linesClientIDs, setlinesClientIDs] = useState<Array<LineInfo & { id: string }>>([]);
    const [view, setView] = useState<'upload' | 'results'>('upload');
    const [resolvedLineIds, setResolvedLineIds] = useState(new Set<string>());
    const analyzeSuccessfulFile = useCallback((results: UploadResponse, file: File, charLimitSubmit: number) => {

    if (results && results['long lines'].length > 0){
	const linesWithIDs = results['long lines'].map(line => ({...line,
	  id: uuidv4()
	}));
	setlinesClientIDs(linesWithIDs);
    }
    setResults(results);
    setFile(file);
    setcharLimitSubmit(charLimitSubmit);
    setView('results');
    }, []);


    
    const handleResolve = useCallback((lineIdToDelete: string, isResolved: boolean) => {
	//setlinesClientIDs(prevLines => prevLines.filter(line=> line.id !== lineIdToDelete));
	if(isResolved === false){
	    const newResolvedLineIds = new Set(resolvedLineIds)
	    setResolvedLineIds(newResolvedLineIds.add(lineIdToDelete));
	}else{
	    const newResolvedLineIds = new Set(resolvedLineIds)
	    newResolvedLineIds.delete(lineIdToDelete);
	    setResolvedLineIds(newResolvedLineIds);
	} 
    }, [resolvedLineIds]);



   const clearFile = useCallback(() => {
	setFile(null);
	setResults(null);
	setError(null);
	setlinesClientIDs([]);
	setView('upload');
	setSelectedPage(null);
   }, []);

 const filteredLines = selectedPage !== null
        ? linesClientIDs.filter(line => line.page === selectedPage)
        : linesClientIDs;

return (

        <>

	  <Box sx={{zIndex:1000,top:0, position:'fixed', width: '100%', height: 80, bgcolor: 'white', display: 'flex', alignItems: 'center', px: 4, boxShadow: 3, justifyContent: 'center'}}>

	<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <img src={logoImage} style={{
	height: '75px',
	paddingRight: '7rem'
    }} />  
	  	</Box>
    </Box>
            {view === 'upload' && (
		<Box sx={{}}>
                <UploadPage onFileAnalyzed={analyzeSuccessfulFile} />
		</Box>
            )}
            
            {view === 'results' && results && file && (
                <ResultsPage
                    results={results}
                    file={file}
                    charLimit={charLimitSubmit}
                    filteredLines={filteredLines}
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                    handleResolve={handleResolve}
                    clearFile={clearFile}
		    resolvedLineIds={resolvedLineIds}
                />
            )}
        </>
    );
};

export default App
