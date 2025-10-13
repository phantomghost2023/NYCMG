import { measureRenders } from 'reassure';
import React from 'react';
import SocialInteractionBar from './SocialInteractionBar';

describe('SocialInteractionBar', () => {
  it('renders correctly with track and user', async () => {
    await measureRenders(
      <SocialInteractionBar 
        artistId={1}
        trackId={1}
        onSharePress={() => {}}
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

  it('renders correctly without user', async () => {
    await measureRenders(
      <SocialInteractionBar 
        artistId={1}
        trackId={1}
        onSharePress={() => {}}
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