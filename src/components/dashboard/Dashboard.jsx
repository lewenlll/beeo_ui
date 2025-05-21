import React, { useEffect, useState } from 'react';
import {
    Box, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Tooltip, Paper, Fab, Badge, Grow, Chip,
    ToggleButtonGroup, ToggleButton, Stack, Card, CardContent, Container, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, CircularProgress, Pagination, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppSidebar from '../common/AppSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [inboxExpanded, setInboxExpanded] = useState(false);
  const [selectedDashboards, setSelectedDashboards] = useState(['dashboard1']);
  
  // Handler to navigate to case details
  const handleViewCase = (caseId) => {
    navigate(`/cases/${caseId}`);
  };
  
  // Available dashboards
  const availableDashboards = [
    {
      id: 'dashboard1',
      name: 'Dashboard 1',
      src: 'https://public.tableau.com/views/Dashboard_Templatev0_21/SeniorManagement?:language=en[…]sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
    },
    {
      id: 'dashboard2',
      name: 'Dashboard 2',
      src: 'https://public.tableau.com/views/Dashboard_Templatev0_2-Dashboard2/Dashboard2?:languag[…]sid=&:redirect=auth&:display_count=n&:origin=viz_share_link'
    },
    {
      id: 'pendingCasesSummary',
      name: 'My Cases',
      src: null // Not a Tableau dashboard
    }
  ];
  
  // Pending cases (updated to follow CaseSearch.jsx mock data structure)
  const [pendingCases, setPendingCases] = useState([
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
      caseType: 'REA Renewal',
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
      id: 'CASE005', 
      fileNo: 'EMSD/EEO/BC/19/02/01',
      caseEngineer: 'E/EEB3/5',
      status: 'In Progress', 
      caseType: 'REA Change',
      createdDate: '2023-11-22',
      lastUpdated: '2023-11-28',
      tasks: [
        { id: 7, name: 'Technical Assessment', status: 'In Progress', actionBy: { sto: 'STO/EEB5/2' }, dueDate: '2023-12-10' },
        { id: 8, name: 'Compliance Verification', status: 'Pending', actionBy: { sto: 'STO/EEB5/2' }, dueDate: '2023-12-15' }
      ]
    }
  ]);
  
  const [inboxMessages, setInboxMessages] = useState([
    {
      id: 1,
      subject: "New Case Assignment",
      content: "You have been assigned to Case #001 - REA New Application",
      date: "2024-03-20 09:30 AM",
      status: "unread"
    },
    {
      id: 2,
      subject: "Task Pending for Your Follow-up",
      content: "Please follow-up the Review Submitted Documents for Case #001 - REA New Application",
      date: "2024-03-19 02:15 PM",
      status: "read"
    },
    {
      id: 3,
      subject: "Task Pending for Your Follow-up",
      content: "Please follow-up the Prepare / Issue Acknowledgement Letter Annex F1 for Case #001 - REA New Application",
      date: "2024-03-18 11:45 AM",
      status: "unread"
    }
  ]);

  // Add pagination state for My Cases panel
  const [casesPage, setCasesPage] = useState(1);
  const casesPerPage = 5;

  useEffect(() => {
    // Load Tableau script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://prod-apsoutheast-b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const markAsRead = (messageId) => {
    setInboxMessages(messages =>
      messages.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      )
    );
  };

  const handleDashboardSelection = (dashboardId) => {
    setSelectedDashboards(prev => {
      // If dashboard is already selected, remove it (unless it's the last one)
      if (prev.includes(dashboardId)) {
        const newSelection = prev.filter(id => id !== dashboardId);
        return newSelection.length === 0 ? prev : newSelection;
      } 
      // Otherwise add it
      return [...prev, dashboardId];
    });
  };

  // Get status chip color based on status (from CaseSearch.jsx)
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

  const unreadCount = inboxMessages.filter(msg => msg.status === 'unread').length;

  // Calculate paginated cases
  const getPaginatedCases = () => {
    const startIndex = (casesPage - 1) * casesPerPage;
    const endIndex = startIndex + casesPerPage;
    return pendingCases.slice(startIndex, endIndex);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto', position: 'relative' }}>
        <div className="dashboard-content">
          {/* Dashboard Selection */}
          <Paper 
            elevation={1} 
            sx={{ 
              mb: 3, 
              borderRadius: 2, 
              py: 1.5, 
              px: 2, 
              width: '100%',
              background: 'linear-gradient(to right, #f5f7fa, #ffffff)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexWrap: 'nowrap',
              width: '100%'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 3,
                minWidth: 'max-content'
              }}>
                <DashboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500, whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  My Panels:
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableDashboards.map(dashboard => (
                  <Chip
                    key={dashboard.id}
                    label={dashboard.name}
                    onClick={() => handleDashboardSelection(dashboard.id)}
                    color={selectedDashboards.includes(dashboard.id) ? "primary" : "default"}
                    variant={selectedDashboards.includes(dashboard.id) ? "filled" : "outlined"}
                    sx={{ 
                      fontWeight: selectedDashboards.includes(dashboard.id) ? 500 : 400,
                      px: 1,
                      fontSize: '0.75rem',
                      '&:hover': {
                        background: selectedDashboards.includes(dashboard.id) ? undefined : '#f0f0f0'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Dashboard Grid Layout */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',                                // 1 column on extra small screens
                sm: selectedDashboards.length > 1 ? '1fr 1fr' : '1fr',  // 2 columns on small screens if multiple dashboards
                md: selectedDashboards.length > 2 ? '1fr 1fr 1fr' : (selectedDashboards.length > 1 ? '1fr 1fr' : '1fr') // 3 columns on medium+ screens if needed
              },
              gap: 3,
              width: '100%',
              flex: 1
            }}
          >
            {/* Tableau Dashboards and Pending Case Summary */}
            {selectedDashboards.map(dashboardId => {
              const dashboard = availableDashboards.find(d => d.id === dashboardId);
              if (dashboard.id === 'pendingCasesSummary') {
                // Render My Cases panel here
                return (
                  <Paper 
                    key={dashboard.id} 
                    sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <FolderOpenIcon sx={{ mr: 1.5 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: '1.1rem', 
                          fontWeight: 500,
                          flexGrow: 1
                        }}
                      >
                        My Cases
                      </Typography>
                      <Chip 
                        label={`${pendingCases.length} Cases`} 
                        size="small" 
                        sx={{ 
                          color: 'white',
                          bgcolor: 'rgba(255,255,255,0.2)',
                          fontWeight: 500
                        }} 
                      />
                    </Box>
                    <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
                      <Table size="small" aria-label="pending cases">
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                            <TableCell><Typography variant="subtitle2">Case ID</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2">Type</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2">Due Date</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2">Tasks</Typography></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getPaginatedCases().map((caseItem) => {
                            // Summarize task statuses
                            const taskStatusSummary = caseItem.tasks
                              ? Object.entries(
                                  caseItem.tasks.reduce((acc, task) => {
                                    acc[task.status] = (acc[task.status] || 0) + 1;
                                    return acc;
                                  }, {})
                                )
                              : [];
                            return (
                              <TableRow 
                                key={caseItem.id}
                                hover
                                sx={{ 
                                  '&:hover': { 
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                                  }
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>{caseItem.id}</Typography>
                                    <Tooltip title="View Case Details">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewCase(caseItem.id);
                                        }}
                                        color="primary"
                                        sx={{ ml: 'auto' }}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{caseItem.caseType}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={caseItem.status} 
                                    size="small" 
                                    color={getStatusChipColor(caseItem.status)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{caseItem.dueDate}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                    {taskStatusSummary.length > 0 ? (
                                      <>
                                        <Chip
                                          size="small"
                                          label={`${caseItem.tasks.length} ${caseItem.tasks.length === 1 ? 'Task' : 'Tasks'}`}
                                          color="primary"
                                          sx={{ fontWeight: 'medium' }}
                                        />
                                        {taskStatusSummary.map(([status, count]) => (
                                          <Chip
                                            key={status}
                                            label={`${status}: ${count}`}
                                            size="small"
                                            color={getStatusChipColor(status)}
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem', height: '20px' }}
                                          />
                                        ))}
                                      </>
                                    ) : (
                                      <Typography variant="body2" color="text.secondary">No tasks</Typography>
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {/* Pagination for My Cases panel */}
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', borderTop: '1px solid #eee' }}>
                      <Pagination 
                        count={Math.ceil(pendingCases.length / casesPerPage)} 
                        page={casesPage} 
                        onChange={(event, newPage) => setCasesPage(newPage)} 
                        color="primary" 
                        size="small"
                      />
                    </Box>
                  </Paper>
                );
              }
              // Tableau dashboards
              return (
                <Paper 
                  key={dashboard.id} 
                  sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 500,
                        flexGrow: 1
                      }}
                    >
                      {dashboard.name}
                    </Typography>
                  </Box>
                  <div className="tableau-container">
                    <tableau-viz
                      id={`tableau-viz-${dashboard.id}`}
                      src={dashboard.src}
                      device="desktop"
                      width="100%"
                      height="100%"
                      hide-tabs
                      toolbar="bottom"
                    ></tableau-viz>
                  </div>
                </Paper>
              );
            })}
          </Box>
        </div>

        {/* Floating Inbox Button */}
        {!inboxExpanded && (
          <Fab
            color="primary"
            aria-label="inbox"
            sx={{
              position: 'fixed',
              bottom: (theme) => theme.spacing(3), 
              right: (theme) => theme.spacing(3),
              zIndex: (theme) => theme.zIndex.drawer + 100 
            }}
            onClick={() => setInboxExpanded(true)}
          >
            <Badge badgeContent={unreadCount} color="error">
              <MailOutlineIcon />
            </Badge>
          </Fab>
        )}

        {/* Expanded Inbox Panel */}
        <Grow in={inboxExpanded} mountOnEnter unmountOnExit>
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              bottom: (theme) => theme.spacing(3), 
              right: (theme) => theme.spacing(3),
              width: 380, 
              maxHeight: 'calc(100vh - 120px)', // Adjusted for better screen fit
              height: 500, // Give a substantial default height
              display: 'flex',
              flexDirection: 'column',
              zIndex: (theme) => theme.zIndex.drawer + 100,
              borderRadius: 2, 
              overflow: 'hidden',
              transformOrigin: 'bottom right', // For Grow transition
            }}
          >
            <Box
              sx={{
                p: 1.5, // Reduced padding for a tighter header
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Inbox Messages</Typography> {/* Slightly smaller title */}
              <IconButton color="inherit" size="small" onClick={() => setInboxExpanded(false)} aria-label="close inbox">
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1, backgroundColor: 'background.paper' }}>
              {/* Message list rendering (same as current) */}
               <div className="inbox-messages">
                {inboxMessages.length === 0 && (
                  <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 2}}>
                    No messages in your inbox.
                  </Typography>
                )}
                {inboxMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message-card ${message.status === 'unread' ? 'unread' : ''}`}
                    onClick={() => markAsRead(message.id)}
                    // Add some hover effect for better UX
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                  >
                    <div className="message-header">
                      <Typography variant="subtitle1" component="h3" sx={{ fontWeight: message.status === 'unread' ? 'bold' : 'normal' }}>
                        {message.subject}
                      </Typography>
                      {message.status === 'unread' && 
                        <Chip label="New" size="small" color="error" sx={{ ml: 1, height: 'auto', fontSize: '0.7rem' }} />
                      }
                    </div>
                    <Typography variant="body2" sx={{ my: 0.5 }}>{message.content}</Typography>
                    <Typography variant="caption" color="text.secondary" component="span" sx={{ fontSize: '0.75rem' }}>{message.date}</Typography>
                  </div>
                ))}
              </div>
            </Box>
          </Paper>
        </Grow>
      </Box>
    </Box>
  );
};

export default Dashboard;