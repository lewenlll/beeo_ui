import React, { useState, useEffect, useCallback } from 'react';
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
  Pagination,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AppSidebar from '../common/AppSidebar';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Updated Mock data for WBRS Applications
const mockWbrsApplications = [
  { 
    id: 'WBRS001', 
    applicantName: 'Tech Solutions Ltd.',
    status: 'Pending', 
    applicationType: 'REA Registration',
    createdDate: '2023-12-01',
    lastUpdated: '2023-12-05',
  },
  { 
    id: 'WBRS002', 
    applicantName: 'Green Energy Corp.',
    status: 'Case Created', 
    applicationType: 'REA Registration',
    createdDate: '2023-11-28',
    lastUpdated: '2023-12-04',
  },
  { 
    id: 'WBRS003', 
    applicantName: 'Innovate Systems',
    status: 'New', 
    applicationType: 'REA Registration',
    createdDate: '2023-11-15',
    lastUpdated: '2023-11-20',
  },
  { 
    id: 'WBRS004', 
    applicantName: 'Global Mech Inc.',
    status: 'Rejected', 
    applicationType: 'Other Type',
    createdDate: '2023-12-02',
    lastUpdated: '2023-12-06',
  },
  { 
    id: 'WBRS005', 
    applicantName: 'Future Build Co.',
    status: 'Cancelled', 
    applicationType: 'Other Type',
    createdDate: '2023-12-05',
    lastUpdated: '2023-12-05',
  }
];

// Updated Status options for dropdown
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Case Created', label: 'Case Created' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Cancelled', label: 'Cancelled' }
];

// Application type options for dropdown
const applicationTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'REA Registration', label: 'REA Registration' },
  { value: 'Other Type', label: 'Other Type' }
];

// Mock logged in user - in a real app, this would come from authentication context
// This might not be directly relevant for WBRS search criteria if not filtering by user assigned.
// const loggedInUser = "WBRS_Admin"; 

const WbrsSearch = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  // State for search criteria
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchApplicationType, setSearchApplicationType] = useState('');
  const [searchApplicantName, setSearchApplicantName] = useState(''); // New field
  const [searchCreatedDateFrom, setSearchCreatedDateFrom] = useState('');
  const [searchCreatedDateTo, setSearchCreatedDateTo] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Removed showTaskFilters as tasks are not part of WBRS Applications
  
  // State for search results and pagination
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);
  
  // State for expanded rows - Not needed as there are no sub-details like tasks here
  // const [expandedRows, setExpandedRows] = useState({}); 
  
  // State for table sorting
  const [sortField, setSortField] = useState('id'); // Default sort by WBRS No.
  const [sortDirection, setSortDirection] = useState('asc');
  
  // State for saved searches
  const [savedSearches, setSavedSearches] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState(null);
  const [activeSavedSearch, setActiveSavedSearch] = useState(null);

  // Initialize default saved searches (optional, can be adapted or removed for WBRS)
  useEffect(() => {
    const storedAppsData = JSON.parse(sessionStorage.getItem('wbrsApplications'));
    let appsToLoad = mockWbrsApplications;
    if (storedAppsData) {
        // If WBRSDetail stores data as an object of objects
        appsToLoad = Object.values(storedAppsData);
    } else {
        // Initialize session storage if it doesn't exist
        sessionStorage.setItem('wbrsApplications', JSON.stringify(
            mockWbrsApplications.reduce((obj, item) => {
                obj[item.id] = item;
                return obj;
            }, {})
        ));
    }
    setSearchResults(appsToLoad);

    if (savedSearches.length === 0) {
      setSavedSearches([
        {
          id: 1,
          name: "Pending REA Registrations",
          isDefault: true, 
          criteria: {
            keywords: [],
            status: 'Pending',
            applicationType: 'REA Registration',
            applicantName: '',
            createdDateFrom: '',
            createdDateTo: '',
          }
        }
      ]);
    }
  }, [savedSearches.length]);

  const [pendingSearch, setPendingSearch] = useState(false);

  const handleSearch = () => {
    setActiveSavedSearch(null);
    setPendingSearch(true);
    setPage(1); 
  };

  React.useEffect(() => {
    if (!pendingSearch) return;

    let updatedKeywords = searchKeywords;
    if (searchKeyword.trim() !== '') {
      if (!searchKeywords.includes(searchKeyword.trim())) {
        updatedKeywords = [...searchKeywords, searchKeyword.trim()];
        setSearchKeywords(updatedKeywords);
      }
      setSearchKeyword(''); 
    }

    const storedAppsData = JSON.parse(sessionStorage.getItem('wbrsApplications')) || {};
    const appsArray = Object.values(storedAppsData);

    const filteredResults = appsArray.filter(appItem => {
      const keywordsMatch = updatedKeywords.length === 0 || updatedKeywords.every(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          appItem.id.toLowerCase().includes(lowerKeyword) ||
          appItem.applicationType.toLowerCase().includes(lowerKeyword) ||
          appItem.status.toLowerCase().includes(lowerKeyword) ||
          (appItem.applicantName && appItem.applicantName.toLowerCase().includes(lowerKeyword))
        );
      });
      
      const createdDate = new Date(appItem.createdDate);
      const dateFromMatch = !searchCreatedDateFrom || new Date(searchCreatedDateFrom) <= createdDate;
      const dateToMatch = !searchCreatedDateTo || new Date(searchCreatedDateTo) >= createdDate;
      
      const wbrsAppMatch = 
        (searchStatus === '' || appItem.status === searchStatus) &&
        (searchApplicationType === '' || appItem.applicationType === searchApplicationType) &&
        (searchApplicantName === '' || (appItem.applicantName && appItem.applicantName.toLowerCase().includes(searchApplicantName.toLowerCase()))) &&
        dateFromMatch && dateToMatch;
        
      return keywordsMatch && wbrsAppMatch;
    });
    
    setSearchResults(filteredResults);
    setPage(1); 
    setPendingSearch(false);
  }, [pendingSearch, searchKeywords, searchStatus, searchApplicationType, searchApplicantName, searchCreatedDateFrom, searchCreatedDateTo, searchKeyword]);

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSearchKeywords([]);
    setSearchStatus('');
    setSearchApplicationType('');
    setSearchApplicantName('');
    setSearchCreatedDateFrom('');
    setSearchCreatedDateTo('');
    const storedAppsData = JSON.parse(sessionStorage.getItem('wbrsApplications')) || {};
    setSearchResults(Object.values(storedAppsData));
    setActiveSavedSearch(null);
  };
  
  const handleRemoveKeyword = (keywordToRemove) => {
    const updatedKeywords = searchKeywords.filter(keyword => keyword !== keywordToRemove);
    setSearchKeywords(updatedKeywords);
    setTimeout(() => handleSearch(), 0);
  };

  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [editingBookmark, setEditingBookmark] = useState(null);

  const handleSaveSearch = () => {
    setBookmarkName(`Search ${savedSearches.length + 1}`);
    setEditingBookmark(null);
    setBookmarkDialogOpen(true);
  };
  
  const handleConfirmBookmark = () => {
    const currentCriteria = {
      keywords: searchKeywords,
      status: searchStatus,
      applicationType: searchApplicationType,
      applicantName: searchApplicantName,
      createdDateFrom: searchCreatedDateFrom,
      createdDateTo: searchCreatedDateTo,
    };

    if (editingBookmark) {
      const updatedSavedSearches = savedSearches.map(search => 
        search.id === editingBookmark.id ? 
        { ...search, name: bookmarkName, criteria: currentCriteria } : search // Also update criteria if editing
      );
      setSavedSearches(updatedSavedSearches);
      setSnackbarMessage(`Search "${bookmarkName}" updated successfully`);
    } else {
      const newSavedSearch = {
        id: Date.now(),
        name: bookmarkName,
        criteria: currentCriteria
      };
      setSavedSearches([...savedSearches, newSavedSearch]);
      setSnackbarMessage(`Search "${bookmarkName}" saved successfully`);
    }
    setBookmarkDialogOpen(false);
    setSnackbarOpen(true);
  };
  
  const handleEditBookmark = (bookmark) => {
    setBookmarkName(bookmark.name);
    setEditingBookmark(bookmark);
    // Also load criteria into search fields if desired for editing experience
    setSearchKeywords(bookmark.criteria.keywords || []);
    setSearchStatus(bookmark.criteria.status || '');
    setSearchApplicationType(bookmark.criteria.applicationType || '');
    setSearchApplicantName(bookmark.criteria.applicantName || '');
    setSearchCreatedDateFrom(bookmark.criteria.createdDateFrom || '');
    setSearchCreatedDateTo(bookmark.criteria.createdDateTo || '');
    setBookmarkDialogOpen(true);
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchKeyword(''); // Clear single keyword input
    setSearchKeywords(savedSearch.criteria.keywords || []);
    setSearchStatus(savedSearch.criteria.status || '');
    setSearchApplicationType(savedSearch.criteria.applicationType || '');
    setSearchApplicantName(savedSearch.criteria.applicantName || '');
    setSearchCreatedDateFrom(savedSearch.criteria.createdDateFrom || '');
    setSearchCreatedDateTo(savedSearch.criteria.createdDateTo || '');
    
    setActiveSavedSearch(savedSearch.id);
    setPendingSearch(true); 

    setSnackbarMessage(`Loaded saved search "${savedSearch.name}"`);
    setSnackbarOpen(true);
  };

  const handleViewWbrsApp = (id) => {
    navigate(`/wbrs/${id}`); // Navigate to WBRS detail page
  };

  // Handle sorting - No changes needed if fields are simple strings/numbers
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedResults = () => {
    if (!searchResults) return [];
    const sortedResults = [...searchResults].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
    return sortedResults.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  };
  
  const currentPageResults = getSortedResults();

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'New': return 'info';
      case 'Pending': return 'warning';
      case 'Case Created': return 'success';
      case 'Rejected': return 'error';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const handleDeleteSavedSearch = (search) => {
    setSearchToDelete(search);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSavedSearch = () => {
    if (searchToDelete && !searchToDelete.isDefault) {
      const updatedSavedSearches = savedSearches.filter(search => search.id !== searchToDelete.id);
      setSavedSearches(updatedSavedSearches);
      setSnackbarMessage(`Search "${searchToDelete.name}" deleted successfully`);
      setSnackbarOpen(true);
    }
    setDeleteDialogOpen(false);
    setSearchToDelete(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Box sx={{ flex: 1, p: 1.5, overflow: 'auto', transition: theme => theme.transitions.create(['margin'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }), marginLeft: 0 }}>
        <Paper sx={{ mb: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ p: 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white', cursor: 'pointer' }} onClick={() => setFiltersOpen(!filtersOpen)}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <SearchIcon sx={{ mr: 0.75, fontSize: '1.1rem' }} />
              WBRS Application Search
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {savedSearches.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1, px: 1, mr: 1, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); /* Open saved searches if implementing dropdown */ }}>
                  <BookmarkIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                    {savedSearches.length} saved
                  </Typography>
                </Box>
              )}
              <IconButton color="inherit" aria-label="expand search" size="small">
                {filtersOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ p: 1.5, borderBottom: filtersOpen ? '1px solid #eee' : 'none' }}>
            {savedSearches.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary', mr: 1 }}>
                  Saved Searches:
                </Typography>
                {savedSearches.map((savedSearch) => (
                  <Chip
                    key={savedSearch.id}
                    label={savedSearch.name}
                    size="small"
                    variant={activeSavedSearch === savedSearch.id ? "filled" : "outlined"}
                    color="primary"
                    onClick={() => handleLoadSavedSearch(savedSearch)}
                    onDelete={savedSearch.isDefault ? undefined : () => handleDeleteSavedSearch(savedSearch)}
                    deleteIcon={savedSearch.isDefault ? <EditIcon fontSize="small" /> : undefined} // Keep edit for default, delete for others
                    sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' }, '& .MuiChip-deleteIcon': { fontSize: '0.85rem' }, fontWeight: activeSavedSearch === savedSearch.id ? 500 : 400 }}
                  />
                ))}
              </Box>
            )}

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={7} lg={7}>
                <TextField
                  fullWidth
                  label="Keyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  size="small"
                  placeholder="Search WBRS No, Applicant, Type, Status"
                  InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>), style: { fontSize: '0.875rem' } }}
                  onKeyPress={(e) => { if (e.key === 'Enter') { handleSearch(); } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={5} lg={5}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
                  <FormControl size="small" sx={{ minWidth: { xs: 130, md: 120 }, flexShrink: 1 }}>
                    <InputLabel id="status-select-label" sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
                    <Select labelId="status-select-label" value={searchStatus} label="Status" onChange={(e) => setSearchStatus(e.target.value)} sx={{ fontSize: '0.875rem' }}>
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                          {!option.value && option.label}
                          {option.value && (<Chip size="small" label={option.label} color={getStatusChipColor(option.value)} sx={{ mr: 0, minWidth: '80px', height: '20px', '& .MuiChip-label': { fontSize: '0.75rem' } }} />)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button variant="text" onClick={() => setFiltersOpen(!filtersOpen)} startIcon={<FilterListIcon sx={{ fontSize: '1rem' }} />} size="small" sx={{ minWidth: 'unset', height: '36px', fontSize: '0.75rem', display: { xs: 'none', sm: 'inline-flex', md: 'inline-flex' } }}>
                      {filtersOpen ? 'Hide' : 'More'}
                    </Button>
                    <Button variant="text" color="error" onClick={handleClearFilters} size="small" startIcon={<ClearIcon sx={{ fontSize: '1rem' }} />} sx={{ minWidth: 'unset', height: '36px', fontSize: '0.75rem', display: { xs: 'none', sm: 'inline-flex', md: 'inline-flex' } }}>
                      Clear
                    </Button>
                    <Button variant="outlined" onClick={handleSaveSearch} size="small" sx={{ minWidth: '36px', width: '36px', px: 1, height: '36px', display: { xs: 'none', sm: 'flex', md: 'flex' } }} color="primary">
                      <BookmarkIcon sx={{ fontSize: '1rem' }} />
                    </Button>
                    <Button variant="contained" onClick={handleSearch} size="small" sx={{ height: '36px', minWidth: '36px', width: '36px', px: 1, flexShrink: 0 }}>
                      <SearchIcon sx={{ fontSize: '1rem' }} />
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {searchKeywords.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                {searchKeywords.map((keyword, index) => (
                  <Chip key={index} label={keyword} color="primary" onDelete={() => handleRemoveKeyword(keyword)} size="small" sx={{ fontWeight: 'medium', height: '20px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }} />
                ))}
                {searchKeywords.length > 0 && (
                  <Chip label="Clear All" variant="outlined" size="small" onClick={() => { setSearchKeywords([]); setTimeout(() => handleSearch(), 0); }} sx={{ borderColor: 'error.main', color: 'error.main', height: '20px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }} />
                )}
              </Box>
            )}
          </Box>
          
          <Collapse in={filtersOpen}>
            <Box sx={{ p: 1, bgcolor: '#f9f9f9' }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 0.5, fontSize: '0.8rem' }}>
                    Application Filters
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="app-type-select-label" sx={{ fontSize: '0.875rem' }}>Application Type</InputLabel>
                    <Select labelId="app-type-select-label" value={searchApplicationType} label="Application Type" onChange={(e) => setSearchApplicationType(e.target.value)} sx={{ fontSize: '0.875rem' }}>
                      {applicationTypeOptions.map((option) => ( <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}> {option.label} </MenuItem> ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Applicant Name" value={searchApplicantName} onChange={(e) => setSearchApplicantName(e.target.value)} size="small" InputProps={{ style: { fontSize: '0.875rem' } }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Created Date From" value={searchCreatedDateFrom || ''} onChange={(e) => setSearchCreatedDateFrom(e.target.value)} type="date" size="small" InputLabelProps={{ shrink: true }} InputProps={{ style: { fontSize: '0.875rem' } }} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Created Date To" value={searchCreatedDateTo || ''} onChange={(e) => setSearchCreatedDateTo(e.target.value)} type="date" size="small" InputLabelProps={{ shrink: true }} InputProps={{ style: { fontSize: '0.875rem' } }} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" onClick={() => { handleSearch(); setFiltersOpen(false); }} startIcon={<SearchIcon sx={{ fontSize: '1rem' }} />} size="small" sx={{ px: 2, fontSize: '0.75rem', height: '30px' }}>
                      Search
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Paper>

        <Paper sx={{ mb: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ p: 1, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <FilterListIcon sx={{ mr: 0.75, fontSize: '1.1rem' }} />
              Search Results
            </Typography>
            <Chip label={`${searchResults.length} applications found`} size="small" color="primary" variant="outlined" sx={{ bgcolor: 'white', fontWeight: 'medium', mr: 1 }} />
          </Box>
          
          {searchResults.length > 0 ? (
            <>
              <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      {[
                        { id: 'id', label: 'WBRS No.' },
                        { id: 'applicationType', label: 'Application Type' },
                        { id: 'status', label: 'Status' },
                        { id: 'applicantName', label: 'Applicant Name' },
                        { id: 'createdDate', label: 'Created Date' },
                        // { id: 'actions', label: 'Actions', disableSort: true }, // Removed Actions
                      ].map((column) => (
                        <TableCell 
                          key={column.id} 
                          sx={{ 
                            fontWeight: 'bold', 
                            cursor: column.disableSort ? 'default' : 'pointer', 
                            userSelect: 'none', 
                            py: 1, 
                            '&:hover': { bgcolor: column.disableSort ? 'inherit' : 'rgba(0, 0, 0, 0.04)' } 
                          }} 
                          onClick={() => !column.disableSort && handleSort(column.id)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {column.label}
                            {sortField === column.id && !column.disableSort && (
                              <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                                {sortDirection === 'asc' ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPageResults.map((appItem) => (
                      <React.Fragment key={appItem.id}>
                        <TableRow hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }} onClick={() => handleViewWbrsApp(appItem.id)}>
                          <TableCell sx={{ py: 0.75 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {appItem.id}
                              <Tooltip title="View Application Details">
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleViewWbrsApp(appItem.id);
                                  }} 
                                  color="primary"
                                  sx={{ ml: 1 }} // Added margin for spacing
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>{appItem.applicationType}</TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip label={appItem.status} size="small" color={getStatusChipColor(appItem.status)} />
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>{appItem.applicantName}</TableCell>
                          <TableCell sx={{ py: 0.75 }}>{new Date(appItem.createdDate).toLocaleDateString()}</TableCell>
                          {/* Removed dedicated actions cell 
                          <TableCell sx={{ py: 0.75 }}>
                            <Tooltip title="View Application Details">
                              <IconButton 
                                size="small" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleViewWbrsApp(appItem.id);
                                }} 
                                color="primary"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell> 
                          */}
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {Math.min((page - 1) * rowsPerPage + 1, searchResults.length)} - {Math.min(page * rowsPerPage, searchResults.length)} of {searchResults.length} applications
                </Typography>
                <Pagination count={Math.ceil(searchResults.length / rowsPerPage)} page={page} onChange={(event, newPage) => setPage(newPage)} color="primary" showFirstButton showLastButton size="small" />
              </Box>
            </>
          ) : (
            <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography variant="subtitle1" gutterBottom> No applications found </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}> Try adjusting your filters or search terms. </Typography>
              <Button variant="contained" onClick={handleClearFilters} startIcon={<ClearIcon />} size="small"> Clear filters </Button>
            </Box>
          )}
        </Paper>

        <Dialog open={bookmarkDialogOpen} onClose={() => setBookmarkDialogOpen(false)}>
          <DialogTitle>{editingBookmark ? 'Edit Saved Search' : 'Save Search'}</DialogTitle>
          <DialogContent>
            <DialogContentText> {editingBookmark ? 'Edit the name for this saved search.' : 'Enter a name for this search to save it for future use.'} </DialogContentText>
            <TextField autoFocus margin="dense" id="name" label="Search Name" type="text" fullWidth variant="outlined" value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookmarkDialogOpen(false)} color="primary"> Cancel </Button>
            <Button onClick={handleConfirmBookmark} color="primary" variant="contained"> {editingBookmark ? 'Update' : 'Save'} </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: '100%', '& .MuiAlert-message': { color: 'white' } }}> {snackbarMessage} </Alert>
      </Snackbar>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Saved Search</DialogTitle>
        <DialogContent> <DialogContentText> Are you sure you want to delete the saved search "{searchToDelete?.name}"? This action cannot be undone. </DialogContentText> </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary"> Cancel </Button>
          <Button onClick={confirmDeleteSavedSearch} color="error" variant="contained"> Delete </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WbrsSearch; 