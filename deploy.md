# AxonFlow Platform Deployment Guide

## Render Deployment Steps

### 1. Backend Deployment

1. **Create New Web Service on Render**
   - Connect your GitHub repository
   - Select `backend` as root directory
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**
   ```
   MONGODB_URL=<your-mongodb-connection-string>
   REDIS_URL=<your-redis-connection-string>
   JWT_SECRET=<generate-random-secret>
   OPENAI_API_KEY=<your-openai-key>
   RAZORPAY_KEY_ID=<your-razorpay-id>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   ```

3. **Database Setup**
   - MongoDB Atlas (recommended) or Render PostgreSQL
   - Redis Cloud or Render Redis

### 2. Frontend Deployment

1. **Create Static Site on Render**
   - Connect same GitHub repository
   - Publish Directory: `./`
   - Build Command: `echo "Static site ready"`

2. **Update API URLs**
   - Replace localhost URLs with Render backend URL
   - Update in `config.js` and other JS files

### 3. Domain Configuration

1. **Custom Domain (Optional)**
   - Add custom domain in Render dashboard
   - Update DNS records
   - SSL automatically provisioned

### 4. Environment Setup

**Development:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Production:**
- Automatic deployment on git push
- Health checks at `/health`
- Logs available in Render dashboard

### 5. Database Initialization

The backend will automatically:
- Create database indexes
- Initialize collections
- Set up default configurations

### 6. Monitoring

- Health endpoint: `https://your-app.onrender.com/health`
- Logs: Render dashboard
- Metrics: Built-in Render monitoring

## Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# 2. Render will auto-deploy both services
# 3. Check deployment status in Render dashboard
```

## Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Database connections work
- [ ] Authentication flows work
- [ ] Payment integration tested
- [ ] AI teacher functionality works
- [ ] Email notifications configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)

## Troubleshooting

**Common Issues:**
1. **Build Failures:** Check requirements.txt and Python version
2. **Database Connection:** Verify MongoDB/Redis URLs
3. **Environment Variables:** Ensure all required vars are set
4. **CORS Issues:** Update allowed origins in backend
5. **Static Files:** Check file paths and case sensitivity

**Support:**
- Render Documentation: https://render.com/docs
- GitHub Issues: Create issue in repository
- Email: hello@axonflow.in