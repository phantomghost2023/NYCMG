import { measureRenders } from 'reassure';
import React from 'react';
import AudioPlayer from './AudioPlayer';

// Mock track data
const mockTrack = {
  id: 1,
  title: 'Test Track',
  artist: { username: 'Test Artist' },
  audioUrl: 'https://example.com/test.mp3',
  coverArtUrl: 'https://example.com/cover.jpg',
  duration: 180,
};

describe('AudioPlayer', () => {
  it('renders correctly with track data', async () => {
    await measureRenders(
      <AudioPlayer 
        track={mockTrack}
      />,
      {
        wrapper: ({ children }) => (
          <div>
            {children}
          </div>
        )
      }
    );
  });

  it('renders correctly without track data', async () => {
    await measureRenders(
      <AudioPlayer 
        track={null}
      />,
      {
        wrapper: ({ children }) => (
          <div>
            {children}
          </div>
        )
      }
    );
  });
});