import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIconUI from '@mui/icons-material/ArrowUpward';
import ClearIcon from '@mui/icons-material/Clear';
import GenericApplicationForm from '../common/GenericApplicationForm';

// TabPanel helper component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wbrs-app-tabpanel-${index}`}
      aria-labelledby={`wbrs-app-tab-${index}`}
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

const WBRSApplicationTabs = (props) => {
  const {
    currentTab,
    handleTabChange,
    wbrsApp,
    applicationData,
    editMode,
    setEditMode,
    handleSaveApplicationForm,
    handleFieldChange,
    handleSimpleFieldChange,
    handleNestedFieldChange,
    handleAddressChange,
    handleArrayObjectChange,
    handleQualificationAttachmentChange,
    aggregatedAttachments
  } = props;

  // State for History tab filters
  const [historySearchText, setHistorySearchText] = React.useState('');
  const [historyActorFilter, setHistoryActorFilter] = React.useState('');
  const [historyDateFromFilter, setHistoryDateFromFilter] = React.useState('');
  const [historyDateToFilter, setHistoryDateToFilter] = React.useState('');

  // State for History tab sorting
  const [historySortBy, setHistorySortBy] = React.useState('date');
  const [historySortDirection, setHistorySortDirection] = React.useState('desc');

  const filteredHistory = React.useMemo(() => {
    if (!wbrsApp?.history) return [];
    return wbrsApp.history.filter(entry => {
      const entryDate = new Date(entry.date);
      const searchLower = historySearchText.toLowerCase();
      const actorLower = historyActorFilter.toLowerCase();

      const matchesSearchText = historySearchText ? 
        (entry.action?.toLowerCase().includes(searchLower) || entry.details?.toLowerCase().includes(searchLower)) 
        : true;
      const matchesActor = historyActorFilter ? entry.actor?.toLowerCase().includes(actorLower) : true;
      const matchesDateFrom = historyDateFromFilter ? entryDate >= new Date(historyDateFromFilter) : true;
      const matchesDateTo = historyDateToFilter ? entryDate <= new Date(new Date(historyDateToFilter).setHours(23,59,59,999)) : true;

      return matchesSearchText && matchesActor && matchesDateFrom && matchesDateTo;
    });
  }, [wbrsApp?.history, historySearchText, historyActorFilter, historyDateFromFilter, historyDateToFilter]);

  const sortedHistory = React.useMemo(() => {
    let sortableItems = [...filteredHistory];
    sortableItems.sort((a, b) => {
      let valA = a[historySortBy];
      let valB = b[historySortBy];

      if (historySortBy === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (valA < valB) {
        return historySortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return historySortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [filteredHistory, historySortBy, historySortDirection]);

  const handleHistorySort = (columnId) => {
    const isAsc = historySortBy === columnId && historySortDirection === 'asc';
    setHistorySortDirection(isAsc ? 'desc' : 'asc');
    setHistorySortBy(columnId);
  };

  if (!wbrsApp) {
    return <Typography sx={{ p: 2 }}>Loading application data...</Typography>;
  }

  return (
    <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', boxShadow: 'none', borderRadius: '0 0 8px 8px' }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="WBRS Application Details Tabs"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
          minHeight: 'auto',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.8rem',
            minHeight: '32px',
            p: '6px 10px'
          }
        }}
      >
        <Tab label="Application Form" />
        <Tab label="Attachments" />
        <Tab label="History" />
      </Tabs>

      {/* Application Form Tab */}
      <TabPanel value={currentTab} index={0}>
        {applicationData && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5, mt: -0.5, px: 0.5 }}>
              <Button
                variant={editMode ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                startIcon={<EditIcon sx={{fontSize: '1rem'}}/>}
                onClick={() => editMode ? handleSaveApplicationForm() : setEditMode(true)}
                sx={{ height: '32px', fontSize: '0.75rem', px:1.5 }}
              >
                {editMode ? 'Save Form' : 'Edit Form'}
              </Button>
            </Box>
            
            <GenericApplicationForm 
                applicationType={wbrsApp.applicationType}
                applicationData={wbrsApp.applicationForm}
                editableData={applicationData}
                editMode={editMode}
                handleFieldChange={handleFieldChange}
                handleSimpleFieldChange={handleSimpleFieldChange}
                handleNestedFieldChange={handleNestedFieldChange}
                handleAddressChange={handleAddressChange}
                handleArrayObjectChange={handleArrayObjectChange}
                handleQualificationAttachmentChange={handleQualificationAttachmentChange}
            />
          </Box>
        )}
        {!applicationData && (
          <Card variant="outlined"><CardContent><Typography color="textSecondary">Application form details are only available for REA Registration type at the moment.</Typography></CardContent></Card>
        )}
      </TabPanel>

      {/* Attachments Tab */}
      <TabPanel value={currentTab} index={1}>
        <Box>
          <Card sx={{ mb: 1.5, borderRadius:1, border: '1px solid', borderColor:'divider' }} variant="outlined">
            <CardContent sx={{ p: "12px 16px !important" }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', fontSize:'0.9rem', color: 'primary.main' }}>
                  Attached Documents
                </Typography>
                <TextField
                  placeholder="Search attachments"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    style:{fontSize: '0.875rem'}
                  }}
                  sx={{ width: '280px' }}
                />
              </Box>
            </CardContent>
          </Card>

          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius:1 }}>
            <Table size="small" aria-label="attachments table">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>File Name</TableCell>
                  <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Description / Source</TableCell>
                  <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Type</TableCell>
                  <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>File Size</TableCell>
                  <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Uploaded By</TableCell>
                  <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Upload Date</TableCell>
                  <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5, textAlign:'center'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aggregatedAttachments && aggregatedAttachments.length > 0 ? (
                  aggregatedAttachments.map((att) => {
                    if (!att) return null;
                    return (
                      <TableRow key={att.id || att.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{py:0.75, px:1.5}}>
                          <Typography variant="body2" component="a" href="#" onClick={(e) => {e.preventDefault(); alert(`Mock downloading ${att.name}`)}} sx={{ textDecoration: 'underline', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5, fontSize:'0.8rem' }}>
                            <AssignmentIcon fontSize="inherit" sx={{mr:0.25}}/> {att.name || 'Unnamed File'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.description || att.type || 'N/A'}{att.source && att.source !== 'Main Application' ? ` (${att.source})` : ''}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.fileType || 'N/A'}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.fileSize || 'N/A'}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.uploadedBy || 'N/A'}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem'}}>{att.uploadedDate ? new Date(att.uploadedDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell sx={{py:0.75, px:1.5, textAlign:'center'}}>
                          <Tooltip title="More actions">
                            <IconButton size="small" onClick={() => alert('Mock actions for ' + att.name)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py:3, fontSize:'0.85rem', color:'text.secondary' }}>
                      No attachments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{mt:2, p:1.5, border:'1px dashed', borderColor:'divider', borderRadius:1, textAlign:'center'}}>
            <Typography variant="caption" color="textSecondary">Drag & drop files here or click to browse (Upload UI Placeholder)</Typography>
          </Box>
        </Box>
      </TabPanel>

      {/* History Tab */}
      <TabPanel value={currentTab} index={2}>
        <Card sx={{ mb: 1.5, borderRadius:1, border: '1px solid', borderColor:'divider' }} variant="outlined">
            <CardHeader 
                title="Filter History"
                sx={{ bgcolor: 'grey.50', py: 0.75, px:1.5, '& .MuiCardHeader-title': {fontSize: '0.9rem', fontWeight:'medium', color: 'primary.main'}}}
            />
            <CardContent sx={{ p: "12px !important"}}>
                <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Search Action/Details"
                            size="small"
                            value={historySearchText}
                            onChange={(e) => setHistorySearchText(e.target.value)}
                            InputProps={{style:{fontSize: '0.875rem'}} }
                            InputLabelProps={{style:{fontSize: '0.875rem'}}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Filter by Action By"
                            size="small"
                            value={historyActorFilter}
                            onChange={(e) => setHistoryActorFilter(e.target.value)}
                            InputProps={{style:{fontSize: '0.875rem'}} }
                            InputLabelProps={{style:{fontSize: '0.875rem'}}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            label="Date From"
                            type="date"
                            size="small"
                            value={historyDateFromFilter}
                            onChange={(e) => setHistoryDateFromFilter(e.target.value)}
                            InputLabelProps={{ shrink: true, style:{fontSize: '0.875rem'} }}
                            inputProps={{style:{fontSize: '0.875rem'}}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            label="Date To"
                            type="date"
                            size="small"
                            value={historyDateToFilter}
                            onChange={(e) => setHistoryDateToFilter(e.target.value)}
                            InputLabelProps={{ shrink: true, style:{fontSize: '0.875rem'} }}
                            inputProps={{style:{fontSize: '0.875rem'}}}
                        />
                    </Grid>
                    <Grid item xs={12} md={2} sx={{textAlign:{md:'right'}}}>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => {
                                setHistorySearchText('');
                                setHistoryActorFilter('');
                                setHistoryDateFromFilter('');
                                setHistoryDateToFilter('');
                                setHistorySortBy('date');
                                setHistorySortDirection('desc');
                            }}
                            startIcon={<ClearIcon />}
                        >
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

        <Card variant="outlined">
          <TableContainer component={Paper} sx={{boxShadow:'none', border:'1px solid', borderColor:'divider', borderRadius:1}}>
            <Table size="small" aria-label="application history table">
                <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell sx={{py:0.75, px:1.5, cursor: 'pointer'}} onClick={() => handleHistorySort('date')}>
                            <Box sx={{display:'flex', alignItems:'center'}}>
                                <Typography sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary'}}>Date</Typography>
                                {historySortBy === 'date' ? (historySortDirection === 'asc' ? <ArrowUpwardIconUI sx={{fontSize:'0.9rem', ml:0.5}}/> : <ArrowDownwardIcon sx={{fontSize:'0.9rem', ml:0.5}}/>) : null}
                            </Box>
                        </TableCell>
                        <TableCell sx={{py:0.75, px:1.5, cursor: 'pointer'}} onClick={() => handleHistorySort('action')}>
                            <Box sx={{display:'flex', alignItems:'center'}}>
                                <Typography sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary'}}>Action</Typography>
                                {historySortBy === 'action' ? (historySortDirection === 'asc' ? <ArrowUpwardIconUI sx={{fontSize:'0.9rem', ml:0.5}}/> : <ArrowDownwardIcon sx={{fontSize:'0.9rem', ml:0.5}}/>) : null}
                            </Box>
                        </TableCell>
                        <TableCell sx={{py:0.75, px:1.5, cursor: 'pointer'}} onClick={() => handleHistorySort('actor')}>
                            <Box sx={{display:'flex', alignItems:'center'}}>
                                <Typography sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary'}}>Action By</Typography>
                                {historySortBy === 'actor' ? (historySortDirection === 'asc' ? <ArrowUpwardIconUI sx={{fontSize:'0.9rem', ml:0.5}}/> : <ArrowDownwardIcon sx={{fontSize:'0.9rem', ml:0.5}}/>) : null}
                            </Box>
                        </TableCell>
                        <TableCell sx={{fontSize:'0.75rem', fontWeight:'bold', color:'text.secondary', py:0.75, px:1.5}}>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedHistory && sortedHistory.length > 0 ? (
                        sortedHistory.map((entry, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem', width:'20%'}}>{new Date(entry.date).toLocaleString()}</TableCell>
                                <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem', width:'30%'}}>{entry.action}</TableCell>
                                <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem', width:'20%'}}>{entry.actor}</TableCell>
                                <TableCell sx={{py:0.75, px:1.5, fontSize:'0.8rem', width:'30%'}}>{entry.details}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py:3, fontSize:'0.85rem', color:'text.secondary' }}>
                                No history entries found matching your criteria.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </TabPanel>
    </Paper>
  );
};

export default WBRSApplicationTabs; 