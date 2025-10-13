# 🔗 AI Error Handling Integration Guide

## Overview

This guide shows how to integrate the AI Error Handling Suite with your existing NYCMG project.

## 🚀 Quick Integration

### 1. Backend Integration

#### Add to your main backend file (`backend/src/index.js`):

```javascript
// Add AI Error Handling Routes
app.use('/api/v1/ai-error-handling', require('./error-handling/backend/routes/aiErrorHandling.routes'));

// Replace existing error handling with AI-powered error handling
const aiErrorHandling = require('./error-handling/backend/middleware/aiErrorHandling.middleware');

// Specific error handlers
app.use(aiErrorHandling.handleValidationError());
app.use(aiErrorHandling.handleAuthError());
app.use(aiErrorHandling.handleDatabaseError());
app.use(aiErrorHandling.handleRateLimitError());
app.use(aiErrorHandling.handleFileUploadError());

// Main AI error handler
app.use(aiErrorHandling.handleError());

// 404 handler with AI analysis
app.use(aiErrorHandling.handleNotFound());
```

#### Update your controllers to use AI error handling:

```javascript
// Example controller with AI error handling
const aiErrorHandler = require('../error-handling/backend/services/aiErrorHandler.service');

async function someControllerFunction(req, res) {
  try {
    // Your existing code here
    const result = await someAsyncOperation();
    res.json(result);
  } catch (error) {
    // Let AI handle the error
    const errorRecord = await aiErrorHandler.processError(error, {
      component: 'your-component',
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
    
    res.status(500).json({
      error: 'Something went wrong',
      message: errorRecord.ai_analysis.user_communication,
      suggestions: errorRecord.ai_analysis.suggested_fixes
    });
  }
}
```

### 2. Frontend Integration

#### Add to your web application:

```jsx
// Create a new page: web/pages/error-handling.js
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
import AIErrorChat from '../error-handling/frontend/components/AIErrorChat';
import ErrorDashboard from '../error-handling/frontend/components/ErrorDashboard';

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
```

#### Add navigation to your main app:

```jsx
// Add to your navigation menu
import { Link } from 'next/link';

// Add this to your navigation items
<Link href="/error-handling">
  <MenuItem>
    <ListItemIcon>
      <BugReportIcon />
    </ListItemIcon>
    <ListItemText primary="Error Handling" />
  </MenuItem>
</Link>
```

### 3. Mobile Integration

#### Add to your mobile application:

```jsx
// Create a new screen: mobile/src/screens/ErrorHandlingScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AIErrorHandler from '../error-handling/mobile/components/AIErrorHandler';

const ErrorHandlingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Error Handler</Text>
      <AIErrorHandler />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
});

export default ErrorHandlingScreen;
```

#### Add to your navigation:

```jsx
// Add to your navigation stack
import ErrorHandlingScreen from '../screens/ErrorHandlingScreen';

// Add to your navigation stack
<Stack.Screen 
  name="ErrorHandling" 
  component={ErrorHandlingScreen}
  options={{ title: 'Error Handling' }}
/>
```

## 🔧 Configuration

### 1. Environment Variables

Add to your `.env` files:

```env
# Backend .env
GEMINI_API_KEY=AIzaSyCKje9QdGzu4QeNy0uwfeUmHHoGlFfHhVA
AI_ERROR_HANDLING_ENABLED=true
AI_ERROR_HANDLING_DEBUG=false
AI_ERROR_HANDLING_MAX_ERRORS=1000
AI_ERROR_HANDLING_RETENTION_DAYS=30
```

### 2. Dependencies

#### Backend dependencies:
```bash
cd backend
npm install axios winston
```

#### Frontend dependencies:
```bash
cd web
npm install recharts
```

#### Mobile dependencies:
```bash
cd mobile
npm install react-native-vector-icons
```

## 🚀 Testing the Integration

### 1. Start your services:

```bash
# Backend
cd backend
npm start

# Web frontend
cd web
npm run dev

# Mobile app
cd mobile
npm start
```

### 2. Access the error handling interface:

- **Web**: Navigate to `http://localhost:3000/error-handling`
- **Mobile**: Navigate to the Error Handling screen
- **API**: Use endpoints like `http://localhost:3001/api/v1/ai-error-handling/health`

### 3. Test the AI chat:

1. Go to the AI Chat tab
2. Type a message like "What are the most common errors in this system?"
3. The AI should respond with helpful information

### 4. Test error handling:

1. Try to access a non-existent route
2. The AI error handler should catch the error and provide intelligent analysis
3. Check the error dashboard for the error statistics

## 🔍 Troubleshooting

### Common Issues:

1. **Module not found errors**: Make sure all dependencies are installed
2. **API connection issues**: Check that your backend is running and accessible
3. **Authentication errors**: Ensure you're logged in and have proper tokens
4. **AI service errors**: Verify your Gemini API key is correct

### Debug Mode:

Enable debug mode by setting:
```env
AI_ERROR_HANDLING_DEBUG=true
```

## 📚 Next Steps

1. **Customize the AI responses**: Modify the AI prompts in the service files
2. **Add more error types**: Extend the error handling middleware
3. **Configure notifications**: Set up email/Slack notifications for critical errors
4. **Monitor performance**: Use the dashboard to track system health
5. **Train the AI**: Provide feedback to improve AI responses

## 🎉 Success!

Once integrated, you'll have:

✅ **AI-powered error analysis** for all errors  
✅ **Interactive chat interface** for error assistance  
✅ **Comprehensive dashboard** for error monitoring  
✅ **Automated error resolution** capabilities  
✅ **Multi-platform support** (web and mobile)  

The AI Error Handling Suite is now fully integrated with your NYCMG project! 🚀
