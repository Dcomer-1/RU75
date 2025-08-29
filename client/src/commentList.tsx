import {  Typography, Stack } from '@mui/material';
import type { LineInfo } from './types';
import LineCard from './components/Card';

interface CommentsListProps {
  longLines: Array<LineInfo & { id: string }>;
  charLimitSubmit : number;
  onResolve: (lineId: string, isResolved: boolean) => void;
  resolvedLineIds : Set<string>;
}


const CommentsList: React.FC<CommentsListProps> = ({
  longLines,
  charLimitSubmit,
  onResolve,
  resolvedLineIds,
}) => {
  if (!longLines || longLines.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
        No long lines found.
      </Typography>
    );
  }


return (
    <Stack spacing={2} sx={{ mt: 4, px: 2}}>
	<LineCard 
	longLines={longLines} 
	charLimitSubmit={charLimitSubmit} 
	onResolve={onResolve}
	resolvedLineIds={resolvedLineIds}/>	
    </Stack>
      );
    };

export default CommentsList;
