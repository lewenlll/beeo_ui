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
  Typography,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  Snackbar,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import BreadcrumbNav from '../common/BreadcrumbNav';
import { useNavigate } from 'react-router-dom';

// Mock data for initial development
const mockCases = [
  { 
    id: 'CASE001', 
    fileNo: 'EMSD/EEO/BC/19/01/06',
    caseEngineer: 'E/EEB2/1',
    status: 'In Progress', 
    caseType: 'REA Registration',
    createdDate: '2023-11-20',
    lastUpdated: '2023-11-25'
  },
  { 
    id: 'CASE002', 
    fileNo: 'EMSD/EEO/BC/19/01/07',
    caseEngineer: 'E/EEB3/2',
    status: 'Pending', 
    caseType: 'REA Registration',
    createdDate: '2023-11-18',
    lastUpdated: '2023-11-22'
  },
  { 
    id: 'CASE003', 
    fileNo: 'EMSD/EEO/BC/19/01/08',
    caseEngineer: 'E/EEB1/3',
    status: 'Completed', 
    caseType: 'REA Renewal',
    createdDate: '2023-11-15',
    lastUpdated: '2023-11-21'
  },
  { 
    id: 'CASE004', 
    fileNo: 'EMSD/EEO/BC/19/01/09',
    caseEngineer: 'E/EEB2/4',
    status: 'Rejected', 
    caseType: 'REA Change',
    createdDate: '2023-11-10',
    lastUpdated: '2023-11-19'
  },
];

// Status options for dropdown
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Rejected', label: 'Rejected' }
];

// Case type options for dropdown
const caseTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'REA Registration', label: 'REA Registration' },
  { value: 'REA Renewal', label: 'REA Renewal' },
  { value: 'REA Change', label: 'REA Change' }
];

const CaseSearch = () => {
  const navigate = useNavigate();
  
  // State for search criteria
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchCaseType, setSearchCaseType] = useState('');
  const [searchEngineer, setSearchEngineer] = useState('');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  
  // State for search results and pagination
  const [searchResults, setSearchResults] = useState(mockCases);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  // State for saved searches
  const [savedSearches, setSavedSearches] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Handle search function
  const handleSearch = () => {
    // Add current keyword to the keywords array if it's not empty
    if (searchKeyword.trim() !== '') {
      if (!searchKeywords.includes(searchKeyword.trim())) {
        setSearchKeywords([...searchKeywords, searchKeyword.trim()]);
      }
      setSearchKeyword(''); // Clear the input field after adding
    }
    
    // Filter mock data based on all search criteria
    const filteredResults = mockCases.filter(caseItem => {
      // Check if all keywords are included in any of the case fields
      const keywordsMatch = searchKeywords.length === 0 || searchKeywords.every(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          caseItem.id.toLowerCase().includes(lowerKeyword) ||
          caseItem.fileNo.toLowerCase().includes(lowerKeyword) ||
          caseItem.caseType.toLowerCase().includes(lowerKeyword) ||
          caseItem.status.toLowerCase().includes(lowerKeyword) ||
          caseItem.caseEngineer.toLowerCase().includes(lowerKeyword)
        );
      });
      
      return keywordsMatch &&
        (searchStatus === '' || caseItem.status === searchStatus) &&
        (searchCaseType === '' || caseItem.caseType === searchCaseType) &&
        (searchEngineer === '' || caseItem.caseEngineer.toLowerCase().includes(searchEngineer.toLowerCase()));
    });
    
    setSearchResults(filteredResults);
    setPage(1); // Reset to first page when searching
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchKeyword('');
    setSearchKeywords([]);
    setSearchStatus('');
    setSearchCaseType('');
    setSearchEngineer('');
    setSearchResults(mockCases);
  };
  
  // Remove a keyword chip
  const handleRemoveKeyword = (keywordToRemove) => {
    const updatedKeywords = searchKeywords.filter(keyword => keyword !== keywordToRemove);
    setSearchKeywords(updatedKeywords);
    
    // Re-run search with updated keywords
    setTimeout(() => handleSearch(), 0);
  };

  // Save current search criteria
  const handleSaveSearch = () => {
    const newSavedSearch = {
      id: Date.now(),
      name: `Search ${savedSearches.length + 1}`,
      criteria: {
        keywords: searchKeywords,
        status: searchStatus,
        caseType: searchCaseType,
        engineer: searchEngineer
      }
    };
    
    setSavedSearches([...savedSearches, newSavedSearch]);
    setSnackbarMessage('Search criteria saved successfully');
    setSnackbarOpen(true);
  };

  // Load a saved search
  const handleLoadSavedSearch = (savedSearch) => {
    setSearchKeyword('');
    setSearchKeywords(savedSearch.criteria.keywords || []);
    setSearchStatus(savedSearch.criteria.status);
    setSearchCaseType(savedSearch.criteria.caseType);
    setSearchEngineer(savedSearch.criteria.engineer);
    
    // Execute the search with loaded criteria
    const filteredResults = mockCases.filter(caseItem => {
      // Check if all keywords are included in any of the case fields
      const keywordsMatch = !savedSearch.criteria.keywords || savedSearch.criteria.keywords.length === 0 || 
        savedSearch.criteria.keywords.every(keyword => {
          const lowerKeyword = keyword.toLowerCase();
          return (
            caseItem.id.toLowerCase().includes(lowerKeyword) ||
            caseItem.fileNo.toLowerCase().includes(lowerKeyword) ||
            caseItem.caseType.toLowerCase().includes(lowerKeyword) ||
            caseItem.status.toLowerCase().includes(lowerKeyword) ||
            caseItem.caseEngineer.toLowerCase().includes(lowerKeyword)
          );
        });
      
      return keywordsMatch &&
        (savedSearch.criteria.status === '' || caseItem.status === savedSearch.criteria.status) &&
        (savedSearch.criteria.caseType === '' || caseItem.caseType === savedSearch.criteria.caseType) &&
        (savedSearch.criteria.engineer === '' || caseItem.caseEngineer.toLowerCase().includes(savedSearch.criteria.engineer.toLowerCase()));
    });
    
    setSearchResults(filteredResults);
    setPage(1);
  };

  // Handle view case details
  const handleViewCase = (id) => {
    navigate(`/cases/${id}`);
  };

  // Handle edit case
  const handleEditCase = (id) => {
    navigate(`/cases/${id}?edit=true`);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Get current page of results
  const currentPageResults = searchResults.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Get status chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'primary';
      case 'Pending':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'Cases', path: '/cases' },
          { label: 'Search', path: '/cases/search' }
        ]} />
        
        <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 4, fontWeight: 'medium' }}>
          Case Management
        </Typography>

        <Grid container spacing={3}>
          {/* Left column - Search form and results */}
          <Grid item xs={12} md={savedSearches.length > 0 ? 9 : 12}>
            {/* Search Form */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
                Case Search
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Keyword"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    size="small"
                    placeholder="Search in all fields"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </Grid>
                
                {/* Display active keyword chips */}
                {searchKeywords.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {searchKeywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          color="primary"
                          onDelete={() => handleRemoveKeyword(keyword)}
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      ))}
                      {searchKeywords.length > 0 && (
                        <Chip
                          label="Clear All"
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSearchKeywords([]);
                            setTimeout(() => handleSearch(), 0);
                          }}
                          sx={{ borderColor: 'error.main', color: 'error.main' }}
                        />
                      )}
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      value={searchStatus}
                      label="Status"
                      onChange={(e) => setSearchStatus(e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    fullWidth
                    startIcon={<SearchIcon />}
                    sx={{ height: '40px', boxShadow: 2 }}
                  >
                    Search
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleSaveSearch}
                      sx={{ flex: 1, height: '40px' }}
                      startIcon={<BookmarkIcon />}
                      color="primary"
                    >
                      Save
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                      startIcon={<FilterListIcon />}
                      sx={{ height: '40px' }}
                    >
                      {advancedFiltersOpen ? 'Hide Filters' : 'More Filters'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Advanced Filters */}
              {advancedFiltersOpen && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Advanced Filters
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="case-type-select-label">Case Type</InputLabel>
                        <Select
                          labelId="case-type-select-label"
                          value={searchCaseType}
                          label="Case Type"
                          onChange={(e) => setSearchCaseType(e.target.value)}
                        >
                          {caseTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Case Engineer"
                        value={searchEngineer}
                        onChange={(e) => setSearchEngineer(e.target.value)}
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={handleClearFilters}
                        fullWidth
                        startIcon={<ClearIcon />}
                      >
                        Clear Filters
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>

            {/* Search Results */}
            <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ mr: 1 }} />
                  Search Results
                </Typography>
                <Chip 
                  label={`${searchResults.length} cases found`} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ bgcolor: 'white', fontWeight: 'medium' }}
                />
              </Box>
              
              {searchResults.length > 0 ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>Case ID</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>File No.</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Case Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Case Engineer</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentPageResults.map((caseItem) => (
                          <TableRow key={caseItem.id} hover>
                            <TableCell>{caseItem.id}</TableCell>
                            <TableCell>{caseItem.fileNo}</TableCell>
                            <TableCell>{caseItem.caseType}</TableCell>
                            <TableCell>
                              <Chip 
                                label={caseItem.status} 
                                size="small" 
                                color={getStatusChipColor(caseItem.status)}
                              />
                            </TableCell>
                            <TableCell>{caseItem.caseEngineer}</TableCell>
                            <TableCell>{caseItem.createdDate}</TableCell>
                            <TableCell align="right">
                              <Tooltip title="View Case Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewCase(caseItem.id)}
                                  sx={{ mr: 1 }}
                                  color="primary"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Case">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditCase(caseItem.id)}
                                  color="secondary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Pagination */}
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing {Math.min((page - 1) * rowsPerPage + 1, searchResults.length)} - {Math.min(page * rowsPerPage, searchResults.length)} of {searchResults.length} cases
                    </Typography>
                    <Pagination 
                      count={Math.ceil(searchResults.length / rowsPerPage)} 
                      page={page} 
                      onChange={handleChangePage} 
                      color="primary" 
                      showFirstButton 
                      showLastButton
                      size="medium"
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ py: 6, px: 4, textAlign: 'center' }}>
                  <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto', mb: 3 }}>
                    <SearchIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No cases found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      No cases found matching your search criteria. Try adjusting your filters or search terms.
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={handleClearFilters}
                      startIcon={<ClearIcon />}
                      sx={{ px: 3 }}
                    >
                      Clear filters and try again
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Right column - Saved searches */}
          {savedSearches.length > 0 && (
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BookmarkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Saved Searches
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {savedSearches.map((savedSearch) => (
                    <Box 
                      key={savedSearch.id} 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        border: '1px solid #eee', 
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)', borderColor: 'primary.light' },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}
                      onClick={() => handleLoadSavedSearch(savedSearch)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BookmarkBorderIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2">{savedSearch.name}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {savedSearch.criteria.keywords && savedSearch.criteria.keywords.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            {savedSearch.criteria.keywords.map((keyword, idx) => (
                              <Chip 
                                key={idx} 
                                label={keyword} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                              />
                            ))}
                          </Box>
                        )}
                        {savedSearch.criteria.status && (
                          <Chip label={`Status: ${savedSearch.criteria.status}`} size="small" variant="outlined" />
                        )}
                        {savedSearch.criteria.caseType && (
                          <Chip label={`Type: ${savedSearch.criteria.caseType}`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CaseSearch;