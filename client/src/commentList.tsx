import React from 'react';
import { Box, Chip, Card, CardContent, Typography, Stack, Button } from '@mui/material';
import type { LineInfo } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';

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
      <AnimatePresence>
	{longLines.map((line) => {
	  const isResolved = resolvedLineIds.has(line.id);
	  const severity = 'error'; // example logic, adjust as needed
	  return (
	    <motion.div
	      key={line.id}
	      initial={{ opacity: 0, scale: 0.95 }}
	      animate={{ opacity: 1, scale: 1 }}
	      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
	    >
	      <Card
		variant="outlined"
		sx={{
		  backgroundColor: isResolved ? 'rgba(0,0,0,0.05)' : 'white',
		  borderRadius: 2,
		  boxShadow: 1,
		  cursor: 'pointer',
		  opacity: isResolved ? 0.5 : 1,
		  transition: 'box-shadow 0.3s, opacity 0.3s',
		  '&:hover': {
		    boxShadow: 3,
		    borderColor: ' #cc0033',
		    transition: 'transform 0.3s ease',
		    transform: 'translateY(-8px)'
		  },
		}}
	      >
		<CardContent sx={{ pb: 2 }}>
		  {/* Header row with title info, severity chip, and action buttons */}
		  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} mb={2}>
		    <Box display="flex" alignItems="center" gap={1} flex={1}>
		      <Typography
			variant="subtitle2"
			sx={{
			  color: isResolved ? 'text.disabled' : 'text.primary',
			  textDecoration: isResolved ? 'line-through' : 'none',
			  fontWeight: 'bold',
			}}
		      >
			Page {line.page} — Line {line.lineNumber} — {line.charlength}/{charLimitSubmit} chars
		      </Typography>
		      <Chip
			label={severity === 'error' ? 'Error' : 'Warning'}
			color={severity === 'error' ? 'error' : 'warning'}
			size="small"
			sx={{ opacity: isResolved ? 0.5 : 1 }}
		      />
		    </Box>
		    
		    {/* Action buttons in top right */}
		    <Box display="flex" gap={1} flexShrink={0}>
		      <Button
			variant={isResolved ? 'contained' : 'outlined'}
			color={isResolved ? 'success' : 'primary'}
			size="small"
			startIcon={isResolved ? <CheckIcon /> : undefined}
			onClick={(e) => {
			  e.stopPropagation();
			  onResolve(line.id, isResolved);
			  //resolvedLineIds.add(line.id);
			    
			}}
			sx={{ 
			  boxShadow: 'none',
			  minWidth: 'auto',
			  px: 1.5,
			  py: 0.5,
			  fontSize: '0.75rem',
			  borderRadius: 1.5,
			  textTransform: 'none',
			  fontWeight: 600,
			  color: 'black',
			  backgroundColor: "grey.100",
			  border: 'none',
			  '&:hover':{
			    backgroundColor: "#cc0033",
			    color: "white"
			    }
			}}
		      >
			{isResolved ? 'Resolved' : 'Resolve'}
		      </Button>
		      <Button
			variant="outlined"
			size="small"
			onClick={(e) => e.stopPropagation()}
			sx={{ 
			  boxShadow: 'none',
			  minWidth: 'auto',
			  px: 1.5,
			  py: 0.5,
			  fontSize: '0.75rem',
			  borderRadius: 1.5,
			  textTransform: 'none',
			  fontWeight: 600,
			  color: 'black',
			  backgroundColor: "grey.100",
			  border: 'none',
			  '&:hover':{
			    backgroundColor: "#cc0033",
			    color: "white"
			    }
			}}
		      >
			AI Suggestion
		      </Button>
		    </Box>
		  </Box>

		  {/* Code content */}
		  <Typography
		    variant="body1"
		    sx={{
		      fontFamily: 'Inter',
		      whiteSpace: 'pre-wrap',
		      color: isResolved ? 'text.disabled' : 'text.primary',
		      textDecoration: isResolved ? 'line-through' : 'none',
		      backgroundColor: 'grey.50',
		      p: 2,
		      borderRadius: 1,
		      border: '1px solid',
		      borderColor: 'grey.200',
		    }}
		  >
		    {line.text}
		  </Typography>
		</CardContent>
	      </Card>
	    </motion.div>
	  );
	})}
      </AnimatePresence>
    </Stack>
      );
    };

export default CommentsList;
