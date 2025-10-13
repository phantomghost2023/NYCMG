import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  BugReport as BugReportIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkCheckIcon,
  Memory as MemoryIcon,
  Cpu as CpuIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { API_BASE_URL } from 'nycmg-shared';

const ErrorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedError, setSelectedError] = useState(null);
  const [errorDetailsOpen, setErrorDetailsOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('24h');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ai-error-handling/dashboard?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
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

  const handleErrorClick = async (errorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-error-handling/error/${errorId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedError(data.error);
        setErrorDetailsOpen(true);
      }
    } catch (error) {
      console.error('Failed to load error details:', error);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-error-handling/export?format=csv&timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-data-${timeframe}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Key Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="error" variant="h4">
                      {dashboardData?.statistics?.critical_errors || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Critical Errors
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <ErrorIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="warning.main" variant="h4">
                      {dashboardData?.statistics?.high_errors || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Priority
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <WarningIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="info.main" variant="h4">
                      {dashboardData?.statistics?.medium_errors || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Medium Priority
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <InfoIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="success.main" variant="h4">
                      {dashboardData?.statistics?.low_errors || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Priority
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CheckCircleIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Error Trends Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Error Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.trends?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="critical" stroke="#f44336" strokeWidth={2} />
                <Line type="monotone" dataKey="high" stroke="#ff9800" strokeWidth={2} />
                <Line type="monotone" dataKey="medium" stroke="#2196f3" strokeWidth={2} />
                <Line type="monotone" dataKey="low" stroke="#4caf50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Error Distribution */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Error Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Critical', value: dashboardData?.statistics?.critical_errors || 0, color: '#f44336' },
                    { name: 'High', value: dashboardData?.statistics?.high_errors || 0, color: '#ff9800' },
                    { name: 'Medium', value: dashboardData?.statistics?.medium_errors || 0, color: '#2196f3' },
                    { name: 'Low', value: dashboardData?.statistics?.low_errors || 0, color: '#4caf50' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {[
                    { name: 'Critical', value: dashboardData?.statistics?.critical_errors || 0, color: '#f44336' },
                    { name: 'High', value: dashboardData?.statistics?.high_errors || 0, color: '#ff9800' },
                    { name: 'Medium', value: dashboardData?.statistics?.medium_errors || 0, color: '#2196f3' },
                    { name: 'Low', value: dashboardData?.statistics?.low_errors || 0, color: '#4caf50' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRecentErrorsTab = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Recent Errors
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportData}
            size="small"
          >
            Export
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Severity</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData?.recentErrors?.errors?.map((error) => (
                <TableRow key={error.id} hover>
                  <TableCell>
                    <Chip
                      icon={getSeverityIcon(error.severity)}
                      label={error.severity}
                      color={getSeverityColor(error.severity)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {error.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {error.context?.component || 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatTimestamp(error.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={error.status || 'pending'}
                      color={error.status === 'resolved' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleErrorClick(error.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderSystemHealthTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NetworkCheckIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Network Connectivity"
                  secondary="All services operational"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StorageIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Database"
                  secondary="Connection stable"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <MemoryIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Memory Usage"
                  secondary="75% utilized"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CpuIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="CPU Usage"
                  secondary="45% utilized"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Response Time
              </Typography>
              <LinearProgress variant="determinate" value={75} />
              <Typography variant="caption" color="text.secondary">
                150ms average
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Error Rate
              </Typography>
              <LinearProgress variant="determinate" value={25} color="warning" />
              <Typography variant="caption" color="text.secondary">
                2.5% error rate
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Uptime
              </Typography>
              <LinearProgress variant="determinate" value={99.9} color="success" />
              <Typography variant="caption" color="text.secondary">
                99.9% uptime
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom>
              Error Handling Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered error monitoring and analysis
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadDashboardData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportData}
            >
              Export Data
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="Overview" icon={<AnalyticsIcon />} />
          <Tab label="Recent Errors" icon={<BugReportIcon />} />
          <Tab label="System Health" icon={<SpeedIcon />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && renderOverviewTab()}
      {selectedTab === 1 && renderRecentErrorsTab()}
      {selectedTab === 2 && renderSystemHealthTab()}

      {/* Error Details Dialog */}
      <Dialog
        open={errorDetailsOpen}
        onClose={() => setErrorDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Error Details
          {selectedError && (
            <Chip
              icon={getSeverityIcon(selectedError.severity)}
              label={selectedError.severity}
              color={getSeverityColor(selectedError.severity)}
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedError && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Message
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedError.message}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Context
              </Typography>
              <Typography variant="body2" paragraph>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(selectedError.context, null, 2)}
                </pre>
              </Typography>
              
              {selectedError.ai_analysis && (
                <>
                  <Typography variant="h6" gutterBottom>
                    AI Analysis
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                      {JSON.stringify(selectedError.ai_analysis, null, 2)}
                    </pre>
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ErrorDashboard;
