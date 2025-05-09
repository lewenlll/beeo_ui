import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import BreadcrumbNav from '../common/BreadcrumbNav';

// Mock data
const mockSubmissions = [
  { applicationNo: 'WBRS001', status: 'Pending' },
  { applicationNo: 'WBRS002', status: 'Completed' },
];

const WBRSSearch = () => {
  const [searchAppNo, setSearchAppNo] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchResults, setSearchResults] = useState(mockSubmissions);

  const handleSearch = () => {
    const filteredResults = mockSubmissions.filter(submission =>
      submission.applicationNo.toLowerCase().includes(searchAppNo.toLowerCase()) &&
      submission.status.toLowerCase().includes(searchStatus.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'WBRS', path: '/wbrs' },
          { label: 'Search', path: '/wbrs/search' }
        ]} />

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            WBRS Search
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Application No"
              value={searchAppNo}
              onChange={(e) => setSearchAppNo(e.target.value)}
              size="small"
            />
            <TextField
              label="Status"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              sx={{ minWidth: 100 }}
            >
              Search
            </Button>
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Application No</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((submission) => (
                <TableRow key={submission.applicationNo}>
                  <TableCell>{submission.applicationNo}</TableCell>
                  <TableCell>{submission.status}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      onClick={() => console.log('View:', submission.applicationNo)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button 
                      size="small"
                      color="error"
                      onClick={() => console.log('Reject:', submission.applicationNo)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default WBRSSearch;