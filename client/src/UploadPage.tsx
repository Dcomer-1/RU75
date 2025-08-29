import React, { useState} from 'react';
import { Box, Button, TextField, Typography, Paper, Container, CircularProgress } from '@mui/material';
import { backendApi } from './api';
import type { UploadResponse } from './types';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import TroubleshootRoundedIcon from '@mui/icons-material/TroubleshootRounded';
import backgroundImage from './assets/Rutgers_Law_School_in_Newark_2.jpg';
import { useAuth } from '@clerk/clerk-react';

interface uploadPageProps{
    onFileAnalyzed: (results: UploadResponse, file: File, charLimit: number) => void;
}


const UploadPage: React.FC<uploadPageProps> = ({onFileAnalyzed}) => {
    const [file, setFile] = useState<File | null>(null);
    const [charLimit, setCharLimit] = useState<number> (75);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [, setResults] = useState<UploadResponse | null>(null);
    const {getToken} = useAuth();

    const FileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

   }; 

   const SubmitFile = async (event: React.FormEvent) => {
	event.preventDefault();
	if(!file){
	    setError('Please select file')
	    return;
	}
	setLoading(true);
	setError(null);
	try{
	    const token = await getToken();
	    const response = await backendApi.uploadPdf(file, charLimit, token);
	    //needs to stop before this point
	    onFileAnalyzed(response, file, charLimit);
	} catch (err){
	    setError(err instanceof Error ? err.message : "There was an error with the submission");
	}finally{
	    setLoading(false);
	}


   };

   
    const CharLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	setCharLimit(Number(e.target.value));
      }


   const clearFile = () => {
	setFile(null);
	setResults(null);
	setError(null);	
   }



return (
    <Box sx={{ minHeight: '100vh' , 
	background: `linear-gradient(rgba(204, 0, 51, 0.8), rgba(204, 0, 51, 0.8)), url(${backgroundImage})`,
	backgroundSize: 'cover', backgroundPosition: 'center' 
    }}>
	  {/* Main Content */}
	  <Container maxWidth="md" sx={{
	py: 8,
	animation: 'fadeIn 0.6s ease-in-out',
	'@keyframes fadeIn': {
	  from: { opacity: 0, transform: 'translateY(20px)' },
	  to: { opacity: 1, transform: 'translateY(0)' },
	},
	  }}>
	    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop:'5rem'}}>

		<Typography variant="h4" sx={{fontWeight: 700, color: 'white', textAlign: 'center', mt: 2 }}>
		  Quickly identify lines in your PDFs that exceed character limits—save time and avoid formatting issues.
		</Typography>

	      <Paper elevation={2} sx={{
		p: 4,
		minWidth: '360px',
		width: "50%",
		borderRadius: 2,
		border: '1px solid #e5e5e5',
		bgcolor: 'white',
		boxShadow: '1px 1px 2px 5px rgba(0,0,0,.2)',
		position: 'relative',
		'&::after': {
		      content: '""',
		      position: 'absolute',
		      bottom: 0,
		      left: 0,
		      height: '5px',
		      width: '100%',
		      backgroundColor: '#cc0033',
		      borderBottomLeftRadius: 3,
		      borderBottomRightRadius: 3,
		}
	      }}>
		<Box component="form" onSubmit={SubmitFile}>
		  {/* File Upload Zone */}
		  <Box
		    sx={{
		      border: `2px dashed ${file ? '#dc2626' : '#d1d5db'}`,
		      borderRadius: 2,
		      p: 4,
		      textAlign: 'center',
		      mb: 3,
		      cursor: 'pointer',
		      backgroundColor: file ? '#fef2f2' : '#fafafa',
		      '&:hover': {
			borderColor: '#b91c1c',
			backgroundColor: '#fef2f2'
		      },
		      transition: 'all 0.2s ease',
		    }}
		  >
		    <input
		      type="file"
		      accept="application/pdf"
		      onChange={FileSelect}
		      style={{ display: 'none' }}
		      id="file-upload"
		    />
		    <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
		      {file ? (
			<>
			  <UploadFileRoundedIcon sx={{ fontSize: 48, color: '#cc0033', mb: 1 }} />
			  <Typography variant="h6" sx={{ color: '#dc2626' }}>File Selected</Typography>
			  <Typography variant="body2" color="text.secondary">{file.name}</Typography>
			</>
		      ) : (
			<>
			  <UploadFileRoundedIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
			  <Typography variant="h6" sx={{ color: '#374151', 
					  }}>Select your PDF</Typography>
			  <Typography variant="body2" color="text.secondary">Click to browse files</Typography>
			</>
		      )}
		    </label>
		  </Box>

		  {/* Character Limit */}
		  <TextField
		    label="Character Limit"
		    type="number"
		    fullWidth
		    value={charLimit}
		    onChange={CharLimitChange}
		    sx={{
		      mb: 3,
		      '& .MuiOutlinedInput-root.Mui-focused fieldset': {
			borderColor: '#dc2626'
		      },
		      '& label.Mui-focused': {
			color: '#dc2626'
		      },
		     '& .MuiOutlinedInput-root:hover fieldset': {
			borderColor: '#b91c1c', // hover border
		      }
		    }}
		    helperText="Set max characters per line (10–200)"
		  />

		  {/* Error Message */}
		  {error && (
		    <Typography sx={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center', mb: 2 }}>
		      {error}
		    </Typography>
		  )}

		  {/* Buttons */}
		  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
		    <Button
		      type="submit"
		      variant="contained"
		      disabled={!file || loading}
		      startIcon={loading ? <CircularProgress size={20} sx={{color: '#9ca3af'}} /> : <TroubleshootRoundedIcon />}
		      sx={{
			px: 4,
			py: 1.5,
			boxShadow: 'none',
			backgroundColor: '#cc0033',
			fontWeight: 600,
			'&:hover': {
			  backgroundColor: '#b91c1c',
			  boxShadow: 'none'
			},
			'&:disabled': {
			  backgroundColor: '#e5e7eb',
			  color: '#9ca3af'
			}
		      }}
		    >
		      {loading ? 'Analyzing...' : 'Analyze PDF'}
		    </Button>
		    {file && (
		      <Button variant="outlined" onClick={clearFile} sx={{
		      fontWeight: 600,
		      color: '#cc0033',
		      borderColor: '#cc0033',
		      '&:hover':{
			  //backgroundColor: '#b91c1c',
			  Color: '#b91c1c',
			  borderColor: '#b91c1c'
		      }
		      }}>
			Clear
		      </Button>
		    )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default UploadPage;
