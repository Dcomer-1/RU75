import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark' if you want dark mode
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets and normalizes CSS */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
