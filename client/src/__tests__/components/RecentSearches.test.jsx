import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecentSearches from '../../components/RecentSearches';

describe('RecentSearches Component', () => {
    // 1. Set the Mock Data
    const mockSearches = [
      {
        id: 'abc123',
        searchType: 'veterinary_care',
        location: {
          string: {
            from: 'Brooklyn, NY',
            to: 'Manhattan, NY',
          },
        },
      },
    ];
  
    // 2. Characterize component property values
    const mockRefetch = jest.fn();
    const mockDelete = jest.fn();
    const mockRevisit = jest.fn();
  
    test('Renders the header and toggles the search list', () => {
      render(
        <RecentSearches
          searches={mockSearches}
          onRefetch={mockRefetch}
          onDelete={mockDelete}
          onRevisit={mockRevisit}
        />
      );
  
      // Header visible
      expect(screen.getByText('Recent Searches')).toBeInTheDocument();
  
      // Toggle list open
      fireEvent.click(screen.getByText('Recent Searches'));
  
      // Confirm searchType and location render correctly
      expect(screen.getByText(/Veterinary_care/i)).toBeInTheDocument();
      expect(screen.getByText(/From: Brooklyn, NY/i)).toBeInTheDocument();
      expect(screen.getByText(/To: Manhattan, NY/i)).toBeInTheDocument();
    });
  
    test('Calls onRefetch when the refresh button is clicked', () => {
      render(
        <RecentSearches
          searches={mockSearches}
          onRefetch={mockRefetch}
          onDelete={mockDelete}
          onRevisit={mockRevisit}
        />
      );
  
      fireEvent.click(screen.getByTitle('Refresh Recent Searches'));
      expect(mockRefetch).toHaveBeenCalled();
    });
  
    test('Calls onDelete when the delete button is clicked', () => {
      render(
        <RecentSearches
          searches={mockSearches}
          onRefetch={mockRefetch}
          onDelete={mockDelete}
          onRevisit={mockRevisit}
        />
      );
  
      fireEvent.click(screen.getByText('Recent Searches')); 
      fireEvent.click(screen.getByTitle('Delete this search'));
  
      expect(mockDelete).toHaveBeenCalledWith('abc123');
    });
  });