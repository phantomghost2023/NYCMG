import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  BugReport as BugReportIcon,
  Chat as ChatIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import AIErrorChat from '../src/components/AIErrorChat';
import ErrorDashboard from '../src/components/ErrorDashboard';

const ErrorHandlingPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { id: 0, label: 'AI Chat', icon: <ChatIcon />, component: <AIErrorChat /> },
    { id: 1, label: 'Dashboard', icon: <AnalyticsIcon />, component: <ErrorDashboard /> },
    { id: 2, label: 'Error Reports', icon: <BugReportIcon />, component: <ErrorReports /> },
    { id: 3, label: 'Settings', icon: <SettingsIcon />, component: <ErrorSettings /> },
    { id: 4, label: 'Help', icon: <HelpIcon />, component: <ErrorHelp /> }
  ];

  const renderTabContent = () => {
    const selectedItem = menuItems.find(item => item.id === selectedTab);
    return selectedItem ? selectedItem.component : <AIErrorChat />;
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Error Handling
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.id}
            selected={selectedTab === item.id}
            onClick={() => {
              setSelectedTab(item.id);
              if (isMobile) {
                setDrawerOpen(false);
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            NYCMG AI Error Handling Suite
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 250px)` },
          ml: { sm: '250px' },
          mt: '64px'
        }}
      >
        {renderTabContent()}
      </Box>
    </Box>
  );
};

// Placeholder components for other tabs
const ErrorReports = () => (
  <Container maxWidth="lg">
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Error Reports
      </Typography>
      <Typography variant="body1">
        Comprehensive error reporting and analysis tools will be available here.
      </Typography>
    </Paper>
  </Container>
);

const ErrorSettings = () => (
  <Container maxWidth="lg">
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Error Handling Settings
      </Typography>
      <Typography variant="body1">
        Configure error handling preferences, notification settings, and AI parameters.
      </Typography>
    </Paper>
  </Container>
);

const ErrorHelp = () => (
  <Container maxWidth="lg">
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Help & Documentation
      </Typography>
      <Typography variant="body1">
        Get help with the AI error handling system and learn best practices.
      </Typography>
    </Paper>
  </Container>
);

export default ErrorHandlingPage;
