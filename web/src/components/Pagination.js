import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  limit, 
  onPageChange,
  siblingCount = 1
}) => {
  const goToFirstPage = () => onPageChange(1);
  const goToPreviousPage = () => onPageChange(currentPage - 1);
  const goToNextPage = () => onPageChange(currentPage + 1);
  const goToLastPage = () => onPageChange(totalPages);

  // Calculate the range of visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Show dots if there's a gap between first page and current page
    if (currentPage - siblingCount > 2) {
      pages.push('...');
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - siblingCount); 
         i <= Math.min(totalPages - 1, currentPage + siblingCount); 
         i++) {
      pages.push(i);
    }
    
    // Show dots if there's a gap between current page and last page
    if (currentPage + siblingCount < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if it's not the first page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalCount);

  return (
    <Paper sx={{ p: 2, mt: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="body2" color="textSecondary" sx={{ mb: { xs: 2, sm: 0 } }}>
        Showing {startIndex}-{endIndex} of {totalCount} tracks
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          size="small"
          aria-label="First page"
        >
          <FirstPageIcon />
        </IconButton>
        
        <IconButton
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          size="small"
          aria-label="Previous page"
        >
          <NavigateBeforeIcon />
        </IconButton>
        
        {visiblePages.map((page, index) => (
          page === '...' ? (
            <Typography key={`ellipsis-${index}`} sx={{ mx: 1 }} color="textSecondary">
              ...
            </Typography>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              variant={currentPage === page ? 'contained' : 'outlined'}
              size="small"
              sx={{ mx: 0.5, minWidth: '30px' }}
              aria-label={`Page ${page}`}
            >
              {page}
            </Button>
          )
        ))}
        
        <IconButton
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          size="small"
          aria-label="Next page"
        >
          <NavigateNextIcon />
        </IconButton>
        
        <IconButton
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          size="small"
          aria-label="Last page"
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Pagination;