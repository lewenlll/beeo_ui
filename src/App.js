import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import BuildingSearch from './components/building/BuildingSearch';
import CaseDetail from './components/case/CaseDetail';
import CaseSearch from './components/case/CaseSearch';
import Dashboard from './components/dashboard/Dashboard';
import WbrsSearch from './components/wbrs/WBRSSearch';
import WbrsDetail from './components/wbrs/WBRSDetail';

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
          <Route path="/" element={<Dashboard />} />
          <Route path="/buildings" element={<BuildingSearch />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<CaseSearch />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/wbrs-search" element={<WbrsSearch />} />
          <Route path="/wbrs/:wbrsId" element={<WbrsDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
