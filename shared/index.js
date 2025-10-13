// Shared utilities and constants for NYCMG platform

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';

export const BOROUGHS = {
  MANHATTAN: 'Manhattan',
  BROOKLYN: 'Brooklyn',
  QUEENS: 'Queens',
  BRONX: 'The Bronx',
  STATEN_ISLAND: 'Staten Island'
};

export const GENRES = [
  'Hip-Hop',
  'Indie Rock',
  'Lo-Fi',
  'Jazz',
  'Punk',
  'Afrobeat',
  'Experimental',
  'Electronic',
  'Pop',
  'R&B',
  'Folk',
  'Classical'
];

export const ROLE_TYPES = {
  USER: 'user',
  ARTIST: 'artist',
  ADMIN: 'admin',
  CURATOR: 'curator'
};

// Utility functions
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};