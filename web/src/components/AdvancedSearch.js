import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoroughs } from '../store/boroughSlice';
import { fetchGenres } from '../store/genreSlice';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f5f5f5'
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const AdvancedSearch = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { boroughs, loading: boroughsLoading } = useSelector((state) => state.boroughs);
  const { genres, loading: genresLoading } = useSelector((state) => state.genres);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoroughs, setSelectedBoroughs] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isExplicit, setIsExplicit] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Fetch boroughs and genres on component mount
  useEffect(() => {
    dispatch(fetchBoroughs());
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();
    
    const searchParams = {
      search: searchTerm,
      boroughIds: selectedBoroughs,
      genreIds: selectedGenres,
      isExplicit: isExplicit,
      sortBy: sortBy,
      sortOrder: sortOrder
    };
    
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedBoroughs([]);
    setSelectedGenres([]);
    setIsExplicit(false);
    setSortBy('created_at');
    setSortOrder('DESC');
    
    // Trigger search with cleared parameters
    if (onSearch) {
      onSearch({
        search: '',
        boroughIds: [],
        genreIds: [],
        isExplicit: false,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });
    }
  };

  const handleBoroughChange = (event) => {
    const value = event.target.value;
    setSelectedBoroughs(typeof value === 'string' ? value.split(',') : value);
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setSelectedGenres(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <SearchContainer>
      <Typography variant="h6" gutterBottom>
        Advanced Search
      </Typography>
      
      <Box component="form" onSubmit={handleSearch}>
        <FilterSection>
          <TextField
            fullWidth
            label="Search tracks, artists, albums..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            margin="normal"
          />
        </FilterSection>
        
        <FilterSection>
          <FormControl fullWidth margin="normal">
            <InputLabel>Boroughs</InputLabel>
            <Select
              multiple
              value={selectedBoroughs}
              onChange={handleBoroughChange}
              input={<OutlinedInput label="Boroughs" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const borough = boroughs.find(b => b.id === value);
                    return (
                      <Chip 
                        key={value} 
                        label={borough ? borough.name : value} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              )}
            >
              {boroughs.map((borough) => (
                <MenuItem key={borough.id} value={borough.id}>
                  {borough.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FilterSection>
        
        <FilterSection>
          <FormControl fullWidth margin="normal">
            <InputLabel>Genres</InputLabel>
            <Select
              multiple
              value={selectedGenres}
              onChange={handleGenreChange}
              input={<OutlinedInput label="Genres" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const genre = genres.find(g => g.id === value);
                    return (
                      <Chip 
                        key={value} 
                        label={genre ? genre.name : value} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              )}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FilterSection>
        
        <FilterSection>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isExplicit}
                  onChange={(e) => setIsExplicit(e.target.checked)}
                />
              }
              label="Explicit content only"
            />
          </FormGroup>
        </FilterSection>
        
        <FilterSection>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="created_at">Date Added</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="release_date">Release Date</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Order"
              >
                <MenuItem value="ASC">Ascending</MenuItem>
                <MenuItem value="DESC">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </FilterSection>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            type="submit"
          >
            Search
          </Button>
        </Box>
      </Box>
    </SearchContainer>
  );
};

export default AdvancedSearch;