// Configuration for AxonFlow Platform
window.AXONFLOW_CONFIG = {
    GEMINI_API_KEY: window.location.hostname === 'localhost' 
        ? 'AIzaSyBqd8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z' // Local development
        : 'VERCEL_GEMINI_API_KEY_PLACEHOLDER' // Will be replaced by Vercel build
};