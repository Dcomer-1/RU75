import { SignIn } from "@clerk/clerk-react";
import logoImage from "../assets/RU75-01.png";
import { Box } from "@mui/material";

export default function SignInForm(){

    return (
	<Box 
	    sx={{
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100vh",       	
	    }}
	>
	   <SignIn
		appearance={{
		    layout: {
			logoImageUrl: logoImage,
			showOptionalFields: false,
			logoLinkUrl: "/logo",
		    },
		    elements: {
			logoImage: { 
			    width: '100px', 			   
			    height: 'auto', 
			},
		    }
		}}		
		signInUrl="/sign-up"

	   /> 
	</Box>
    );
}

