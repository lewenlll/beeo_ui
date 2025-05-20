import React, { useEffect, useState } from 'react';
import {
    Box, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Tooltip, Paper, Fab, Badge, Grow, Chip,
    ToggleButtonGroup, ToggleButton, Stack, Card, CardContent, Container
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppSidebar from '../common/AppSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [inboxExpanded, setInboxExpanded] = useState(false);
  const [selectedDashboards, setSelectedDashboards] = useState(['dashboard1']);
  
  // Available dashboards
  const availableDashboards = [
    {
      id: 'dashboard1',
      name: 'Dashboard 1',
      src: 'https://prod-apsoutheast-b.online.tableau.com/t/hoho147-967601ea99/views/Dashboard_Templatev0_2/Dashboard1'
    },
    {
      id: 'dashboard2',
      name: 'Dashboard 2',
      src: 'https://prod-apsoutheast-b.online.tableau.com/t/hoho147-967601ea99/views/Dashboard_Templatev0_2/Dashboard2'
    }
  ];
  
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

  const unreadCount = inboxMessages.filter(msg => msg.status === 'unread').length;

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
                <Typography variant="h6" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                  Select Dashboards:
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
                      '&:hover': {
                        background: selectedDashboards.includes(dashboard.id) ? undefined : '#f0f0f0'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Tableau Dashboards */}
          {selectedDashboards.map(dashboardId => {
            const dashboard = availableDashboards.find(d => d.id === dashboardId);
            return (
              <Paper 
                key={dashboard.id} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
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
                    height="600px"
                    hide-tabs
                    toolbar="bottom"
                  ></tableau-viz>
                </div>
              </Paper>
            );
          })}
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