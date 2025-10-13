const fs = require('fs');
const path = require('path');

// Stream audio file with range request support
const streamAudio = (req, res) => {
  try {
    // Get the file path from the URL parameter
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }
    
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    // If no range request, send the entire file
    if (!range) {
      const head = {
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    
    // Parse range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    
    // Validate range
    if (start >= fileSize || end >= fileSize) {
      res.status(416).writeHead(416, {
        'Content-Range': `bytes */${fileSize}`
      });
      return res.end();
    }
    
    // Calculate chunk size
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    
    // Set headers for partial content
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    };
    
    res.writeHead(206, head);
    file.pipe(res);
  } catch (error) {
    console.error('Audio streaming error:', error);
    res.status(500).json({ error: 'Failed to stream audio file' });
  }
};

module.exports = {
  streamAudio
};