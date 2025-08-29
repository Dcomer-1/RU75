import React, { useState, useCallback, useEffect } from 'react';
import type { UploadResponse, LineInfo} from './types';
import { v4 as uuidv4  } from 'uuid';
import ResultsPage from './resultsPage.tsx';
import UploadPage from './UploadPage.tsx';
import { Box} from '@mui/material';
import { SignedIn, SignedOut, SignIn, SignUp, useAuth} from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header.tsx';
import { useUser } from "@clerk/clerk-react";
import { syncUser } from './lib/supabase.ts';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<UploadResponse | null>(null);
    const [, setError] = useState<string | null>(null);
    const [charLimitSubmit, setcharLimitSubmit] = useState<number> (75); 
    const [selectedPage, setSelectedPage] = useState<number | null> (null);
    const [linesClientIDs, setlinesClientIDs] = useState<Array<LineInfo & { id: string }>>([]);
    const { user } = useUser();
    const [view, setView] = useState<'upload' | 'results'>('upload');
    const [resolvedLineIds, setResolvedLineIds] = useState(new Set<string>());
    const { getToken, userId, isLoaded, isSignedIn } = useAuth();
    const [token, setToken] = useState<string | null> (null);
    const analyzeSuccessfulFile = useCallback((results: UploadResponse, 
	file: File, charLimitSubmit: number) => {

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

    useEffect(() => {
	if(user) {
	    async function syncingUser() {
		const supabaseUserId = await syncUser(user);
		console.log('User Successfully Retrieved: ', supabaseUserId);
		}
		syncingUser();
	    }
	}, [user]);

    useEffect(() => {
	    const fetchToken = async () => {
		if (isLoaded && isSignedIn) {
		    try {
			const newToken = await getToken();
			setToken(newToken);
		    } catch (error) {
			console.error('Failed to get token:', error);
			setToken(null);
		    }
		} else {
		    setToken(null);
		}
	    };
	    
	    fetchToken();
	}, [isLoaded, isSignedIn, getToken]);

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
	<BrowserRouter>
	    <SignedIn>
		<Header/>
		<Routes>
		    <Route
			path='/'
			element={
			<>
			{view === 'upload' && (
				<UploadPage onFileAnalyzed={analyzeSuccessfulFile}
				token={token}
				/>
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
				token={token}	
				/>
			    )}
			    </>
			}
		    />
		</Routes>
	    </SignedIn>
	    <SignedOut>
		<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: "#660019", minHeight: "100vh" }}>
		    <Routes>
			<Route path='/' element={<Navigate to="/sign-in" replace/>} />
			<Route path='/sign-in' element={<SignIn />} />
			<Route path='/sign-up' element={<SignUp />} />
		    </Routes>
		</Box>
	    </SignedOut>
	</BrowserRouter>
</>
    );
};

export default App
