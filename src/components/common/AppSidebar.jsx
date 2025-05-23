import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DescriptionIcon from '@mui/icons-material/Description';

const AppSidebar = ({ drawerOpen, setDrawerOpen }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerOpen ? 240 : 65,
        flexShrink: 0,
        transition: theme => theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerOpen ? 240 : 65,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: theme => theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {/* Sidebar Header */}
      {drawerOpen ? (
        // Expanded sidebar header
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center' 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            BEEO System
          </Typography>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{ color: 'primary.main' }}
            aria-label="collapse sidebar"
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      ) : (
        // Collapsed sidebar header
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
          pb: 1
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              fontSize: '1.1rem',
              mb: 1
            }}
          >
            BEEO
          </Typography>
          <Tooltip title="Expand sidebar" placement="right">
            <IconButton 
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                color: 'primary.main',
                backgroundColor: 'action.hover',
                width: 35,
                height: 35,
                '&:hover': {
                  backgroundColor: 'action.selected',
                }
              }}
              aria-label="expand sidebar"
            >
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Divider />
      <List sx={{ pt: 1 }}>
        <Tooltip title={drawerOpen ? "" : "Home"} placement="right">
          <ListItem 
            button 
            component="a" 
            href="/" 
            sx={{ 
              py: 1.5,
              px: drawerOpen ? 2 : 'auto',
              justifyContent: drawerOpen ? 'flex-start' : 'center',
              minHeight: 48
            }}
          >
            <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 0, mr: drawerOpen ? 2 : 'auto' }}>
              <HomeIcon color="primary" />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Home" />}
          </ListItem>
        </Tooltip>

        <Tooltip title={drawerOpen ? "" : "WBRS Applications"} placement="right">
          <ListItem 
            button 
            component="a" 
            href="/wbrs-search" 
            sx={{ 
              py: 1.5,
              px: drawerOpen ? 2 : 'auto',
              justifyContent: drawerOpen ? 'flex-start' : 'center',
              minHeight: 48
            }}
          >
            <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 0, mr: drawerOpen ? 2 : 'auto' }}>
              <DescriptionIcon color="primary" />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="WBRS Applications" />}
          </ListItem>
        </Tooltip>
        
        <Tooltip title={drawerOpen ? "" : "Cases"} placement="right">
          <ListItem 
            button 
            component="a" 
            href="/cases" 
            sx={{ 
              py: 1.5,
              px: drawerOpen ? 2 : 'auto',
              justifyContent: drawerOpen ? 'flex-start' : 'center',
              minHeight: 48
            }}
          >
            <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 0, mr: drawerOpen ? 2 : 'auto' }}>
              <SearchIcon color="primary" />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Cases" />}
          </ListItem>
        </Tooltip>
        
        <Tooltip title={drawerOpen ? "" : "Buildings"} placement="right">
          <ListItem 
            button 
            component="a" 
            href="/buildings" 
            sx={{ 
              py: 1.5,
              px: drawerOpen ? 2 : 'auto',
              justifyContent: drawerOpen ? 'flex-start' : 'center',
              minHeight: 48
            }}
          >
            <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 0, mr: drawerOpen ? 2 : 'auto' }}>
              <ApartmentIcon color="primary" />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Buildings" />}
          </ListItem>
        </Tooltip>

        
      </List>
      <Divider />
    </Drawer>
  );
};

export default AppSidebar; 