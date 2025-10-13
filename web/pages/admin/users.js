import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import Navigation from '../../src/components/Navigation';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // In a real application, this would fetch from the backend API
    // For now, we'll use mock data
    const mockUsers = [
      { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user', status: 'active', joinDate: '2023-01-15' },
      { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'artist', status: 'active', joinDate: '2023-02-20' },
      { id: 3, username: 'admin_user', email: 'admin@nycmg.com', role: 'admin', status: 'active', joinDate: '2022-11-10' },
      { id: 4, username: 'suspended_user', email: 'suspended@example.com', role: 'user', status: 'suspended', joinDate: '2023-03-05' },
    ];
    setUsers(mockUsers);
  }, []);

  const handleSuspendUser = (userId) => {
    // In a real application, this would make an API call to suspend the user
    console.log(`Suspending user with ID: ${userId}`);
    // Update the UI to reflect the change
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' } 
        : user
    ));
  };

  return (
    <div>
      <Head>
        <title>NYCMG - User Management</title>
        <meta name="description" content="User management for NYCMG platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              User Management
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Manage user accounts and permissions
            </Typography>
          </Container>
        </Box>

        <Container sx={{ py: 4 }} maxWidth="lg">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={user.role === 'admin' ? 'primary' : user.role === 'artist' ? 'secondary' : 'default'} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        color={user.status === 'active' ? 'success' : 'error'} 
                      />
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

export default UserManagement;