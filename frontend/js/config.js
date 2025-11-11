// AxonFlow Platform Configuration
const CONFIG = {
    // API Configuration
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8001' 
        : 'https://axonflow-backend.onrender.com',
    
    // Frontend Configuration
    FRONTEND_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://axonflow.onrender.com',
    
    // Firebase Configuration (replace with your config)
    FIREBASE_CONFIG: {
        apiKey: "your-api-key",
        authDomain: "axonflow-platform.firebaseapp.com",
        projectId: "axonflow-platform",
        storageBucket: "axonflow-platform.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id"
    },
    
    // Payment Configuration
    RAZORPAY_KEY_ID: "rzp_test_your_key_id",
    
    // Course Configuration
    COURSES: {
        'ai-agent': {
            id: 'ai-agent',
            title: 'AI Agent Development',
            price: 25000,
            duration: '3 months',
            sessions: 4
        },
        'fullstack': {
            id: 'fullstack',
            title: 'Full-Stack Development',
            price: 18000,
            duration: '3 months',
            sessions: 3
        },
        'n8n': {
            id: 'n8n',
            title: 'N8N Automation',
            price: 15000,
            duration: '2 months',
            sessions: 2
        },
        'data-analysis': {
            id: 'data-analysis',
            title: 'Data Analysis',
            price: 20000,
            duration: '3 months',
            sessions: 3
        },
        'testing': {
            id: 'testing',
            title: 'Testing & QA',
            price: 12000,
            duration: '2 months',
            sessions: 2
        },
        'database': {
            id: 'database',
            title: 'Database Engineering',
            price: 15000,
            duration: '2 months',
            sessions: 2
        }
    },
    
    // UI Configuration
    THEME: {
        primary: '#06b6d4',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}