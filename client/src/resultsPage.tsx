import React from 'react';
import { Card, CardContent, CardHeader, Box, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Upload } from '@mui/icons-material';
import CommentsList from './commentList';
import type { UploadResponse, LineInfo } from './types';

interface resultsPageProps{
   results: UploadResponse;
   file: File;
   charLimit: number;
   filteredLines: Array<LineInfo & { id: string }>;
   selectedPage: number | null;
   setSelectedPage: (page: number | null) => void;
   handleResolve: (lineIdToDelete: string) => void;
   clearFile: () => void;
}
const ResultsPage: React.FC<resultsPageProps> = ({
    results,
    file,
    charLimit, 
    filteredLines,
    selectedPage, 
    setSelectedPage,
    handleResolve,
    clearFile
}) => {
return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', my: 4 }} className="fade-in">
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ color: '#cc0033', fontWeight: 700 }}>
              RU75 Analysis Results
            </Typography>
          }
          subheader={
            <Typography variant="body2">
              File: {file?.name} | Character Limit: {charLimit}
            </Typography>
          }
          action={
            <Button
              variant="outlined"
              onClick={clearFile}
              startIcon={<Upload />}
              sx={{
                borderColor: '#cc0033',
                color: '#cc0033',
                '&:hover': {
                  borderColor: '#a6002a',
                  backgroundColor: 'rgba(204, 0, 51, 0.04)',
                },
              }}
            >
              Upload New PDF
            </Button>
          }
        />
      </Card>

      {/* Page Filter */}
      {results && results['long lines']?.length > 0 && (
        <FormControl sx={{ mb: 3, minWidth: 240 }}>
          <InputLabel>Select Page</InputLabel>
          <Select
            value={selectedPage === null ? '' : selectedPage}
            label="Select Page"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPage(String(value) === '' ? null : Number(value));
            }}
          >
            <MenuItem value="">All Pages</MenuItem>
            {[...new Set(results['long lines'].map((line) => line.page))].map((pageNum) => (
              <MenuItem key={pageNum} value={pageNum}>
                Page {pageNum}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

      {/* Results Summary & Comments */}
      {results?.['long lines']?.length > 0 && (
        <Box>
          <Card sx={{ mb: 3, backgroundColor: 'white', borderRadius: 2, borderLeft: 3, borderColor: ' #cc0033 '}}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#333', mb: 1, fontWeight: 600 }}>
                {filteredLines.length} line{filteredLines.length !== 1 ? 's' : ''} exceed {charLimit} characters
                {selectedPage !== null && ` on page ${selectedPage}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Resolve" when you've shortened a line, or review the AI suggestion.
              </Typography>
            </CardContent>
          </Card>

          <CommentsList
            longLines={filteredLines}
            charLimitSubmit={charLimit}
            onResolve={handleResolve}
          />
        </Box>
      )}
    </Box>
  );
};

export default ResultsPage;

