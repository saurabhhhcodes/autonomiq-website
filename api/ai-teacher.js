// Vercel Serverless Function for AI Teacher
export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({ 
            response: `Hello! I'm your AI teacher. I can help you learn about ${message.includes('AI') ? 'Artificial Intelligence' : 'various topics'}. However, I need the admin to configure my API key to provide detailed responses. For now, I can tell you that learning is a journey of discovery!` 
        });
    }
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I cannot process your request right now.';

        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('AI Teacher API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}