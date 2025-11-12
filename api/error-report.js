export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const error = req.body;
    
    // Log error for monitoring
    console.log('Frontend Error Report:', {
        timestamp: error.timestamp,
        type: error.type,
        message: error.message,
        source: error.source,
        url: error.url
    });

    res.status(200).json({ status: 'logged' });
}