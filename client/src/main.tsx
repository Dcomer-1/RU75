import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ClerkProvider } from '@clerk/clerk-react';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark' if you want dark mode
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/sign-in" 
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      >
	<ThemeProvider theme={theme}> 
	  <CssBaseline /> {/* Resets and normalizes CSS */}
	  <App />
	</ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
