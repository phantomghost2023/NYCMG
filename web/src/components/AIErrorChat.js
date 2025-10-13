import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Avatar,
  Badge
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { API_BASE_URL } from 'nycmg-shared';

const AIErrorChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorStats, setErrorStats] = useState(null);
  const [recentErrors, setRecentErrors] = useState([]);
  const [selectedError, setSelectedError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadInitialData();
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInitialData = async () => {
    try {
      const [statsResponse, errorsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/ai-error-handling/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/ai-error-handling/recent?limit=10`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setErrorStats(statsData.statistics);
      }

      if (errorsResponse.ok) {
        const errorsData = await errorsResponse.json();
        setRecentErrors(errorsData.errors);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai-error-handling/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            component: 'web',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          },
          errorId: selectedError?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: data.response,
        timestamp: data.timestamp,
        errorId: data.errorId
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to send message. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const analyzeError = async (errorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-error-handling/analyze/${errorId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedError(data.error);
        
        const analysisMessage = {
          id: Date.now(),
          type: 'ai',
          message: `Analysis for Error ${errorId}:\n\n${JSON.stringify(data.analysis, null, 2)}`,
          timestamp: new Date().toISOString(),
          isAnalysis: true
        };
        
        setMessages(prev => [...prev, analysisMessage]);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze error. Please try again.');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return <ErrorIcon />;
      case 'HIGH': return <WarningIcon />;
      case 'MEDIUM': return <InfoIcon />;
      case 'LOW': return <CheckCircleIcon />;
      default: return <InfoIcon />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <AIIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">AI Error Handling Assistant</Typography>
              <Typography variant="body2" color="text.secondary">
                Chat with AI about errors and get intelligent solutions
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadInitialData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Error Analytics">
              <IconButton>
                <AnalyticsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
        {/* Error Stats Sidebar */}
        <Paper elevation={1} sx={{ width: 300, p: 2, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Error Statistics
          </Typography>
          
          {errorStats && (
            <Box mb={3}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography color="error" variant="h4">
                        {errorStats.critical_errors || 0}
                      </Typography>
                      <Typography variant="body2">Critical</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography color="warning.main" variant="h4">
                        {errorStats.high_errors || 0}
                      </Typography>
                      <Typography variant="body2">High</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography color="info.main" variant="h4">
                        {errorStats.medium_errors || 0}
                      </Typography>
                      <Typography variant="body2">Medium</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography color="success.main" variant="h4">
                        {errorStats.low_errors || 0}
                      </Typography>
                      <Typography variant="body2">Low</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Recent Errors
          </Typography>
          
          <List dense>
            {recentErrors.map((error) => (
              <ListItem
                key={error.id}
                button
                onClick={() => analyzeError(error.id)}
                selected={selectedError?.id === error.id}
                sx={{ mb: 1, borderRadius: 1 }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {getSeverityIcon(error.severity)}
                      <Typography variant="body2" noWrap>
                        {error.message}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Chip
                        label={error.severity}
                        color={getSeverityColor(error.severity)}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(error.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Chat Interface */}
        <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.length === 0 && (
              <Box textAlign="center" py={4}>
                <AIIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Welcome to AI Error Handling
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ask me about errors, get analysis, or request help with debugging
                </Typography>
              </Box>
            )}

            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32
                    }}
                  >
                    {message.type === 'user' ? <PersonIcon /> : <AIIcon />}
                  </Avatar>
                  
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: message.type === 'user' ? 'primary.light' : 'grey.100',
                      color: message.type === 'user' ? 'primary.contrastText' : 'text.primary'
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.message}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}

            {isLoading && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <AIIcon />
                </Avatar>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">AI is thinking...</Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask about errors, request analysis, or get help with debugging..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                startIcon={isLoading ? <CircularProgress size={16} /> : <SendIcon />}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AIErrorChat;
