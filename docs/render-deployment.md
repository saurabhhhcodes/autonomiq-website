# 🚀 Render Deployment Guide for AxonFlow Platform

## 📋 Prerequisites & Credentials Needed

### 1. **Firebase Setup (for SSO)**
```bash
# Create Firebase Project at https://console.firebase.google.com
Project Name: axonflow-academy
Project ID: axonflow-academy

# Enable Authentication Methods:
- Google OAuth
- Microsoft OAuth  
- Email/Password

# Get Firebase Config:
apiKey: "YOUR_FIREBASE_API_KEY"
authDomain: "axonflow-academy.firebaseapp.com"
projectId: "axonflow-academy"
storageBucket: "axonflow-academy.appspot.com"
messagingSenderId: "YOUR_SENDER_ID"
appId: "YOUR_APP_ID"
```

### 2. **Google OAuth Setup**
```bash
# Go to Google Cloud Console: https://console.cloud.google.com
# Create OAuth 2.0 Client ID

Authorized JavaScript origins:
- https://your-app-name.onrender.com
- http://localhost:3000 (for development)

Authorized redirect URIs:
- https://your-app-name.onrender.com/__/auth/handler
- https://axonflow-academy.firebaseapp.com/__/auth/handler
```

### 3. **Microsoft OAuth Setup**
```bash
# Go to Azure Portal: https://portal.azure.com
# Register new application

Redirect URIs:
- https://your-app-name.onrender.com/__/auth/handler
- https://axonflow-academy.firebaseapp.com/__/auth/handler

Application ID URI: api://axonflow-academy
```

### 4. **Razorpay Payment Gateway**
```bash
# Sign up at https://razorpay.com
Key ID: rzp_live_XXXXXXXXXX (Production)
Key Secret: YOUR_RAZORPAY_SECRET

# Test Credentials:
Key ID: rzp_test_XXXXXXXXXX
Key Secret: YOUR_TEST_SECRET
```

## 🔧 Environment Variables Required

Create `.env` file with these variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=AIzaSyC8K9mF2nX7vQ4pR1sT6uY8wE3rT9yU2iO
FIREBASE_AUTH_DOMAIN=axonflow-academy.firebaseapp.com
FIREBASE_PROJECT_ID=axonflow-academy
FIREBASE_STORAGE_BUCKET=axonflow-academy.appspot.com
FIREBASE_MESSAGING_SENDER_ID=987654321098
FIREBASE_APP_ID=1:987654321098:web:a1b2c3d4e5f6g7h8i9j0

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your-razorpay-secret
UPI_ID=saurabh@paytm

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/axonflow
REDIS_URL=redis://username:password@host:port

# Application Settings
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key

# MSME Details
MSME_NUMBER=UDYAM-MH-12-0012345
COMPANY_NAME=AxonFlow Technologies Pvt Ltd
```

## 📁 File Structure for Deployment

```
Autonomiq/
├── package.json
├── server.js (Node.js backend)
├── render.yaml
├── public/
│   ├── index.html
│   ├── agency.html
│   ├── academy.html
│   ├── logo.png
│   ├── firebase-config.js
│   ├── sso-auth.js
│   ├── payment-system.js
│   ├── enhanced-courses.js
│   ├── advanced-ai-teacher.js
│   ├── button-functionality.js
│   └── ai-agents.js
└── backend/
    ├── routes/
    ├── models/
    └── middleware/
```

## 🚀 Render Deployment Steps

### Step 1: Create `package.json`
```json
{
  "name": "axonflow-platform",
  "version": "1.0.0",
  "description": "AI Learning Platform with Agency Services",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required for static files'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1",
    "firebase-admin": "^11.10.1",
    "mongoose": "^7.5.0",
    "redis": "^4.6.7",
    "razorpay": "^2.9.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-rate-limit": "^6.10.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 2: Create `server.js`
```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://checkout.razorpay.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://api.razorpay.com", "https://identitytoolkit.googleapis.com"]
        }
    }
}));

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/agency', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agency.html'));
});

app.get('/academy', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'academy.html'));
});

// Catch all handler
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 AxonFlow Platform running on port ${PORT}`);
});
```

### Step 3: Create `render.yaml`
```yaml
services:
  - type: web
    name: axonflow-platform
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: FIREBASE_API_KEY
        sync: false
      - key: FIREBASE_AUTH_DOMAIN
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
    healthCheckPath: /api/health
```

## 🔐 Security Configuration

### Update `firebase-config.js` for production:
```javascript
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyC8K9mF2nX7vQ4pR1sT6uY8wE3rT9yU2iO",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "axonflow-academy.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "axonflow-academy",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "axonflow-academy.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "987654321098",
    appId: process.env.FIREBASE_APP_ID || "1:987654321098:web:a1b2c3d4e5f6g7h8i9j0"
};
```

## 📝 Deployment Checklist

### ✅ Before Deployment:
- [ ] Firebase project created and configured
- [ ] Google OAuth credentials obtained
- [ ] Microsoft OAuth credentials obtained  
- [ ] Razorpay account setup (live keys)
- [ ] MongoDB Atlas cluster created
- [ ] All environment variables ready
- [ ] Domain name purchased (optional)

### ✅ Render Setup:
1. **Connect GitHub Repository**
2. **Set Environment Variables** in Render dashboard
3. **Configure Custom Domain** (if applicable)
4. **Enable Auto-Deploy** from main branch
5. **Set up Health Checks**

### ✅ Post-Deployment:
- [ ] Test SSO login (Google + Microsoft)
- [ ] Test payment flow (Razorpay + UPI)
- [ ] Verify AI teacher functionality
- [ ] Test course enrollment process
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate

## 🌐 Custom Domain Setup (Optional)

```bash
# Add CNAME record in your DNS:
CNAME: www -> your-app-name.onrender.com
A: @ -> Render IP address

# Update Firebase authorized domains:
- your-domain.com
- www.your-domain.com
```

## 📊 Monitoring & Analytics

Add to your deployment:
```javascript
// Google Analytics
gtag('config', 'GA_MEASUREMENT_ID');

// Error tracking
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});
```

## 🔧 Credentials Summary

**You need to provide:**
1. **Firebase Project Credentials** (API keys, project ID)
2. **Google OAuth Client ID & Secret**
3. **Microsoft OAuth Client ID & Secret**
4. **Razorpay Live Keys** (Key ID & Secret)
5. **MongoDB Connection String**
6. **Domain Name** (if using custom domain)

**I can help you with:**
- Setting up the complete deployment configuration
- Configuring all the authentication flows
- Testing the payment integration
- Optimizing for production performance

Ready to deploy? Provide the credentials and I'll complete the SSO setup! 🚀