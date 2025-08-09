import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import {
  KeyboardArrowDown as ChevronDownIcon,
} from "@mui/icons-material";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
interface PageFilterProps {
  availablePages: (number)[];
  selectedPage: number | null;
  onPageChange: (page: number | null) => void;
}

const PageFilter: React.FC<PageFilterProps> = ({ 
  availablePages, 
  selectedPage, 
  onPageChange 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  
  const displayText = selectedPage ? `Page: ${selectedPage}` : "All Pages";
  //const activeCount = selectedPage ? 1 : 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePageSelect = (page: number | null) => {
    onPageChange(page);
    handleClose();
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <FilterAltOutlinedIcon color="action" />
      
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<ChevronDownIcon />}
        sx={{
          minWidth: 140,
          justifyContent: 'space-between',
          textTransform: 'none',
	  borderColor: 'grey.400',
	  color: 'black',
	  bgcolor: 'grey.10'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={500}>
            {displayText}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => handlePageSelect(null)}
          selected={!selectedPage}
	sx={{ '&.Mui-selected': { bgcolor: 'hsla(348, 100%, 96.1%, 0.99)', color: '#cc0033',
	  fontWeight: 'bold',
	  borderRadius: 1,
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'rgba(204, 0, 51, 0.2)',
        },}}
        >
          <Box display="flex" justifyContent="space-between" width="100%" >
            <Typography variant="body2" fontWeight={500}>
              All Pages
            </Typography>
          </Box>
        </MenuItem>
        
        {availablePages.map((page) => (
          <MenuItem
            key={page}
            onClick={() => handlePageSelect(page)}
            selected={selectedPage === page}
	sx={{ '&.Mui-selected': { bgcolor: 'hsla(348, 100%, 96.1%, 0.99)', color: '#cc0033',
	  fontWeight: 'bold',
	  borderRadius: 1,
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'rgba(204, 0, 51, 0.2)',
        },}}

          >
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="body2">
                Page: {page}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default PageFilter;

