import React, { useState, useCallback } from 'react';
import { backendApi } from './api';
import type { UploadResponse, LineInfo } from './types';
import FileUploadForm from './fileUploadForm.tsx';
import CommentsList from './commentList.tsx';
import { Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { v4 as uuidv4  } from 'uuid';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [charLimit, setCharLimit] = useState<number> (75);
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<UploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<string>('Unknown');
    const [charLimitSubmit, setcharLimitSubmit] = useState<number> (75); 
    const [selectedPage, setSelectedPage] = useState<number | null> (null);
    const [linesClientIDs, setlinesClientIDs] = useState<Array<LineInfo & { id: string }>>([]);

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
	try{
	    const response = await backendApi.uploadPdf(file, charLimit);
	    if (response && response['long lines']){
		const linesWithIDs = response['long lines'].map(line => ({...line,
		    id: uuidv4()  // Generate a unique ID for each line
		}));
		setlinesClientIDs(linesWithIDs);
	    }
	    setResults(response);
	    setcharLimitSubmit(charLimit);
	} catch (err){
	    setError(err instanceof Error ? err.message : "There was an error with the submission");
	}finally{
	    setLoading(false);
	}


   }, [file, charLimit, setcharLimitSubmit]);

    const handleResolve = useCallback((lineIdToDelete: string) => {
	setlinesClientIDs(prevLines => prevLines.filter(line=> line.id !== lineIdToDelete));

    }, []);


    const CharLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
	setCharLimit(Number(e.target.value));
      }, []);


   const clearFile = useCallback(() => {
	setFile(null);
	setResults(null);
	setError(null);	
   }, []);

    const filteredLines = selectedPage !== null
	  ? linesClientIDs.filter(line => line.page === selectedPage)
	: linesClientIDs;


return (
     <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
	{!results && (
	      <>
		<Typography variant="h3" align="center" gutterBottom>
		  PDF Line Length Analyzer
		</Typography>
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
	      </>
	    )}

	{results && (
	<>
		<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
		  <Typography variant="h4">
		    Analysis Results
		  </Typography>
		  <Button sx={{border: 'none', boxShadow: 1, fontSize: 40}} 
		    onClick={clearFile}
		    startIcon={<UploadFileRoundedIcon  sx={{color: 'black'}} />} 
		  >
		    <Typography fontSize={17} sx={{color: 'black'}}>

		    Upload New PDF

		    </Typography>
		  </Button>
		</Box>

	  <FormControl sx={{ my: 2, minWidth: 200 }}>
	    <InputLabel>Select Page</InputLabel>
	    <Select
	      value={selectedPage === null ? '' : selectedPage}
	      label="Select Page"
	      onChange={(e) => { 
		  const value = e.target.value; 
		  setSelectedPage( value === '' ? null: Number(value));
	      }}
	    >
	      <MenuItem value = "">All Pages</MenuItem>

	    {[...new Set(results['long lines'].map(line => line.page))].map((pageNum) => (
		<MenuItem key={pageNum} value={pageNum}>
		  Page {pageNum}
		</MenuItem>
	      ))}
	    </Select>
	  </FormControl>
	
	


	{results['long lines'] && results['long lines'].length === 0 && (
          <p>No long lines found.</p>
        )}

        {results['long lines'] && results['long lines'].length > 0 && (
          <CommentsList 
            longLines={filteredLines}
            charLimitSubmit={charLimitSubmit}
            onResolve={handleResolve}
          />
        )}
      </>
    )}
  </Box>
);
}

export default App
