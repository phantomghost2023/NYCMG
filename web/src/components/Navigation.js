import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BugReportIcon from '@mui/icons-material/BugReport';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" passHref>
            <Button color="inherit" sx={{ fontWeight: 'bold' }}>
              NYCMG
            </Button>
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Link href="/map" passHref>
            <Button color="inherit" startIcon={<MapIcon />}>
              Map
            </Button>
          </Link>
          <Link href="/search" passHref>
            <Button color="inherit" startIcon={<SearchIcon />}>
              Search
            </Button>
          </Link>
          <Link href="/profile" passHref>
            <Button color="inherit" startIcon={<PersonIcon />}>
              Profile
            </Button>
          </Link>
          <Link href="/error-handling" passHref>
            <Button color="inherit" startIcon={<BugReportIcon />}>
              Error Handling
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;