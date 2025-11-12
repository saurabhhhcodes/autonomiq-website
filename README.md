# 🚀 AxonFlow Platform

**AI Agency & Learning Academy** - Complete platform for AI services and education with lifetime referral earnings.

## 🌟 Features

### 🤖 **AI Agency Services**
- Custom AI agent development
- RAG systems & knowledge bases
- Enterprise automation solutions
- Full-stack web applications

### 🎓 **AxonFlow Academy**
- Interactive AI-powered courses
- Real AI teachers with memory
- 1:1 expert mentorship
- **7-referral milestone** → Free premium course
- **10% lifetime commission** on referrals

### 💳 **Payment System**
- **UPI**: `axonflow.in@ptyes`
- **PayPal**: `saurabhbajpaiai@gmail.com`
- **Crypto**: BTC, ETH, USDT support
- **International**: Wise transfers

## 📁 Project Structure

```
AxonFlow/
├── frontend/           # Frontend application
│   ├── index.html     # Main landing page
│   ├── academy.html   # Learning platform
│   ├── agency.html    # AI services
│   ├── js/           # JavaScript modules
│   └── assets/       # Images, logos, icons
├── api/              # Serverless API functions
│   ├── ai-teacher.js # AI Teacher endpoint
│   └── health.js     # Health check endpoint
├── docs/            # Documentation
└── README.md        # This file
```

## 🚀 Quick Start

### **Frontend Only (Static)**
```bash
# Serve frontend directly
cd frontend
python -m http.server 8000
# Visit: http://localhost:8000
```

### **Full Stack Development**
```bash
# Deploy to Vercel with serverless functions
vercel --prod
```

## 🔧 Configuration

### **Firebase Setup**
1. Create Firebase project: `axonflow-auth`
2. Enable Authentication (Google + Microsoft)
3. Update `frontend/js/firebase-config.js`

### **API Configuration**
- Set `GEMINI_API_KEY` in Vercel environment variables
- API endpoints available at `/api/*`

### **Payment Setup**
- UPI ID: `axonflow.in@ptyes`
- PayPal: `saurabhbajpaiai@gmail.com`
- Update in `frontend/js/alternative-payment.js`

## 🌐 Deployment

### **Vercel (Recommended)**
```yaml
# vercel.json
{
  "functions": {
    "api/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/frontend/$1"
    }
  ]
}
```

## 📊 Revenue Streams

### **Course Sales**
- Premium courses: ₹300 - ₹25,000
- 1:1 mentorship programs
- Certification courses

### **AI Agency Services**
- Custom AI development
- Enterprise solutions
- Consultation services

### **Referral Program**
- **10% lifetime commission**
- **7 referrals** → Free course (₹25k value)
- **15 referrals** → ₹5,000 bonus
- **25 referrals** → Free certification

## 🎯 Key Features

### **Authentication**
- Google OAuth integration
- Microsoft SSO support
- Firebase backend
- Secure user management

### **Learning System**
- AI-powered teachers
- Interactive courses
- Progress tracking
- Certificate generation

### **Payment Processing**
- Multiple payment methods
- Instant course activation
- Automatic referral tracking
- Commission calculations

### **Backend Dashboard**
- Real-time monitoring
- API health checks
- Error logging
- AI diagnostics

## 📱 Mobile Responsive

- Optimized for all devices
- Touch-friendly interface
- Progressive Web App ready
- Offline capability

## 🔒 Security

- Firebase Authentication
- Secure payment processing
- Environment variable protection
- CORS configuration

## 📈 Analytics Ready

- User behavior tracking
- Course completion rates
- Revenue analytics
- Referral performance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- **Email**: support@axonflow.in
- **Website**: https://axonflow.in
- **Documentation**: `/docs` folder
- **Backend Dashboard**: `/backend-dashboard.html`

## 📄 License

© 2025 AxonFlow. All rights reserved.

---

**Built with ❤️ for the future of AI education and services**