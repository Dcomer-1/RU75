import React, { useState, useCallback } from 'react';
import type { UploadResponse, LineInfo} from './types';
import { v4 as uuidv4  } from 'uuid';
import ResultsPage from './resultsPage.tsx';
import UploadPage from './UploadPage.tsx';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<UploadResponse | null>(null);
    const [, setError] = useState<string | null>(null);
    const [charLimitSubmit, setcharLimitSubmit] = useState<number> (75); 
    const [selectedPage, setSelectedPage] = useState<number | null> (null);
    const [linesClientIDs, setlinesClientIDs] = useState<Array<LineInfo & { id: string }>>([]);
    const [view, setView] = useState<'upload' | 'results'>('upload');

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


    
    const handleResolve = useCallback((lineIdToDelete: string) => {
	setlinesClientIDs(prevLines => prevLines.filter(line=> line.id !== lineIdToDelete));

    }, []);



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
            {view === 'upload' && (
                <UploadPage onFileAnalyzed={analyzeSuccessfulFile} />
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
                />
            )}
        </>
    );
};

export default App
