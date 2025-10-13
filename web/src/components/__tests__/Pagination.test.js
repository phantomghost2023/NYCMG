import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const onPageChangeMock = jest.fn();

  beforeEach(() => {
    onPageChangeMock.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    expect(screen.getByText('Showing 1-20 of 100 tracks')).toBeInTheDocument();
  });

  it('does not render when there is only one page', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        totalCount={20}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    // Should render nothing
    expect(container.firstChild).toBeNull();
  });

  it('renders page numbers correctly', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    // Should show all page numbers (1, 2, 3, 4, 5)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    // The current page button should have contained variant
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('MuiButton-contained');
  });

  it('disables first and previous buttons on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    const firstPageButton = screen.getByLabelText('First page');
    const previousPageButton = screen.getByLabelText('Previous page');
    
    expect(firstPageButton).toBeDisabled();
    expect(previousPageButton).toBeDisabled();
  });

  it('disables next and last buttons on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    const nextPageButton = screen.getByLabelText('Next page');
    const lastPageButton = screen.getByLabelText('Last page');
    
    expect(nextPageButton).toBeDisabled();
    expect(lastPageButton).toBeDisabled();
  });

  it('calls onPageChange with correct page number when page button is clicked', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    // Click on page 2 button
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with correct page number when navigation buttons are clicked', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    // Click previous button
    const previousButton = screen.getByLabelText('Previous page');
    fireEvent.click(previousButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
    
    // Click next button
    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(4);
    
    // Click first button
    const firstButton = screen.getByLabelText('First page');
    fireEvent.click(firstButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(1);
    
    // Click last button
    const lastButton = screen.getByLabelText('Last page');
    fireEvent.click(lastButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(5);
  });

  it('shows ellipsis when there are many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        totalCount={400}
        limit={20}
        onPageChange={onPageChangeMock}
        siblingCount={1}
      />
    );
    
    // Should show ellipsis before and after current page range
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('shows correct range of items', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        totalCount={100}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    // On page 3 with limit 20, should show items 41-60
    expect(screen.getByText('Showing 41-60 of 100 tracks')).toBeInTheDocument();
  });

  it('handles case where endIndex exceeds totalCount', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        totalCount={95}
        limit={20}
        onPageChange={onPageChangeMock}
      />
    );
    
    // On page 5 with limit 20 and totalCount 95, should show items 81-95 (not 81-100)
    expect(screen.getByText('Showing 81-95 of 95 tracks')).toBeInTheDocument();
  });
});