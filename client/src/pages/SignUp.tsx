import { SignUp } from "@clerk/clerk-react";
import logo from "../assets/RU75-01.png"
import { Box } from "@mui/material";

export default function SignUpForm(){
    return (

	<Box sx={{
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100vh",
	}}>
	   <SignUp
		appearance={{
		    layout: {
			logoImageUrl: logo,
			showOptionalFields: false,
			logoLinkUrl: "/logo",
		    }
		}}		
		signInUrl="/sign-in"
	   />
	</Box>
    );
}
