import React from 'react';
import { IconButton,  Card, CardContent, Box, Typography,} from '@mui/material';
import CommentsList from './commentList';
import type { UploadResponse, LineInfo } from './types';
import { UploadFile, Delete } from '@mui/icons-material';
import PageFilter from './components/PageFilter';
import { backendApi } from './api';
import { useAuth } from '@clerk/clerk-react';

interface resultsPageProps{
   results: UploadResponse;
   file: File;
   charLimit: number;
   filteredLines: Array<LineInfo & { id: string }>;
   selectedPage: number | null;
   setSelectedPage: (page: number | null) => void;
   handleResolve: (lineIdToDelete: string, isResolved: boolean) => void;
   clearFile: () => void;
   resolvedLineIds: Set<string>;
   token: string | null;
}
const ResultsPage: React.FC<resultsPageProps> = ({
    results,
    file,
    charLimit, 
    filteredLines,
    selectedPage, 
    setSelectedPage,
    handleResolve,
    clearFile,
    resolvedLineIds,
}) => {

const {getToken} = useAuth();
async function handleDelete () {
    try{
	const token = await getToken();
	await backendApi.deletePdf(file, token); 
	console.log('PDF successfully deleted')
	return true
    }
    catch (error){
	console.error('Error Deleting File:',error)
	return false
    }

}

    const availablePages = [...new Set(results['long lines'].map((line) => line.page))];
return (
<Box sx={{ paddingTop: 12, maxWidth: 1000, mx: 'auto', my: 4, px: 2 }} className="fade-in">
  {/* Summary and File Card Side-by-Side */}
  {results && results['long lines']?.length > 0 && (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
        }}
      >
        {/* Summary Card */}
        <Card
          sx={{
            flex: 1,
            minWidth: '50%',
            backgroundColor: 'white',
            borderRadius: 2,
            borderLeft: 3,
            borderColor: '#cc0033',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: '#333', mb: 1, fontWeight: 600 }}>
              {filteredLines.length} line{filteredLines.length !== 1 ? 's' : ''} exceed {charLimit} characters
              {selectedPage !== null && ` on page ${selectedPage}`}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Click "Resolve" when you've shortened a line, or review the AI suggestion.
            </Typography>
          </CardContent>
        </Card>

        {/* File Card */}
        <Card
          elevation={1}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 2,
            borderLeft: 3,
            borderColor: '#cc0033',
            bgcolor: 'background.paper',
            marginBottom: '0px',
          }}
        >
          {/* File Info Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 0 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UploadFile sx={{ fontSize: 24, color: '#cc0033' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          </Box>

          {/* Clear File Button */}
          <IconButton
            onClick={async() => {
		const success = await handleDelete();
		if (success) {
		    clearFile();
		}
		else {
		   console.error('Error with clear file button'); 	
		}
	    }}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: '#cc0033',
                bgcolor: 'hsla(348, 100%, 96.1%, 0.99)',
              },
            }}
          >
            <Delete />
          </IconButton>
        </Card>
      </Box>

      {/* Page Filter */}
      <Box sx={{ mb: 4 }}>
        <PageFilter 
          availablePages={availablePages}
          selectedPage={selectedPage}
          onPageChange={setSelectedPage}
        />
      </Box>
    </>
  )}

  {/* No Results Display */}
  {results?.['long lines']?.length === 0 && (
    <Card sx={{ textAlign: 'center', py: 6, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#cc0033', mb: 2 }}>
          No long lines found!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All lines in your PDF are within the specified character limit.
        </Typography>
      </CardContent>
    </Card>
  )}

  {/* Results Table */}
  {results?.['long lines']?.length > 0 && (
    <CommentsList
      longLines={filteredLines}
      charLimitSubmit={charLimit}
      onResolve={handleResolve}
      resolvedLineIds={resolvedLineIds}
    />
  )}
</Box>
  );
};

export default ResultsPage;

