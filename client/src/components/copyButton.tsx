import { Box, Button, Popper } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

const CopyButton = ({isResolved, lineText}: {isResolved: boolean, lineText: string}) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const copyText = (text: string) =>{
	navigator.clipboard.writeText(text);
    }

    return (
	<Box position="relative" display="inline-block">
	  {/* Popup */}
	    <Button
	      onClick={(e) => {
		if (!isResolved) {
		  copyText(lineText);
		  setAnchorEl(e.currentTarget); 
		  setTimeout(() => setAnchorEl(null), 800); 
		}
	      }}
	    sx={{
	      boxShadow: "none",
	      minWidth: "auto",
	      px: 1.5,
	      py: 0.5,
	      fontSize: "0.75rem",
	      borderRadius: 1.5,
	      textTransform: "none",
	      fontWeight: 600,
	      color: "black",
	      backgroundColor: "grey.100",
	      border: "none",
	      "&:hover": {
		backgroundColor: isResolved ? "None" : "#cc0033",
		color: isResolved ? "black" : "white",
	      },
	    }}
	    >
	      Copy
	    </Button>

	    <Popper open={Boolean(anchorEl)} 
	    anchorEl={anchorEl} 
	    placement="top"
	    modifiers={[
		{
		    name: "offset",
		    options:{
			offset: [0, 6],
		    },
		}
	    ]}>
	      <motion.div
		initial={{ opacity: 0, y: 50 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: -5 }}
		transition={{ duration: 0.3 }}
		style={{
		  background: "black",
		  color: "white",
		  fontWeight: "700",
		  padding: "4px 8px",
		  borderRadius: "6px",
		  fontSize: "0.75rem",
		  whiteSpace: "nowrap",
		}}
	      >
		Copied!
	      </motion.div>
	    </Popper>
	</Box>
    )
}

export default CopyButton;
