import React, { useState } from 'react';
import { 
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container
} from '@mui/material';
import BreadcrumbNav from '../common/BreadcrumbNav';

// Mock data for initial development
const mockBuildings = [
  { id: 'BLD001', address: '123 Main Street' },
  { id: 'BLD002', address: '456 Park Avenue' },
];

const BuildingSearch = () => {
  const [searchId, setSearchId] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState(mockBuildings);

  const handleSearch = () => {
    // Filter mock data based on search criteria
    const filteredResults = mockBuildings.filter(building => 
      building.id.toLowerCase().includes(searchId.toLowerCase()) &&
      building.address.toLowerCase().includes(searchAddress.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleCreateBuilding = () => {
    // To be implemented with backend integration
    console.log('Create building clicked');
  };

  const handleView = (id) => {
    // To be implemented with routing
    console.log('View building:', id);
  };

  const handleEdit = (id) => {
    // To be implemented with routing
    console.log('Edit building:', id);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'Buildings', path: '/buildings' },
          { label: 'Search', path: '/buildings/search' }
        ]} />

        {/* Search Form */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Building Search
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Building ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              size="small"
            />
            <TextField
              label="Address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              sx={{ minWidth: 100 }}
            >
              Search
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleCreateBuilding}
              sx={{ minWidth: 150 }}
            >
              Create Building
            </Button>
          </Box>
        </Paper>

        {/* Search Results Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Building ID</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((building) => (
                <TableRow key={building.id}>
                  <TableCell>{building.id}</TableCell>
                  <TableCell>{building.address}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      onClick={() => handleView(building.id)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => handleEdit(building.id)}
                    >
                      Edit
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

export default BuildingSearch;