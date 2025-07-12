import React, { useState, useCallback } from 'react';
import { backendApi } from './api';
import type { UploadResponse, LineInfo } from './types';
import FileUploadForm from './fileUploadForm.tsx';
import CommentsList from './commentList.tsx';
import { Box } from '@mui/material';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [charLimit, setCharLimit] = useState<number> (75);
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<UploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<string>('Unknown');

    React.useEffect(() => {
	    const checkBackend = async () => {
	    try{
		const status = await backendApi.checkStatus();
		setBackendStatus(status.Status);
	    } catch (err) {
		setBackendStatus('Offline');
		setError('Backend Not Running');
	    }
	};
	checkBackend();
    }, []);

   const FileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
	let selectedFile;
	if (event.target.files && event.target.files.length > 0) {
	    selectedFile = event.target.files[0];
	}
	if(selectedFile){
	    if(selectedFile.type === 'application/pdf'){
		setFile(selectedFile);
		setError(null);
	    }else{
		setError('Please Upload a PDF');
		setFile(null);
	    }
	}

   }, []); 

   const SubmitFile = useCallback(async (event: React.FormEvent) => {
	event.preventDefault();
	if(!file){
	    setError('Please select file')
	    return;
	}
	setLoading(true);
	setError(null);
	setResults(null);

	try{
	    const response = await backendApi.uploadPdf(file, charLimit);
	    setResults(response);
	} catch (err){
	    setError(err instanceof Error ? err.message : "There was an error with the submission");
	}finally{
	    setLoading(false);
	}


   }, [file, charLimit]);

    const CharLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
	setCharLimit(Number(e.target.value));
      }, []);

   const clearFile = useCallback(() => {
	setFile(null);
	setResults(null);
	setError(null);	
   }, []);



return (
     <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
	<FileUploadForm
	  file={file}
	  charLimit={charLimit}
	  loading={loading}
	  error={error}
	  onFileSelect={FileSelect}
	  onCharLimitChange={CharLimitChange}
	  onSubmit={SubmitFile}
	  onClear={clearFile}
	/>
	
	{results?.['long lines'] && results['long lines'].length === 0 && (
	  <p>No long lines found.</p>
	)}

	{results?.['long lines'] && results['long lines'].length > 0 && (
	  <CommentsList longLines={results['long lines']}
	    charLimit={charLimit}
	  />
	)}
      </Box>
    );
}

export default App
