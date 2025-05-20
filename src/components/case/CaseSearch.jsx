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
import AppSidebar from '../common/AppSidebar';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
      { 
        id: 1, 
        name: 'Prepare / Issue Acknowledgement Letter Annex F1', 
        status: 'Pending', 
        actionBy: {
          sto: 'STO/EEB5/1 (Tom)',
          engineer: 'E/EEB2/1 (Ken)',
          seniorEngineer: null,
          bsi: null,
          to: null,
          sbsi: null
        }, 
        dueDate: '2023-12-01',
        priority: 'High'
      },
      { 
        id: 2, 
        name: 'Review Submitted Documents', 
        status: 'In Progress', 
        actionBy: {
          sto: null,
          engineer: 'E/EEB3/2 (Amy)',
          seniorEngineer: 'SE/EEB1/1 (David)',
          bsi: 'BSI/EEB2/2 (Sarah)',
          to: null,
          sbsi: null
        }, 
        dueDate: '2023-12-05',
        priority: 'Medium'
      }
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
      { 
        id: 3, 
        name: 'Checklist for General Checking of Application Submission', 
        status: 'Pending', 
        actionBy: {
          sto: null,
          engineer: null,
          seniorEngineer: null,
          bsi: null,
          to: 'TO/EEB4/1 (Ben)',
          sbsi: 'SBSI/EEB3/1 (Ceci)'
        }, 
        dueDate: '2023-12-03',
        priority: 'Low' 
      }
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
  { 
    id: 'CASE005', 
    fileNo: 'EMSD/EEO/BC/19/02/01',
    caseEngineer: 'E/EEB3/5',
    status: 'In Progress', 
    caseType: 'REA Registration',
    createdDate: '2023-11-22',
    lastUpdated: '2023-11-28',
    tasks: [
      { id: 7, name: 'Technical Assessment', status: 'In Progress', sto: 'STO/EEB5/2', dueDate: '2023-12-10' },
      { id: 8, name: 'Compliance Verification', status: 'Pending', sto: 'STO/EEB5/2', dueDate: '2023-12-15' }
    ]
  },
  { 
    id: 'CASE006', 
    fileNo: 'EMSD/EEO/BC/19/02/02',
    caseEngineer: 'E/EEB1/2',
    status: 'Pending', 
    caseType: 'REA Renewal',
    createdDate: '2023-11-21',
    lastUpdated: '2023-11-26',
    tasks: [
      { id: 9, name: 'Certificate Issuance', status: 'Pending', sto: 'STO/EEB2/1', dueDate: '2023-12-05' }
    ]
  },
  { 
    id: 'CASE007', 
    fileNo: 'EMSD/EEO/BC/19/02/03',
    caseEngineer: 'E/EEB4/3',
    status: 'Completed', 
    caseType: 'REA Change',
    createdDate: '2023-11-16',
    lastUpdated: '2023-11-23',
    tasks: [
      { id: 10, name: 'Documentation Review', status: 'Completed', sto: 'STO/EEB4/2', dueDate: '2023-11-22' }
    ]
  },
  { 
    id: 'CASE008', 
    fileNo: 'EMSD/EEO/BC/19/02/04',
    caseEngineer: 'E/EEB2/2',
    status: 'In Progress', 
    caseType: 'REA Registration',
    createdDate: '2023-11-19',
    lastUpdated: '2023-11-27',
    tasks: [
      { id: 11, name: 'Field Assessment', status: 'In Progress', sto: 'STO/EEB3/3', dueDate: '2023-12-02' },
      { id: 12, name: 'Safety Compliance Review', status: 'Pending', sto: 'STO/EEB3/3', dueDate: '2023-12-08' }
    ]
  },
  { 
    id: 'CASE009', 
    fileNo: 'EMSD/EEO/BC/19/03/01',
    caseEngineer: 'E/EEB1/1',
    status: 'Rejected', 
    caseType: 'REA Renewal',
    createdDate: '2023-11-09',
    lastUpdated: '2023-11-17',
    tasks: [
      { id: 13, name: 'Qualification Assessment', status: 'Rejected', sto: 'STO/EEB1/3', dueDate: '2023-11-16' }
    ]
  },
  { 
    id: 'CASE010', 
    fileNo: 'EMSD/EEO/BC/19/03/02',
    caseEngineer: 'E/EEB3/4',
    status: 'Completed', 
    caseType: 'REA Change',
    createdDate: '2023-11-12',
    lastUpdated: '2023-11-18',
    tasks: [
      { id: 14, name: 'Document Update', status: 'Completed', sto: 'STO/EEB2/2', dueDate: '2023-11-17' },
      { id: 15, name: 'System Update', status: 'Completed', sto: 'STO/EEB2/2', dueDate: '2023-11-18' }
    ]
  },
  { 
    id: 'CASE011', 
    fileNo: 'EMSD/EEO/BC/19/03/03',
    caseEngineer: 'E/EEB4/1',
    status: 'In Progress', 
    caseType: 'REA Registration',
    createdDate: '2023-11-23',
    lastUpdated: '2023-11-29',
    tasks: [
      { id: 16, name: 'Technical Drawing Review', status: 'In Progress', sto: 'STO/EEB4/1', dueDate: '2023-12-12' }
    ]
  },
  { 
    id: 'CASE012', 
    fileNo: 'EMSD/EEO/BC/19/03/04',
    caseEngineer: 'E/EEB2/3',
    status: 'Pending', 
    caseType: 'REA Change',
    createdDate: '2023-11-24',
    lastUpdated: '2023-11-30',
    tasks: [
      { id: 17, name: 'Application Review', status: 'Pending', sto: 'STO/EEB5/3', dueDate: '2023-12-07' },
      { id: 18, name: 'Stakeholder Communication', status: 'Pending', sto: 'STO/EEB5/3', dueDate: '2023-12-14' }
    ]
  },
  { 
    id: 'CASE013', 
    fileNo: 'EMSD/EEO/BC/19/04/01',
    caseEngineer: 'E/EEB1/4',
    status: 'Completed', 
    caseType: 'REA Renewal',
    createdDate: '2023-11-14',
    lastUpdated: '2023-11-20',
    tasks: [
      { id: 19, name: 'Final Approval', status: 'Completed', sto: 'STO/EEB1/2', dueDate: '2023-11-19' }
    ]
  },
  { 
    id: 'CASE014', 
    fileNo: 'EMSD/EEO/BC/19/04/02',
    caseEngineer: 'E/EEB3/1',
    status: 'In Progress', 
    caseType: 'REA Registration',
    createdDate: '2023-11-25',
    lastUpdated: '2023-12-01',
    tasks: [
      { id: 20, name: 'Initial Assessment', status: 'Completed', sto: 'STO/EEB3/1', dueDate: '2023-11-30' },
      { id: 21, name: 'Site Visit Planning', status: 'In Progress', sto: 'STO/EEB3/1', dueDate: '2023-12-10' }
    ]
  },
  { 
    id: 'CASE015', 
    fileNo: 'EMSD/EEO/BC/19/04/03',
    caseEngineer: 'E/EEB4/2',
    status: 'Rejected', 
    caseType: 'REA Change',
    createdDate: '2023-11-11',
    lastUpdated: '2023-11-16',
    tasks: [
      { id: 22, name: 'Requirements Verification', status: 'Rejected', sto: 'STO/EEB4/4', dueDate: '2023-11-15' }
    ]
  }
];

// Status options for dropdown
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Closed', label: 'Closed' },
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
  { value: 'Closed', label: 'Closed' },
  { value: 'Rejected', label: 'Rejected' }
];

// Mock logged in user - in a real app, this would come from authentication context
const loggedInUser = "E/EEB2/1 (Ken)";

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
  const [searchTaskActionBy, setSearchTaskActionBy] = useState('');
  const [searchFileNo, setSearchFileNo] = useState('');
  const [searchFileNoTo, setSearchFileNoTo] = useState('');
  const [searchCreatedDateFrom, setSearchCreatedDateFrom] = useState('');
  const [searchCreatedDateTo, setSearchCreatedDateTo] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showTaskFilters, setShowTaskFilters] = useState(false);
  
  // State for search results and pagination
  const [searchResults, setSearchResults] = useState(mockCases);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(15);
  
  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState({});
  
  // State for table sorting
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // State for saved searches
  const [savedSearches, setSavedSearches] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState(null);

  // Initialize default saved searches
  useEffect(() => {
    // In production, this would be loaded from user preferences
    if (savedSearches.length === 0) {
      setSavedSearches([
        {
          id: 1,
          name: "My Cases",
          isDefault: true,
          criteria: {
            keywords: [],
            status: '',
            caseType: '',
            engineer: 'E/EEB2/1',
            taskName: '',
            taskStatus: '',
            taskActionBy: '',
            fileNo: '',
            fileNoTo: '',
            createdDateFrom: '',
            createdDateTo: '',
            showTaskFilters: false
          }
        },
        {
          id: 2,
          name: "My Pending Tasks",
          isDefault: true,
          criteria: {
            keywords: [],
            status: '',
            caseType: '',
            engineer: '',
            taskName: '',
            taskStatus: 'Pending',
            taskActionBy: loggedInUser,
            fileNo: '',
            fileNoTo: '',
            createdDateFrom: '',
            createdDateTo: '',
            showTaskFilters: true
          }
        }
      ]);
    }
  }, [savedSearches.length]);

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
      
      // Check file number
      // Check file number (single or range)
      let fileNoMatch = true;
      if (searchFileNo) {
        if (searchFileNoTo) {
          // Handle range search - check if fileNo is within range
          fileNoMatch = caseItem.fileNo >= searchFileNo && caseItem.fileNo <= searchFileNoTo;
        } else {
          // Handle single search
          fileNoMatch = caseItem.fileNo.toLowerCase().includes(searchFileNo.toLowerCase());
        }
      }
      
      // Check date range
      const createdDate = new Date(caseItem.createdDate);
      const dateFromMatch = !searchCreatedDateFrom || new Date(searchCreatedDateFrom) <= createdDate;
      const dateToMatch = !searchCreatedDateTo || new Date(searchCreatedDateTo) >= createdDate;
      
      // Check case criteria
      const caseMatch = 
        (searchStatus === '' || caseItem.status === searchStatus) &&
        (searchCaseType === '' || caseItem.caseType === searchCaseType) &&
        (searchEngineer === '' || caseItem.caseEngineer.toLowerCase().includes(searchEngineer.toLowerCase())) &&
        fileNoMatch && dateFromMatch && dateToMatch;
        
      // Check task criteria
      const taskMatch = !showTaskFilters || !caseItem.tasks || caseItem.tasks.some(task => {
        // Check action by match (considering all possible roles)
        const actionByMatch = !searchTaskActionBy || 
          (task.actionBy && (
            (task.actionBy.sto && task.actionBy.sto.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
            (task.actionBy.engineer && task.actionBy.engineer.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
            (task.actionBy.seniorEngineer && task.actionBy.seniorEngineer.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
            (task.actionBy.bsi && task.actionBy.bsi.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
            (task.actionBy.to && task.actionBy.to.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
            (task.actionBy.sbsi && task.actionBy.sbsi.toLowerCase().includes(searchTaskActionBy.toLowerCase()))
          ));

        return (
          (searchTaskName === '' || task.name.toLowerCase().includes(searchTaskName.toLowerCase())) &&
          (searchTaskStatus === '' || task.status === searchTaskStatus) &&
          actionByMatch
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
    if (searchTaskName || searchTaskStatus || searchTaskActionBy) {
      setShowTaskFilters(true);
    }
  }, [searchTaskName, searchTaskStatus, searchTaskActionBy]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchKeyword('');
    setSearchKeywords([]);
    setSearchStatus('');
    setSearchCaseType('');
    setSearchEngineer('');
    setSearchTaskName('');
    setSearchTaskStatus('');
    setSearchTaskActionBy('');
    setSearchFileNo('');
    setSearchFileNoTo('');
    setSearchCreatedDateFrom('');
    setSearchCreatedDateTo('');
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

  // Add state for bookmark dialog
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [editingBookmark, setEditingBookmark] = useState(null);

  // Save current search criteria
  const handleSaveSearch = () => {
    setBookmarkName(`Search ${savedSearches.length + 1}`);
    setEditingBookmark(null);
    setBookmarkDialogOpen(true);
  };
  
  // Handle saving bookmark from dialog
  const handleConfirmBookmark = () => {
    if (editingBookmark) {
      // Updating existing bookmark
      const updatedSavedSearches = savedSearches.map(search => 
        search.id === editingBookmark.id ? 
        {
          ...search,
          name: bookmarkName,
        } : search
      );
      setSavedSearches(updatedSavedSearches);
      setSnackbarMessage(`Search "${bookmarkName}" updated successfully`);
    } else {
      // Creating new bookmark
      const newSavedSearch = {
        id: Date.now(),
        name: bookmarkName,
        criteria: {
          keywords: searchKeywords,
          status: searchStatus,
          caseType: searchCaseType,
          engineer: searchEngineer,
          taskName: searchTaskName,
          taskStatus: searchTaskStatus,
          taskActionBy: searchTaskActionBy,
          fileNo: searchFileNo,
          fileNoTo: searchFileNoTo,
          createdDateFrom: searchCreatedDateFrom,
          createdDateTo: searchCreatedDateTo,
          showTaskFilters: showTaskFilters
        }
      };
      
      setSavedSearches([...savedSearches, newSavedSearch]);
      setSnackbarMessage(`Search "${bookmarkName}" saved successfully`);
    }
    
    setBookmarkDialogOpen(false);
    setSnackbarOpen(true);
  };
  
  // Edit bookmark name
  const handleEditBookmark = (bookmark) => {
    setBookmarkName(bookmark.name);
    setEditingBookmark(bookmark);
    setBookmarkDialogOpen(true);
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
    setSearchTaskActionBy(savedSearch.criteria.taskActionBy || '');
    setSearchFileNoTo(savedSearch.criteria.fileNoTo || '');
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
        // Check action by match (considering all possible roles)
        const actionByMatch = !savedSearch.criteria.taskActionBy || 
          (task.actionBy && (
            (task.actionBy.sto && task.actionBy.sto.toLowerCase().includes(savedSearch.criteria.taskActionBy.toLowerCase())) ||
            (task.actionBy.engineer && task.actionBy.engineer.toLowerCase().includes(savedSearch.criteria.taskActionBy.toLowerCase())) ||
            (task.actionBy.seniorEngineer && task.actionBy.seniorEngineer.toLowerCase().includes(savedSearch.criteria.taskActionBy.toLowerCase())) ||
            (task.actionBy.bsi && task.actionBy.bsi.toLowerCase().includes(savedSearch.criteria.taskActionBy.toLowerCase())) ||
            (task.actionBy.to && task.actionBy.to.toLowerCase().includes(savedSearch.criteria.taskActionBy.toLowerCase())) ||
            (task.actionBy.sbsi && task.actionBy.sbsi.toLowerCase().includes(savedSearch.criteria.taskActionBy.toLowerCase()))
          ));

        return (
          (savedSearch.criteria.taskName === '' || task.name.toLowerCase().includes(savedSearch.criteria.taskName.toLowerCase())) &&
          (savedSearch.criteria.taskStatus === '' || task.status === savedSearch.criteria.taskStatus) &&
          actionByMatch
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
        return 'primary'; // blue
      case 'Pending':
        return 'warning'; // orange
      case 'Closed':
        return 'success'; // green
      case 'Completed': // For backward compatibility
        return 'success'; // green
      case 'Rejected':
        return 'error'; // red
      default:
        return 'default';
    }
  };

  // Add helper function to format action by information
  const formatActionBy = (actionBy) => {
    if (!actionBy) return 'Not Assigned';
    
    const roles = [];
    if (actionBy.seniorEngineer) roles.push(actionBy.seniorEngineer);
    if (actionBy.engineer) roles.push(actionBy.engineer);
    if (actionBy.sto) roles.push(actionBy.sto);
    if (actionBy.sbsi) roles.push(actionBy.sbsi);
    if (actionBy.bsi) roles.push(actionBy.bsi);
    if (actionBy.to) roles.push(actionBy.to);
    
    return roles.length > 0 ? roles.join(', ') : 'Not Assigned';
  };

  // Helper function to get action by display (showing only assigned roles)
  const getActionByDisplay = (actionBy) => {
    if (!actionBy) return 'Not Assigned';
    
    const roles = [];
    if (actionBy.seniorEngineer) roles.push(actionBy.seniorEngineer);
    if (actionBy.engineer) roles.push(actionBy.engineer);
    if (actionBy.sto) roles.push(actionBy.sto);
    if (actionBy.sbsi) roles.push(actionBy.sbsi);
    if (actionBy.bsi) roles.push(actionBy.bsi);
    if (actionBy.to) roles.push(actionBy.to);
    
    return roles.length > 0 ? roles.join(', ') : 'Not Assigned';
  };

  // Delete a saved search
  const handleDeleteSavedSearch = (search) => {
    setSearchToDelete(search);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion of a saved search
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
      {/* Sidebar */}
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: 1.5, 
        overflow: 'auto',
        transition: theme => theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0
      }}>
        {/* Search Form */}
        <Paper sx={{ mb: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {/* Search Header */}
          <Box sx={{ 
            p: 0.75,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            bgcolor: 'primary.main', 
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <SearchIcon sx={{ mr: 0.75, fontSize: '1.1rem' }} />
              Case Search
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {savedSearches.length > 0 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 1, 
                    px: 1, 
                    mr: 1, 
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open saved searches dialog or menu
                  }}
                >
                  <BookmarkIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                    {savedSearches.length} saved
                  </Typography>
                </Box>
              )}
              <IconButton 
                color="inherit" 
                aria-label="expand search"
                size="small"
              >
                {filtersOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Box>
          </Box>
          
          {/* Main search controls - always visible */}
          <Box sx={{ p: 1.5, borderBottom: filtersOpen ? '1px solid #eee' : 'none' }}>
            {/* Show saved searches as chips if available */}
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
                    variant="outlined"
                    color="primary"
                    onClick={() => handleLoadSavedSearch(savedSearch)}
                    onDelete={savedSearch.isDefault ? undefined : 
                            () => handleDeleteSavedSearch(savedSearch)}
                    deleteIcon={savedSearch.isDefault ? <EditIcon fontSize="small" /> : undefined}
                    sx={{ 
                      height: '24px', 
                      '& .MuiChip-label': { fontSize: '0.75rem' },
                      '& .MuiChip-deleteIcon': { fontSize: '0.85rem' }
                    }}
                  />
                ))}
              </Box>
            )}

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={7} md={8} lg={8}>
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
                    style: { fontSize: '0.875rem' }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={5} md={4} lg={4}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel id="status-select-label" sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      value={searchStatus}
                      label="Status"
                      onChange={(e) => setSearchStatus(e.target.value)}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                          {!option.value && option.label}
                          {option.value && (
                            <Chip 
                              size="small" 
                              label={option.label}
                              color={getStatusChipColor(option.value)}
                              sx={{ mr: 0, minWidth: '80px', height: '20px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                            />
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button 
                    variant="text" 
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    startIcon={<FilterListIcon sx={{ fontSize: '1rem' }} />}
                    size="small"
                    sx={{ minWidth: 'unset', height: '36px', fontSize: '0.75rem' }}
                  >
                    {filtersOpen ? 'Hide' : 'More'}
                  </Button>
                  
                  <Button 
                    variant="text" 
                    color="error"
                    onClick={handleClearFilters}
                    size="small"
                    startIcon={<ClearIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ minWidth: 'unset', height: '36px', fontSize: '0.75rem' }}
                  >
                    Clear
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    onClick={handleSaveSearch}
                    size="small"
                    sx={{ minWidth: '36px', px: 1, height: '36px' }}
                    color="primary"
                  >
                    <BookmarkIcon sx={{ fontSize: '1rem' }} />
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    size="small"
                    sx={{ height: '36px', minWidth: '36px', px: 1 }}
                  >
                    <SearchIcon sx={{ fontSize: '1rem' }} />
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Display active keyword chips */}
            {searchKeywords.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                {searchKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    color="primary"
                    onDelete={() => handleRemoveKeyword(keyword)}
                    size="small"
                    sx={{ fontWeight: 'medium', height: '20px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }}
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
                    sx={{ borderColor: 'error.main', color: 'error.main', height: '20px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }}
                  />
                )}
              </Box>
            )}
          </Box>
          
          {/* Collapsible filters section */}
          <Collapse in={filtersOpen}>
            <Box sx={{ p: 1, bgcolor: '#f9f9f9' }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 0.5, fontSize: '0.8rem' }}>
                    Case Filters
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="case-type-select-label" sx={{ fontSize: '0.875rem' }}>Case Type</InputLabel>
                    <Select
                      labelId="case-type-select-label"
                      value={searchCaseType}
                      label="Case Type"
                      onChange={(e) => setSearchCaseType(e.target.value)}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {caseTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Case Engineer"
                    value={searchEngineer}
                    onChange={(e) => setSearchEngineer(e.target.value)}
                    size="small"
                    InputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="File No. From"
                    value={searchFileNo || ''}
                    onChange={(e) => setSearchFileNo(e.target.value)}
                    size="small"
                    placeholder="e.g. EMSD/EEO/BC/19/01/06"
                    InputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="File No. To"
                    value={searchFileNoTo || ''}
                    onChange={(e) => setSearchFileNoTo(e.target.value)}
                    size="small"
                    placeholder="For range search"
                    InputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Created Date From"
                    value={searchCreatedDateFrom || ''}
                    onChange={(e) => setSearchCreatedDateFrom(e.target.value)}
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Created Date To"
                    value={searchCreatedDateTo || ''}
                    onChange={(e) => setSearchCreatedDateTo(e.target.value)}
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      style: { fontSize: '0.875rem' }
                    }}
                  />
                </Grid>
                
                {/* Task Filters Accordion */}
                <Grid item xs={12}>
                  <Accordion 
                    sx={{ 
                      mt: 0.5,
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
                      expandIcon={<KeyboardArrowDownIcon sx={{ fontSize: '1.1rem' }} />}
                      sx={{ bgcolor: 'primary.lighter', p: 0, minHeight: '36px', '& .MuiAccordionSummary-content': { margin: '6px 0' } }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center', fontSize: '0.8rem', ml: 1 }}>
                        <FilterListIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Task Filters
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1 }}>
                      <Grid container spacing={1}>
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
                              style: { fontSize: '0.875rem' }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel id="task-status-select-label" sx={{ fontSize: '0.875rem' }}>Task Status</InputLabel>
                            <Select
                              labelId="task-status-select-label"
                              value={searchTaskStatus}
                              label="Task Status"
                              onChange={(e) => setSearchTaskStatus(e.target.value)}
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {taskStatusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                                  {!option.value && option.label}
                                  {option.value && (
                                    <Chip 
                                      size="small" 
                                      label={option.label}
                                      color={getStatusChipColor(option.value)}
                                      sx={{ mr: 1, minWidth: '80px', height: '20px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                                    />
                                  )}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            fullWidth
                            label="Action By"
                            value={searchTaskActionBy}
                            onChange={(e) => setSearchTaskActionBy(e.target.value)}
                            size="small"
                            placeholder="Search by any role (STO/Engineer/etc)"
                            InputProps={{
                              style: { fontSize: '0.875rem' }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                
                {/* Search Button - Positioned at bottom of expanded filters */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={() => {
                        handleSearch();
                        setFiltersOpen(false);
                      }}
                      startIcon={<SearchIcon sx={{ fontSize: '1rem' }} />}
                      size="small"
                      sx={{ px: 2, fontSize: '0.75rem', height: '30px' }}
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
        <Paper sx={{ mb: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ p: 1, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <FilterListIcon sx={{ mr: 0.75, fontSize: '1.1rem' }} />
              Search Results
            </Typography>
            <Chip 
              label={`${searchResults.length} cases found`} 
              size="small" 
              color="primary" 
              variant="outlined" 
              sx={{ bgcolor: 'white', fontWeight: 'medium', mr: 1 }}
            />
          </Box>
          
          {searchResults.length > 0 ? (
            <>
              <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell padding="checkbox" sx={{ py: 1, pl: 1.5 }}></TableCell>
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
                            py: 1,
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
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 1 }}>Actions</TableCell>
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
                          <TableCell padding="checkbox" sx={{ py: 0.75 }}>
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
                          <TableCell sx={{ py: 0.75 }}>{caseItem.id}</TableCell>
                          <TableCell sx={{ py: 0.75 }}>{caseItem.fileNo}</TableCell>
                          <TableCell sx={{ py: 0.75 }}>{caseItem.caseType}</TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip 
                              label={caseItem.status} 
                              size="small" 
                              color={getStatusChipColor(caseItem.status)}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>{caseItem.caseEngineer}</TableCell>
                          <TableCell sx={{ py: 0.75 }}>{caseItem.createdDate}</TableCell>
                          <TableCell sx={{ py: 0.75 }}>
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
                          <TableCell align="right" sx={{ py: 0.75, pr: 1.5 }} onClick={(e) => e.stopPropagation()}>
                            <Tooltip title="View Case Details">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewCase(caseItem.id);
                                }}
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
                              <Box sx={{ margin: 1, bgcolor: 'background.paper', p: 1, borderRadius: 1, boxShadow: 1 }}>
                                <Typography variant="subtitle2" gutterBottom component="div" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                  <FilterListIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                  Tasks for {caseItem.id}
                                </Typography>
                                
                                {caseItem.tasks && caseItem.tasks.length > 0 ? (
                                  <Table size="small" aria-label="tasks">
                                    <TableHead>
                                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                                        <TableCell sx={{ py: 0.5 }}>Task ID</TableCell>
                                        <TableCell sx={{ py: 0.5 }}>Task Name</TableCell>
                                        <TableCell sx={{ py: 0.5 }}>Status</TableCell>
                                        <TableCell sx={{ py: 0.5 }}>Action By</TableCell>
                                        <TableCell sx={{ py: 0.5 }}>Due Date</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {caseItem.tasks.map((task) => (
                                        <TableRow key={task.id}>
                                          <TableCell component="th" scope="row" sx={{ py: 0.5 }}>
                                            {task.id}
                                          </TableCell>
                                          <TableCell sx={{ py: 0.5 }}>{task.name}</TableCell>
                                          <TableCell sx={{ py: 0.5 }}>
                                            <Chip 
                                              label={task.status} 
                                              size="small" 
                                              color={getStatusChipColor(task.status)}
                                              variant="outlined"
                                            />
                                          </TableCell>
                                          <TableCell sx={{ py: 0.5 }}>
                                            <Tooltip title={formatActionBy(task.actionBy)} arrow placement="top">
                                              <Typography variant="body2" sx={{ 
                                                maxWidth: 200, 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis', 
                                                whiteSpace: 'nowrap',
                                                cursor: 'default'
                                              }}>
                                                {getActionByDisplay(task.actionBy)}
                                              </Typography>
                                            </Tooltip>
                                          </TableCell>
                                          <TableCell sx={{ py: 0.5 }}>{task.dueDate}</TableCell>
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
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
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
                  size="small"
                />
              </Box>
            </>
          ) : (
            <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: '300px', mx: 'auto', mb: 2 }}>
                <SearchIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  No cases found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try adjusting your filters or search terms.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  size="small"
                >
                  Clear filters
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Bookmark Dialog */}
        <Dialog open={bookmarkDialogOpen} onClose={() => setBookmarkDialogOpen(false)}>
          <DialogTitle>{editingBookmark ? 'Edit Saved Search' : 'Save Search'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editingBookmark 
                ? 'Edit the name for this saved search.' 
                : 'Enter a name for this search to save it for future use.'}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Search Name"
              type="text"
              fullWidth
              variant="outlined"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookmarkDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmBookmark} color="primary" variant="contained">
              {editingBookmark ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
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
          sx={{ width: '100%', '& .MuiAlert-message': { color: 'white' } }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Saved Search</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the saved search "{searchToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteSavedSearch} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaseSearch;