import { Box } from "@mui/material"
import logoImage from '../assets/RU75-01.png';
import { UserButton } from "@clerk/clerk-react";


const Header = () => {

    return(
	<Box
	  sx={{
	    zIndex: 1000,
	    top: 0,
	    position: 'fixed',
	    width: '100%',
	    height: 80,
	    bgcolor: 'white',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'space-between', // space between left (empty), center, right
	    boxShadow: 3,
	    paddingY: '3px'
	  }}>
	  {/* Empty box to help center logo */}
	      <Box sx={{ width: '80px' }} />

	      {/* Centered Logo */}
	      <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
		<img
		  src={logoImage}
		  alt="Logo"
		  style={{
		    height: '75px',
		  }}
		/>
	      </Box>


	      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingRight: 2 }}>
		<UserButton  showName={true} />
	      </Box>
	</Box>
    );
};

export default Header
