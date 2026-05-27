const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url.startsWith('/search-image?q=')) {
    const query = decodeURIComponent(req.url.split('q=')[1]);
    
    try {
      const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}&start=0`;
      
      https.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          // Extract image URLs from Google Images page
          const imgUrls = [];
          const regex = /imgurl=([^&]+)/g;
          let match;
          
          while ((match = regex.exec(data)) !== null && imgUrls.length < 5) {
            try {
              const imageUrl = decodeURIComponent(match[1]);
              if (imageUrl.startsWith('http')) {
                imgUrls.push(imageUrl);
              }
            } catch (e) {}
          }
          
          if (imgUrls.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              images: imgUrls,
              firstImage: imgUrls[0]
            }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false, 
              error: 'No images found'
            }));
          }
        });
      }).on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Image proxy server running on http://localhost:${PORT}`);
  console.log(`Use: http://localhost:${PORT}/search-image?q=query`);
});
