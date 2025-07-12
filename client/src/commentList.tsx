import React from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import type { LineInfo } from './types';


interface CommentsListProps {
  longLines: LineInfo[];
  charLimit : number;
}


const CommentsList: React.FC<CommentsListProps> = ({ longLines, charLimit  }) => {
  if (!longLines || longLines.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
        No long lines found.
      </Typography>
    );
  }

  
    return (
    <Stack spacing={2} sx={{ mt: 4 }}>
      {longLines.map((line, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Page {line.page} — Line {line.lineNumber} — {line.charlength}/{charLimit} Chars
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {line.text}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default CommentsList;
