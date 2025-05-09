import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import BuildingSearch from './components/building/BuildingSearch';
import WBRSSearch from './components/wbrs/WBRSSearch';
import WBRSDetail from './components/wbrs/WBRSDetail';
import CaseDetail from './components/case/CaseDetail';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<BuildingSearch />} />
          <Route path="/buildings" element={<BuildingSearch />} />
          <Route path="/wbrs" element={<WBRSSearch />} />
          <Route path="/wbrs/:id" element={<WBRSDetail />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
