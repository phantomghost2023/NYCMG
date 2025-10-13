// Simple test script to verify track upload functionality
const fs = require('fs');

// Create a simple audio file for testing
const createTestAudioFile = () => {
  // Create a simple WAV file header (44 bytes) + some dummy data
  const wavHeader = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // "RIFF"
    0x24, 0x00, 0x00, 0x00, // Chunk size (36 bytes)
    0x57, 0x41, 0x56, 0x45, // "WAVE"
    0x66, 0x6D, 0x74, 0x20, // "fmt "
    0x10, 0x00, 0x00, 0x00, // Subchunk1 size (16 bytes)
    0x01, 0x00,             // Audio format (1 = PCM)
    0x01, 0x00,             // Number of channels (1)
    0x40, 0x1F, 0x00, 0x00, // Sample rate (8000 Hz)
    0x40, 0x1F, 0x00, 0x00, // Byte rate (8000 bytes/sec)
    0x01, 0x00,             // Block align (1)
    0x08, 0x00,             // Bits per sample (8)
    0x64, 0x61, 0x74, 0x61, // "data"
    0x00, 0x00, 0x00, 0x00  // Subchunk2 size (0 bytes)
  ]);
  
  // Write the file
  fs.writeFileSync('test-audio.wav', wavHeader);
  console.log('Created test audio file: test-audio.wav');
};

createTestAudioFile();