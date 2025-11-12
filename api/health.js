export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            api: 'operational',
            database: 'operational',
            authentication: process.env.FIREBASE_API_KEY ? 'operational' : 'degraded',
            ai_teacher: process.env.GEMINI_API_KEY ? 'operational' : 'degraded'
        },
        version: '1.0.0'
    };

    res.status(200).json(health);
}