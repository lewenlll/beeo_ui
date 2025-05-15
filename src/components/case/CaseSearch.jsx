import React, { useState, useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import BreadcrumbNav from '../common/BreadcrumbNav';
import AppSidebar from '../common/AppSidebar';
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
    lastUpdated: '2023-11-25',
    tasks: [
      { id: 1, name: 'Prepare / Issue Acknowledgement Letter Annex F1', status: 'Pending', sto: 'STO/EEB5/1', dueDate: '2023-12-01' },
      { id: 2, name: 'Review Submitted Documents', status: 'In Progress', sto: 'STO/EEB5/1', dueDate: '2023-12-05' }
    ]
  },
  { 
    id: 'CASE002', 
    fileNo: 'EMSD/EEO/BC/19/01/07',
    caseEngineer: 'E/EEB3/2',
    status: 'Pending', 
    caseType: 'REA Registration',
    createdDate: '2023-11-18',
    lastUpdated: '2023-11-22',
    tasks: [
      { id: 3, name: 'Checklist for General Checking of Application Submission', status: 'Pending', sto: 'STO/EEB5/1', dueDate: '2023-12-03' }
    ]
  },
  { 
    id: 'CASE003', 
    fileNo: 'EMSD/EEO/BC/19/01/08',
    caseEngineer: 'E/EEB1/3',
    status: 'Completed', 
    caseType: 'REA Renewal',
    createdDate: '2023-11-15',
    lastUpdated: '2023-11-21',
    tasks: [
      { id: 4, name: 'Site Inspection', status: 'Completed', sto: 'STO/EEB3/2', dueDate: '2023-11-20' },
      { id: 5, name: 'Final Report Preparation', status: 'Completed', sto: 'STO/EEB3/2', dueDate: '2023-11-21' }
    ]
  },
  { 
    id: 'CASE004', 
    fileNo: 'EMSD/EEO/BC/19/01/09',
    caseEngineer: 'E/EEB2/4',
    status: 'Rejected', 
    caseType: 'REA Change',
    createdDate: '2023-11-10',
    lastUpdated: '2023-11-19',
    tasks: [
      { id: 6, name: 'Document Verification', status: 'Rejected', sto: 'STO/EEB4/3', dueDate: '2023-11-15' }
    ]
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

// Task status options for dropdown
const taskStatusOptions = [
  { value: '', label: 'All Task Statuses' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Rejected', label: 'Rejected' }
];

const CaseSearch = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  // State for search criteria
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchCaseType, setSearchCaseType] = useState('');
  const [searchEngineer, setSearchEngineer] = useState('');
  const [searchTaskName, setSearchTaskName] = useState('');
  const [searchTaskStatus, setSearchTaskStatus] = useState('');
  const [searchTaskSTO, setSearchTaskSTO] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showTaskFilters, setShowTaskFilters] = useState(false);
  
  // State for search results and pagination
  const [searchResults, setSearchResults] = useState(mockCases);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState({});
  
  // State for table sorting
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // State for saved searches
  const [savedSearches, setSavedSearches] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fix: Ensure searchKeywords is up-to-date before filtering
  const [pendingSearch, setPendingSearch] = useState(false);
  // Handle search function (refactored to always use latest state)
  const handleSearch = () => {
    setPendingSearch(true);
    setPage(1); // Reset to first page when searching
  };

  // Effect to run filtering when pendingSearch is set
  React.useEffect(() => {
    if (!pendingSearch) return;
    // Add current keyword to the keywords array if it's not empty
    let updatedKeywords = searchKeywords;
    if (searchKeyword.trim() !== '') {
      if (!searchKeywords.includes(searchKeyword.trim())) {
        updatedKeywords = [...searchKeywords, searchKeyword.trim()];
        setSearchKeywords(updatedKeywords);
      }
      setSearchKeyword(''); // Clear the input field after adding
    }
    // Filter mock data based on all search criteria
    const filteredResults = mockCases.filter(caseItem => {
      // Check if all keywords are included in any of the case fields
      const keywordsMatch = updatedKeywords.length === 0 || updatedKeywords.every(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          caseItem.id.toLowerCase().includes(lowerKeyword) ||
          caseItem.fileNo.toLowerCase().includes(lowerKeyword) ||
          caseItem.caseType.toLowerCase().includes(lowerKeyword) ||
          caseItem.status.toLowerCase().includes(lowerKeyword) ||
          caseItem.caseEngineer.toLowerCase().includes(lowerKeyword) ||
          // Search in tasks
          (caseItem.tasks && caseItem.tasks.some(task => 
            task.name.toLowerCase().includes(lowerKeyword) ||
            task.status.toLowerCase().includes(lowerKeyword) ||
            (task.sto && task.sto.toLowerCase().includes(lowerKeyword))
          ))
        );
      });
      // Check case criteria
      const caseMatch = 
        (searchStatus === '' || caseItem.status === searchStatus) &&
        (searchCaseType === '' || caseItem.caseType === searchCaseType) &&
        (searchEngineer === '' || caseItem.caseEngineer.toLowerCase().includes(searchEngineer.toLowerCase()));
      // Check task criteria
      const taskMatch = !showTaskFilters || !caseItem.tasks || caseItem.tasks.some(task => {
        return (
          (searchTaskName === '' || task.name.toLowerCase().includes(searchTaskName.toLowerCase())) &&
          (searchTaskStatus === '' || task.status === searchTaskStatus) &&
          (searchTaskSTO === '' || (task.sto && task.sto.toLowerCase().includes(searchTaskSTO.toLowerCase())))
        );
      });
      return keywordsMatch && caseMatch && taskMatch;
    });
    setSearchResults(filteredResults);
    setPage(1); // Reset to first page when searching
    setPendingSearch(false);
  }, [pendingSearch]);

  // Effect to check task filters visibility when Accordion changes
  useEffect(() => {
    // If any task filter has a value, show the task filters
    if (searchTaskName || searchTaskStatus || searchTaskSTO) {
      setShowTaskFilters(true);
    }
  }, [searchTaskName, searchTaskStatus, searchTaskSTO]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchKeyword('');
    setSearchKeywords([]);
    setSearchStatus('');
    setSearchCaseType('');
    setSearchEngineer('');
    setSearchTaskName('');
    setSearchTaskStatus('');
    setSearchTaskSTO('');
    setShowTaskFilters(false);
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
        engineer: searchEngineer,
        taskName: searchTaskName,
        taskStatus: searchTaskStatus,
        taskSTO: searchTaskSTO,
        showTaskFilters: showTaskFilters
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
    setSearchTaskName(savedSearch.criteria.taskName || '');
    setSearchTaskStatus(savedSearch.criteria.taskStatus || '');
    setSearchTaskSTO(savedSearch.criteria.taskSTO || '');
    setShowTaskFilters(savedSearch.criteria.showTaskFilters || false);
    
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
            caseItem.caseEngineer.toLowerCase().includes(lowerKeyword) ||
            // Search in tasks
            (caseItem.tasks && caseItem.tasks.some(task => 
              task.name.toLowerCase().includes(lowerKeyword) ||
              task.status.toLowerCase().includes(lowerKeyword) ||
              (task.sto && task.sto.toLowerCase().includes(lowerKeyword))
            ))
          );
        });
      
      // Check case criteria
      const caseMatch = 
        (savedSearch.criteria.status === '' || caseItem.status === savedSearch.criteria.status) &&
        (savedSearch.criteria.caseType === '' || caseItem.caseType === savedSearch.criteria.caseType) &&
        (savedSearch.criteria.engineer === '' || caseItem.caseEngineer.toLowerCase().includes(savedSearch.criteria.engineer.toLowerCase()));
      
      // Check task criteria
      const taskMatch = !savedSearch.criteria.showTaskFilters || !caseItem.tasks || caseItem.tasks.some(task => {
        return (
          (savedSearch.criteria.taskName === '' || task.name.toLowerCase().includes(savedSearch.criteria.taskName.toLowerCase())) &&
          (savedSearch.criteria.taskStatus === '' || task.status === savedSearch.criteria.taskStatus) &&
          (savedSearch.criteria.taskSTO === '' || (task.sto && task.sto.toLowerCase().includes(savedSearch.criteria.taskSTO.toLowerCase())))
        );
      });
      
      return keywordsMatch && caseMatch && taskMatch;
    });
    
    setSearchResults(filteredResults);
    setPage(1);
    
    // Show notification
    setSnackbarMessage(`Loaded saved search "${savedSearch.name}" with ${filteredResults.length} results`);
    setSnackbarOpen(true);
  };

  // Handle view case details
  const handleViewCase = (id) => {
    navigate(`/cases/${id}`);
  };

  // Handle edit case
  const handleEditCase = (id) => {
    navigate(`/cases/${id}?edit=true`);
  };

  // Handle row expansion toggle
  const handleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle sorting
  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set to ascending by default
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get current page of results with sorting applied
  const getSortedResults = () => {
    const sortedResults = [...searchResults].sort((a, b) => {
      // Handle nesting for tasks field
      if (sortField === 'tasks') {
        const tasksA = a.tasks ? a.tasks.length : 0;
        const tasksB = b.tasks ? b.tasks.length : 0;
        return sortDirection === 'asc' ? tasksA - tasksB : tasksB - tasksA;
      }
      
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // String comparison
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // Number comparison
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return sortedResults.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  };
  
  const currentPageResults = getSortedResults();

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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        overflow: 'auto',
        transition: theme => theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0
      }}>
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
            <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              {/* Search Header */}
              <Box sx={{ 
                p: 2,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                bgcolor: 'primary.main', 
                color: 'white',
                cursor: 'pointer'
              }}
              onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ mr: 1 }} />
                  Case Search
                </Typography>
                <IconButton 
                  color="inherit" 
                  aria-label="expand search"
                  size="small"
                >
                  {filtersOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
              
              {/* Main search controls - always visible */}
              <Box sx={{ p: 3, borderBottom: filtersOpen ? '1px solid #eee' : 'none' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4}>
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
                  
                  <Grid item xs={12} sm={6} md={4}>
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
                  
                  <Grid item xs={12} sm={12} md={4}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        startIcon={<FilterListIcon />}
                        size="small"
                        sx={{ flex: 1, height: '40px' }}
                      >
                        {filtersOpen ? 'Hide Filters' : 'More Filters'}
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        onClick={handleSaveSearch}
                        size="small"
                        sx={{ height: '40px', minWidth: '40px', px: 1.5 }}
                        color="primary"
                      >
                        <BookmarkIcon fontSize="small" />
                      </Button>
                      
                      <Button 
                        variant="contained" 
                        onClick={handleSearch}
                        size="small"
                        sx={{ height: '40px', minWidth: '40px', px: 1.5 }}
                      >
                        <SearchIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Display active keyword chips */}
                {searchKeywords.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
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
                )}
              </Box>
              
              {/* Collapsible filters section */}
              <Collapse in={filtersOpen}>
                <Box sx={{ p: 3, bgcolor: '#f9f9f9' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>
                        Case Filters
                      </Typography>
                    </Grid>
                    
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
                    
                    {/* Task Filters Accordion */}
                    <Grid item xs={12}>                      <Accordion 
                        sx={{ 
                          mt: 2,
                          '&:before': { display: 'none' },
                          boxShadow: 'none',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '4px !important',
                          overflow: 'hidden'
                        }}
                        expanded={showTaskFilters}
                        onChange={(e, expanded) => setShowTaskFilters(expanded)}
                      >
                        <AccordionSummary
                          expandIcon={<KeyboardArrowDownIcon />}
                          sx={{ bgcolor: 'primary.lighter' }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                            <FilterListIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                            Task Filters
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                fullWidth
                                label="Task Name"
                                value={searchTaskName}
                                onChange={(e) => setSearchTaskName(e.target.value)}
                                size="small"
                                placeholder="Search task name"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <FormControl fullWidth size="small">
                                <InputLabel id="task-status-select-label">Task Status</InputLabel>
                                <Select
                                  labelId="task-status-select-label"
                                  value={searchTaskStatus}
                                  label="Task Status"
                                  onChange={(e) => setSearchTaskStatus(e.target.value)}
                                >
                                  {taskStatusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.value && (
                                        <Chip 
                                          size="small" 
                                          label={option.label}
                                          color={getStatusChipColor(option.value)}
                                          sx={{ mr: 1, minWidth: '100px' }}
                                        />
                                      )}
                                      {!option.value && option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                fullWidth
                                label="Task STO"
                                value={searchTaskSTO}
                                onChange={(e) => setSearchTaskSTO(e.target.value)}
                                size="small"
                                placeholder="Search by STO"
                              />
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    
                    {/* Search Button - Positioned at bottom of expanded filters */}                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={handleClearFilters}
                          startIcon={<ClearIcon />}
                          size="medium"
                        >
                          Clear All Filters
                        </Button>
                        <Button 
                          variant="contained" 
                          onClick={() => {
                            handleSearch();
                            setFiltersOpen(false);
                          }}
                          startIcon={<SearchIcon />}
                          size="medium"
                          sx={{ px: 4 }}
                        >
                          Search
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
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
                          <TableCell padding="checkbox"></TableCell>
                          {[
                            { id: 'id', label: 'Case ID' },
                            { id: 'fileNo', label: 'File No.' },
                            { id: 'caseType', label: 'Case Type' },
                            { id: 'status', label: 'Status' },
                            { id: 'caseEngineer', label: 'Case Engineer' },
                            { id: 'createdDate', label: 'Created Date' },
                            { id: 'tasks', label: 'Tasks' }
                          ].map((column) => (
                            <TableCell 
                              key={column.id}
                              sx={{ 
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                userSelect: 'none',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                              }}
                              onClick={() => handleSort(column.id)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {column.label}
                                {sortField === column.id && (
                                  <Box sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                                    {sortDirection === 'asc' ? 
                                      <KeyboardArrowUpIcon fontSize="small" /> : 
                                      <KeyboardArrowDownIcon fontSize="small" />
                                    }
                                  </Box>
                                )}
                              </Box>
                            </TableCell>
                          ))}
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentPageResults.map((caseItem) => (
                          <React.Fragment key={caseItem.id}>
                            <TableRow 
                              hover
                              onClick={() => handleRowExpand(caseItem.id)}
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                                ...(expandedRows[caseItem.id] && { 
                                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                                })
                              }}
                            >
                              <TableCell padding="checkbox">
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click from being triggered
                                    handleRowExpand(caseItem.id);
                                  }}
                                >
                                  {expandedRows[caseItem.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                              </TableCell>
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
                              <TableCell>
                                {caseItem.tasks && caseItem.tasks.length > 0 ? (
                                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                    <Chip
                                      size="small"
                                      label={`${caseItem.tasks.length} ${caseItem.tasks.length === 1 ? 'Task' : 'Tasks'}`}
                                      color="primary"
                                      sx={{ fontWeight: 'medium' }}
                                    />
                                    {/* Group tasks by status and show count */}
                                    {Object.entries(
                                      caseItem.tasks.reduce((acc, task) => {
                                        acc[task.status] = (acc[task.status] || 0) + 1;
                                        return acc;
                                      }, {})
                                    ).slice(0, 2).map(([status, count]) => (
                                      <Chip
                                        key={status}
                                        label={`${status}: ${count}`}
                                        size="small"
                                        color={getStatusChipColor(status)}
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem', height: '20px' }}
                                      />
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">No tasks</Typography>
                                )}
                              </TableCell>
                              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                <Tooltip title="View Case Details">
                                  <IconButton 
                                    size="small" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewCase(caseItem.id);
                                    }}
                                    sx={{ mr: 1 }}
                                    color="primary"
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                            
                            {/* Expandable detail row for tasks */}
                            <TableRow>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                <Collapse in={expandedRows[caseItem.id]} timeout="auto" unmountOnExit>
                                  <Box sx={{ margin: 2, bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <FilterListIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                      Tasks for {caseItem.id}
                                    </Typography>
                                    
                                    {caseItem.tasks && caseItem.tasks.length > 0 ? (
                                      <Table size="small" aria-label="tasks">
                                        <TableHead>
                                          <TableRow sx={{ bgcolor: 'grey.100' }}>
                                            <TableCell>Task ID</TableCell>
                                            <TableCell>Task Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>STO</TableCell>
                                            <TableCell>Due Date</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {caseItem.tasks.map((task) => (
                                            <TableRow key={task.id}>
                                              <TableCell component="th" scope="row">
                                                {task.id}
                                              </TableCell>
                                              <TableCell>{task.name}</TableCell>
                                              <TableCell>
                                                <Chip 
                                                  label={task.status} 
                                                  size="small" 
                                                  color={getStatusChipColor(task.status)}
                                                  variant="outlined"
                                                />
                                              </TableCell>
                                              <TableCell>{task.sto}</TableCell>
                                              <TableCell>{task.dueDate}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <Typography variant="body2" color="text.secondary">
                                        No tasks available for this case.
                                      </Typography>
                                    )}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
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
                      onChange={(event, newPage) => setPage(newPage)} 
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
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {/* Keywords */}
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
                        
                        {/* Case filters */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {savedSearch.criteria.status && (
                            <Chip 
                              label={`Status: ${savedSearch.criteria.status}`} 
                              size="small" 
                              variant="outlined" 
                              color={getStatusChipColor(savedSearch.criteria.status)}
                            />
                          )}
                          {savedSearch.criteria.caseType && (
                            <Chip label={`Type: ${savedSearch.criteria.caseType}`} size="small" variant="outlined" />
                          )}
                          {savedSearch.criteria.engineer && (
                            <Chip label={`Engineer: ${savedSearch.criteria.engineer}`} size="small" variant="outlined" />
                          )}
                        </Box>
                        
                        {/* Task filters */}
                        {savedSearch.criteria.showTaskFilters && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pt: 1, borderTop: '1px dashed #eee' }}>
                            <Typography variant="caption" sx={{ width: '100%', mb: 0.5, color: 'text.secondary' }}>
                              Task Filters:
                            </Typography>
                            {savedSearch.criteria.taskStatus && (
                              <Chip 
                                label={`Task Status: ${savedSearch.criteria.taskStatus}`} 
                                size="small" 
                                variant="outlined" 
                                color={getStatusChipColor(savedSearch.criteria.taskStatus)}
                              />
                            )}
                            {savedSearch.criteria.taskName && (
                              <Chip label={`Task: ${savedSearch.criteria.taskName}`} size="small" variant="outlined" />
                            )}
                            {savedSearch.criteria.taskSTO && (
                              <Chip label={`STO: ${savedSearch.criteria.taskSTO}`} size="small" variant="outlined" />
                            )}
                          </Box>
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
    </Box>
  );
};

export default CaseSearch;