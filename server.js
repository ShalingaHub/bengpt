const http = require('http');
const fs = require('fs');
const path = require('path');
const geminiHandler = require('./api/gemini.js');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // Handle Gemini API proxy
  if (req.url === '/api/gemini') {
    return geminiHandler(req, res);
  }

  // Serve static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
      return;
    }

    // Set content type
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
    };

    const contentType = contentTypes[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`🎉 Server running at http://localhost:${PORT}`);
  console.log(`
  ⚠️  IMPORTANT: Set your Gemini API key first!
  
  Option 1: Environment variable (recommended)
    export GEMINI_API_KEY="your-api-key-here"
    node server.js

  Option 2: Edit api/gemini.js and set DEFAULT_GEMINI_API_KEY
  
  Get a free Gemini API key: https://aistudio.google.com/app/apikey
  `);
});
