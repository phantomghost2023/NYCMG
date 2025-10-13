import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from '../Navigation';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }) => (
    <a href={href}>{children}</a>
  );
});

describe('Navigation', () => {
  test('renders navigation links', () => {
    render(<Navigation />);
    
    expect(screen.getByText('NYCMG')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('navigation links have correct hrefs', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Map').closest('a')).toHaveAttribute('href', '/map');
    expect(screen.getByText('Search').closest('a')).toHaveAttribute('href', '/search');
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/profile');
  });
});