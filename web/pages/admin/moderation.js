import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  CircularProgress,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Navigation from '../../src/components/Navigation';

const ContentModeration = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Mock data for content reports
      const mockReports = [
        {
          id: 1,
          reporter: 'user123',
          targetType: 'comment',
          targetContent: 'This is inappropriate content that violates community guidelines...',
          status: 'pending',
          date: '2023-05-15',
          targetId: 45
        },
        {
          id: 2,
          reporter: 'musiclover',
          targetType: 'track',
          targetContent: 'Explicit Lyrics - Offensive Title',
          status: 'pending',
          date: '2023-05-14',
          targetId: 23
        },
        {
          id: 3,
          reporter: 'artistfan',
          targetType: 'profile',
          targetContent: 'Offensive profile image',
          status: 'resolved',
          date: '2023-05-10',
          targetId: 12
        },
        {
          id: 4,
          reporter: 'nycmusic',
          targetType: 'comment',
          targetContent: 'Spam content with links to external sites...',
          status: 'pending',
          date: '2023-05-08',
          targetId: 67
        }
      ];
      
      setReports(mockReports);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (reportId, action) => {
    // In a real app, this would make an API call
    console.log(`Performing ${action} on report ${reportId}`);
    
    // Update the UI to reflect the action
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'resolve' ? 'resolved' : action === 'dismiss' ? 'dismissed' : report.status } 
        : report
    ));
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.status === filter);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Head>
        <title>NYCMG - Content Moderation</title>
        <meta name="description" content="Content moderation for NYCMG platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Content Moderation
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Review and manage reported content
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filter}
                  label="Filter by Status"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">All Reports</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="dismissed">Dismissed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Container>
        </Box>

        <Container sx={{ py: 4 }} maxWidth="lg">
          <Grid container spacing={3}>
            {filteredReports.map((report) => (
              <Grid item xs={12} key={report.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Report #{report.id}
                      </Typography>
                      <Chip 
                        label={report.status} 
                        color={
                          report.status === 'pending' ? 'warning' : 
                          report.status === 'resolved' ? 'success' : 'default'
                        } 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Reported by: <strong>{report.reporter}</strong> on {report.date}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Type: <Chip label={report.targetType} size="small" />
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Reported Content"
                      multiline
                      rows={3}
                      value={report.targetContent}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ mb: 2 }}
                    />
                  </CardContent>
                  
                  {report.status === 'pending' && (
                    <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={() => handleAction(report.id, 'dismiss')}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error"
                        onClick={() => handleAction(report.id, 'remove')}
                      >
                        Remove Content
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={() => handleAction(report.id, 'resolve')}
                      >
                        Mark as Resolved
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
            
            {filteredReports.length === 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" align="center" color="text.secondary">
                      No reports found
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </main>

      <footer style={{ backgroundColor: '#333', color: 'white', padding: '2rem 0' }}>
        <Container maxWidth="lg">
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} NYCMG - NYC Music Growth
          </Typography>
        </Container>
      </footer>
    </div>
  );
};

export default ContentModeration;