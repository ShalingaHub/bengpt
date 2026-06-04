const API_URL = 'https://generativelanguage.googleapis.com/v1beta1/models/gemini-1.5-flash-latest:generateContent';

// If you want to hardcode the Gemini API key directly in source,
// set DEFAULT_GEMINI_API_KEY here. This is NOT recommended for
// production, but it will make the app work without requiring an env var.
const DEFAULT_GEMINI_API_KEY = 'AQ.Ab8RN6KO2Y5VpqvwxCS2ol3spgs-JKFqJGBK65MXjYpHuCz1BA';

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await parseJSONBody(req);
    const { promptText, temperature = 0.9, topP = 0.95, maxOutputTokens = 150 } = body;

    if (!promptText || typeof promptText !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid promptText' });
    }

    const apiKey = process.env.GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing server environment variable GEMINI_API_KEY or DEFAULT_GEMINI_API_KEY' });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptText }
            ]
          }
        ],
        temperature,
        topP,
        maxOutputTokens,
      }),
    });

    const data = await response.json();
    const statusCode = response.ok ? 200 : response.status;
    return res.status(statusCode).json(data);
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return res.status(500).json({ error: 'Gemini proxy failed', details: error.message });
  }
};
