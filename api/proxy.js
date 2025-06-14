export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url param' });
  }

  try {
    const queryParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const fullUrl = `${targetUrl}?${queryParams.toString().replace(/^url=[^&]*&?/, '')}`;

    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // facultatif : tu peux copier d'autres headers si tu veux
      },
    });

    const data = await response.text();

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    res.status(response.status).send(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy request failed', details: e.message });
  }
}

