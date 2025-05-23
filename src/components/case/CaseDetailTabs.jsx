import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Menu,
  Tooltip,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GenericApplicationForm from '../common/GenericApplicationForm';

// TabPanel helper component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`case-detail-tabpanel-${index}`}
      aria-labelledby={`case-detail-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2, px: 0.5, pb: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CaseDetailTabs = (props) => {
  const {
    currentTab,
    handleTabChange,
    caseData,
    applicationData, // This is casesData[caseId].applicationForm
    editMode,
    setEditMode, // To toggle edit mode
    editableData, // The state for form edits
    handleFieldChange,
    handleNestedFieldChange,
    handleAddressChange,
    handleSimpleFieldChange, // Added for GenericApplicationForm
    handleArrayObjectChange, // Added for GenericApplicationForm
    handleQualificationAttachmentChange, // Added for GenericApplicationForm
    // Props for Tasks tab
    filteredTasks,
    taskFilter,
    handleTaskFilter,
    statusFilter,
    setStatusFilter,
    advancedFilterOpen,
    setAdvancedFilterOpen,
    searchTaskActionBy,
    setSearchTaskActionBy,
    dueDateFromFilter,
    setDueDateFromFilter,
    dueDateToFilter,
    setDueDateToFilter,
    handleTaskClick,
    formatActionBy,
    actionMenuAnchorEl,
    setActionMenuAnchorEl,
    // Props for Attachments tab
    // mockAttachments, // Will need actual attachments data
    // Props for Related Cases tab
    relatedCases,
    handleViewRelatedCaseInNewTab,
    casesData, // Full casesData for related case details
    // Props for History tab
    mockHistory,
    // General
    handleSave, // General save function for application form
  } = props;

  if (!caseData || !applicationData) {
    return <Typography sx={{ p: 2 }}>Loading case data...</Typography>;
  }
  
  return (
    <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', boxShadow: 'none', borderRadius: '0 0 8px 8px' }}>
       <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="Case Detail Tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
          bgcolor: 'grey.50',
          minHeight: 'auto',
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0'
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'medium',
            fontSize: '0.8rem',
            minHeight: '32px',
            padding: '6px 10px',
            '&.Mui-selected': {
              color: 'primary.main',
            }
          }
        }}
      >
        <Tab label="Application" />
        <Tab label="Tasks" />
        <Tab label="Attachments" />
        <Tab label={`Related Cases (${relatedCases.length})`} />
        <Tab label="History" />
      </Tabs>

      {/* Application Tab */}
      <TabPanel value={currentTab} index={0}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5, mt: -1 }}>
            <Button
              variant={editMode ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              startIcon={<EditIcon sx={{fontSize: '1rem'}}/>}
              onClick={() => {
                if (editMode && handleSave) {
                    handleSave(); // Call the save function passed from parent
                }
                setEditMode(!editMode);
              }}
              sx={{ height: '32px', fontSize: '0.75rem', px:1.5 }}
            >
              {editMode ? 'Save Form' : 'Edit Form'}
            </Button>
          </Box>

          {/* Use GenericApplicationForm for all application types it supports */}
          <GenericApplicationForm
            applicationType={caseData.caseType} // Pass the caseType to determine form structure
            applicationData={applicationData} // Original data for display values
            editableData={editableData} // Current editable form state
            editMode={editMode}
            // Pass appropriate handlers. These need to match what GenericApplicationForm expects.
            // WBRS uses a more granular set of handlers.
            // CaseDetail uses handleFieldChange, handleNestedFieldChange, handleAddressChange (which was handleTabAddressChange).
            // We need to ensure these are compatible or adapt them.
            handleFieldChange={handleFieldChange} 
            handleSimpleFieldChange={handleSimpleFieldChange}
            handleNestedFieldChange={handleNestedFieldChange} // Or pass a more specific one if needed
            handleAddressChange={handleAddressChange} // This was handleTabAddressChange, ensure it matches Generic's expectation
            handleArrayObjectChange={handleArrayObjectChange}
            handleQualificationAttachmentChange={handleQualificationAttachmentChange}
          />
        </Box>
      </TabPanel>

      {/* Tasks Tab */}
      <TabPanel value={currentTab} index={1}>
         <Box>
            <Card sx={{ mb: 1.5, borderRadius:1, border: '1px solid', borderColor:'divider' }} variant="outlined">
                <CardHeader
                    title="Manage Tasks"
                    action={
                        <Box>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<MoreVertIcon />}
                                onClick={(event) => setActionMenuAnchorEl(event.currentTarget)}
                                sx={{ height: '32px', fontSize: '0.75rem', px:1.5 }}
                            >
                                Actions
                            </Button>
                            <Menu
                                anchorEl={actionMenuAnchorEl}
                                open={Boolean(actionMenuAnchorEl)}
                                onClose={() => setActionMenuAnchorEl(null)}
                            >
                                <MenuItem onClick={() => { handleTaskClick(null); setActionMenuAnchorEl(null); }}>
                                    <ListItemIcon><NoteAddIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText primaryTypographyProps={{fontSize: '0.875rem'}}>Request Supplement</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => { setActionMenuAnchorEl(null); /* Handle other action */ }}>
                                    <ListItemIcon><CancelIcon fontSize="small" color="error" /></ListItemIcon>
                                    <ListItemText primaryTypographyProps={{fontSize: '0.875rem'}}>Withdraw</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => { setActionMenuAnchorEl(null); /* Handle other action */ }}>
                                    <ListItemIcon><BlockIcon fontSize="small" color="error" /></ListItemIcon>
                                    <ListItemText primaryTypographyProps={{fontSize: '0.875rem'}}>Reject</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    }
                    sx={{ bgcolor: 'grey.50', py: 0.75, px:1.5, '& .MuiCardHeader-title': {fontSize: '0.9rem', fontWeight:'medium', color: 'primary.main'}}}
                />
                <CardContent sx={{ p: "12px !important"}}>
                    <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} md={6} lg={5}>
                            <TextField
                                label="Search Tasks"
                                placeholder="Enter task name"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={taskFilter}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                                    style:{fontSize: '0.875rem'}
                                }}
                                InputLabelProps={{style:{fontSize: '0.875rem'}}}
                                onChange={(e) => handleTaskFilter(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <InputLabel sx={{fontSize: '0.875rem'}}>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    sx={{fontSize: '0.875rem'}}
                                >
                                    <MenuItem value="" sx={{fontSize: '0.875rem'}}>All</MenuItem>
                                    <MenuItem value="Pending" sx={{fontSize: '0.875rem'}}>Pending</MenuItem>
                                    <MenuItem value="In Progress" sx={{fontSize: '0.875rem'}}>In Progress</MenuItem>
                                    <MenuItem value="Completed" sx={{fontSize: '0.875rem'}}>Completed</MenuItem>
                                    <MenuItem value="Cancelled" sx={{fontSize: '0.875rem'}}>Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={4} sx={{ display: 'flex', gap: 1, justifyContent: {xs: 'flex-start', md: 'flex-end'} }}>
                             <Button
                                variant="text"
                                size="small"
                                onClick={() => setAdvancedFilterOpen(!advancedFilterOpen)}
                                startIcon={<FilterListIcon fontSize="small" />}
                                sx={{ minWidth: 'unset', fontSize:'0.75rem' }}
                            >
                                More Filters
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                color="secondary"
                                onClick={() => {
                                    handleTaskFilter('');
                                    setStatusFilter('');
                                    setDueDateFromFilter('');
                                    setDueDateToFilter('');
                                    setSearchTaskActionBy('');
                                    setAdvancedFilterOpen(false);
                                }}
                                sx={{ minWidth: 'unset', fontSize:'0.75rem' }}
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
             <Collapse in={advancedFilterOpen}>
                <Card sx={{ mb: 1.5, borderRadius:1, border: '1px solid', borderColor:'divider' }} variant="outlined">
                    <CardContent sx={{ p: "12px !important"}}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField label="Action By" placeholder="Filter by any role" variant="outlined" size="small" fullWidth value={searchTaskActionBy} onChange={(e) => setSearchTaskActionBy(e.target.value)} InputProps={{style:{fontSize: '0.875rem'}}} InputLabelProps={{style:{fontSize: '0.875rem'}}}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField label="Due Date From" type="date" variant="outlined" size="small" fullWidth value={dueDateFromFilter} InputLabelProps={{ shrink: true, style:{fontSize: '0.875rem'} }} onChange={(e) => setDueDateFromFilter(e.target.value)} inputProps={{style:{fontSize: '0.875rem'}}}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField label="Due Date To" type="date" variant="outlined" size="small" fullWidth value={dueDateToFilter} InputLabelProps={{ shrink: true, style:{fontSize: '0.875rem'} }} onChange={(e) => setDueDateToFilter(e.target.value)} inputProps={{style:{fontSize: '0.875rem'}}}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Collapse>

            <List sx={{p:0}}>
              {filteredTasks.map((task) => (
                <ListItem
                  key={task.id}
                  button
                  onClick={() => handleTaskClick(task)}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    mb: 1,
                    bgcolor: 'background.paper',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
                      transform: 'translateY(-1px)'
                    },
                    p: 1.25 
                  }}
                >
                  <ListItemText
                    primary={<Typography variant="subtitle2" fontWeight="medium" fontSize="0.875rem">{task.name}</Typography>}
                    secondary={
                      <Box sx={{ mt: 0.25, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'inline-block', mr: 2, fontSize:'0.75rem' }}>
                          Due: {task.dueDate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="span" sx={{fontSize:'0.75rem'}}>
                          Action By: {formatActionBy(task.actionBy)}
                        </Typography>
                      </Box>
                    }
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={task.status}
                    size="small"
                    color={task.status === 'In Progress' ? 'primary' : (task.status === 'Pending' ? 'warning' : (task.status === 'Completed' || task.status === 'Closed' ? 'success' : (task.status === 'Rejected' ? 'error' : 'default')))}
                    sx={{ fontWeight: 'medium', height: '20px', fontSize:'0.7rem', '& .MuiChip-label': {px:0.75}}}
                  />
                </ListItem>
              ))}
            </List>
            {filteredTasks.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                  No tasks match your filter criteria.
                </Typography>
              </Box>
            )}
          </Box>
      </TabPanel>

      {/* Attachments Tab */}
      <TabPanel value={currentTab} index={2}>
        <Box>
            <Card sx={{ mb: 1.5, borderRadius:1, border: '1px solid', borderColor:'divider' }} variant="outlined">
                <CardContent sx={{ p: "12px 16px !important" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', fontSize:'0.9rem', color: 'primary.main' }}>
                    Case Attachments
                    </Typography>
                    <TextField
                        placeholder="Search attachments"
                        size="small"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                            style:{fontSize: '0.875rem'}
                        }}
                        InputLabelProps={{style:{fontSize: '0.875rem'}}}
                        sx={{ width: '280px' }}
                        // onChange={(e) => setSearchAttachmentText(e.target.value)} // Placeholder for search state
                    />
                </Box>
                </CardContent>
            </Card>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius:1 }}>
                <Table size="small" aria-label="case attachments table">
                <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>File Name</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Description</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Type</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Uploaded By</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Upload Date</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5, textAlign:'center'}}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Mock Data - Replace with actual data from props */}
                    {[
                        { name: 'Application_Form.pdf', description: 'REA Application Form', type: 'PDF', uploadedBy: 'John Doe', uploadDate: '2023-11-20' },
                        { name: 'Professional_Certificate.pdf', description: 'Professional Engineering Certificate', type: 'PDF', uploadedBy: 'John Doe', uploadDate: '2023-11-20' },
                    ].map((att, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{py:0.75, px:1.5}}>
                        <Typography variant="body2" component="a" href="#" onClick={(e) => {e.preventDefault(); alert(`Mock downloading ${att.name}`)}} sx={{ textDecoration: 'underline', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5, fontSize:'0.8rem' }}>
                            <AssignmentIcon fontSize="inherit" sx={{mr:0.25}}/> {att.name}
                        </Typography>
                        </TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.description}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.type}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.uploadedBy}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.uploadDate}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, textAlign:'center'}}>
                        <Tooltip title="More actions">
                            <IconButton size="small" onClick={() => alert('Mock actions for ' + att.name)}>
                            <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        </TableCell>
                    </TableRow>
                    ))}
                    {/* Add a row for no attachments if list is empty */}
                </TableBody>
                </Table>
            </TableContainer>
            {/* Placeholder for AttachmentUpload component */}
            {/* <Box sx={{mt:2}}> <AttachmentUpload /> </Box> */}
        </Box>
      </TabPanel>

      {/* Related Cases Tab */}
      <TabPanel value={currentTab} index={3}>
        <Box>
            <Card sx={{ mb: 1.5, borderRadius:1, border: '1px solid', borderColor:'divider' }} variant="outlined">
                <CardContent sx={{ p: "12px 16px !important" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', fontSize:'0.9rem', color: 'primary.main' }}>Related Cases</Typography>
                    <TextField
                        placeholder="Search related cases"
                        size="small"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                            style:{fontSize: '0.875rem'}
                        }}
                        InputLabelProps={{style:{fontSize: '0.875rem'}}}
                        sx={{ width: '280px' }}
                    />
                </Box>
                </CardContent>
            </Card>
            
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius:1 }}>
                <Table size="small" aria-label="related cases table">
                <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Case ID</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>File No.</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Case Type</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Status</TableCell>
                    <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Created Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {relatedCases.map((relatedCase) => (
                    <TableRow key={relatedCase.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{py:0.75, px:1.5}}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 0.5, fontSize:'0.8rem' }}>{relatedCase.id}</Typography>
                            <Tooltip title="View Case Details in New Tab">
                            <IconButton
                                size="small"
                                onClick={() => handleViewRelatedCaseInNewTab(relatedCase.id)}
                                color="primary"
                                sx={{p:0.25}}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                            </Tooltip>
                        </Box>
                        </TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{casesData[relatedCase.id]?.fileNo}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{casesData[relatedCase.id]?.caseType}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5}}>
                        <Chip
                            size="small"
                            label={relatedCase.status}
                            color={relatedCase.status === 'Open' ? 'primary' : (relatedCase.status === 'In Progress' ? 'primary' : (relatedCase.status === 'Pending' ? 'warning' : (relatedCase.status === 'Rejected' ? 'error' : (relatedCase.status === 'Completed' || relatedCase.status === 'Closed' ? 'success' : 'default'))))}
                            sx={{ height: '20px', fontSize:'0.7rem', '& .MuiChip-label': {px:0.75}}}
                        />
                        </TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{casesData[relatedCase.id]?.createdDate}</TableCell>
                    </TableRow>
                    ))}
                    {relatedCases.length === 0 && (
                        <TableRow><TableCell colSpan={5} align="center" sx={{ py:3, fontSize:'0.85rem', color:'text.secondary' }}>No related cases found.</TableCell></TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
      </TabPanel>

      {/* History Tab */}
      <TabPanel value={currentTab} index={4}>
        <Box>
            <Card sx={{ mb: 1.5, borderRadius:1, border: '1px solid', borderColor:'divider' }} variant="outlined">
                <CardHeader
                    title="Filter Case History"
                    sx={{ bgcolor: 'grey.50', py: 0.75, px:1.5, '& .MuiCardHeader-title': {fontSize: '0.9rem', fontWeight:'medium', color: 'primary.main'}}}
                />
                <CardContent sx={{ p: "12px !important"}}>
                    <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField fullWidth label="Search Action/Details" size="small" InputProps={{style:{fontSize: '0.875rem'}}} InputLabelProps={{style:{fontSize: '0.875rem'}}} /* value={historySearchText} onChange={(e) => setHistorySearchText(e.target.value)} */ />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{fontSize: '0.875rem'}}>Filter by Event Type</InputLabel>
                                <Select label="Filter by Event Type" defaultValue="all" sx={{fontSize: '0.875rem'}}>
                                    <MenuItem value="all" sx={{fontSize: '0.875rem'}}>All Events</MenuItem>
                                    <MenuItem value="task" sx={{fontSize: '0.875rem'}}>Task Events</MenuItem>
                                    <MenuItem value="document" sx={{fontSize: '0.875rem'}}>Document Events</MenuItem>
                                    <MenuItem value="status" sx={{fontSize: '0.875rem'}}>Status Changes</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                             <TextField fullWidth label="Filter by Actor" size="small" InputProps={{style:{fontSize: '0.875rem'}}} InputLabelProps={{style:{fontSize: '0.875rem'}}} /* value={historyActorFilter} onChange={(e) => setHistoryActorFilter(e.target.value)} */ />
                        </Grid>
                        <Grid item xs={12} md={2} sx={{textAlign:{md:'right'}}}>
                            <Button variant="outlined" size="small" /* onClick clear filters */ sx={{fontSize:'0.75rem'}}>Clear Filters</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius:1 }}>
                <Table size="small" aria-label="case history table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5, width: '20%'}}>Date</TableCell>
                            <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5, width: '40%'}}>Action</TableCell>
                            <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5, width: '20%'}}>Actor</TableCell>
                            <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5, width: '20%'}}>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockHistory.map((item, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{item.date}</TableCell>
                            <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{item.action}</TableCell>
                            <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{item.actor}</TableCell>
                            <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{item.details || 'N/A'}</TableCell>
                        </TableRow>
                        ))}
                        {mockHistory.length === 0 && (
                            <TableRow><TableCell colSpan={4} align="center" sx={{ py:3, fontSize:'0.85rem', color:'text.secondary' }}>No history entries found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default CaseDetailTabs; 