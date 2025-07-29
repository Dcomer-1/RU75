import React from 'react';
import { Card, CardContent, Typography, Stack, CardActions, Button } from '@mui/material';
import type { LineInfo } from './types';


interface CommentsListProps {
  longLines: Array<LineInfo & { id: string }>;
  charLimitSubmit : number;
  onResolve: (lineId: string) => void;
}


const CommentsList: React.FC<CommentsListProps> = ({ longLines, charLimitSubmit, onResolve}) => {
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
              Page {line.page} — Line {line.lineNumber} — {line.charlength}/{charLimitSubmit} Chars
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {line.text}
            </Typography>
	    <CardActions>
		<Button variant="contained" sx={{
		    backgroundColor: "green",
		    color: "white",
		    justifyContent: ""
		}} onClick={() => onResolve(line.id)}>Resolve</Button>

		<Button variant="contained" sx={{
		    backgroundColor: "white",
		    color: "black"
		}}>Ai Suggestion</Button>
	    </CardActions>

          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default CommentsList;
