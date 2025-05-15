import React, { useEffect, useState } from 'react';
import {
    Box,  Typography,  List,  ListItem,  ListItemIcon,  ListItemText,  IconButton,  Divider,  Tooltip,  Paper,  Fab,  Badge,  Grow,  Chip
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CloseIcon from '@mui/icons-material/Close';
import AppSidebar from '../common/AppSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [inboxExpanded, setInboxExpanded] = useState(false);
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

  const unreadCount = inboxMessages.filter(msg => msg.status === 'unread').length;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto', position: 'relative' }}>
        <div className="dashboard-content">
          {/* Tableau Dashboard */}
          <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            <div className="tableau-container">
              <tableau-viz
                id="tableau-viz"
                src="https://prod-apsoutheast-b.online.tableau.com/t/hoho147-967601ea99/views/Dashboard_Templatev0_2/Dashboard1"
                device="desktop"
                width="100%"
                height="600px"
                hide-tabs
                toolbar="bottom"
              ></tableau-viz>
            </div>
          </Paper>
          
          {/* REMOVED Old Inbox Section */}
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