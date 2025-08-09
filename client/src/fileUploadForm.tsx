import React from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';

interface FileUploadFormProps {
  file: File | null;
  charLimit: number;
  loading: boolean;
  error: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCharLimitChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClear: () => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  file,
  charLimit,
  loading,
  error,
  onFileSelect,
  onCharLimitChange,
  onSubmit,
  onClear,
}) => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Upload a PDF
      </Typography>

      <Box component="form" onSubmit={onSubmit} noValidate>
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Select File
          <input type="file" hidden onChange={onFileSelect} accept="application/pdf" />
        </Button>

        {file && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected file: {file.name}
          </Typography>
        )}

	<TextField
	  label="Character Limit"
	  type="number"
	  value={charLimit}
	  onChange={onCharLimitChange}
	  inputProps={{
	    min: 10,
	    max: 200,
	    step: 1,
	    'aria-label': 'character limit input',
	  }}
          sx={{ mb: 2, display: 'block' }}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !file}
          sx={{ mr: 2 }}
        >
          Submit
        </Button>

        <Button variant="outlined" onClick={onClear} disabled={loading}>
          Clear
        </Button>

        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FileUploadForm;
