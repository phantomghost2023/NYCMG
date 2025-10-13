import React from 'react';
import { render, screen } from '@testing-library/react';
import AudioPlayer from '../AudioPlayer';

describe('AudioPlayer', () => {
  const mockTrack = {
    id: 1,
    title: 'Test Track',
    audio_url: 'http://localhost:3001/uploads/test-audio.mp3',
    artist: {
      artist_name: 'Test Artist'
    }
  };

  it('renders without crashing', () => {
    render(<AudioPlayer track={mockTrack} />);
    
    expect(screen.getByText('Test Track')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('displays no audio message when track is missing', () => {
    render(<AudioPlayer track={null} />);
    
    expect(screen.getByText('No audio track available')).toBeInTheDocument();
  });

  it('displays no audio message when audio URL is missing', () => {
    const trackWithoutAudio = { ...mockTrack, audio_url: null };
    render(<AudioPlayer track={trackWithoutAudio} />);
    
    expect(screen.getByText('No audio track available')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    render(<AudioPlayer track={mockTrack} />);
    
    // Should show 0:00 for initial time
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });
});