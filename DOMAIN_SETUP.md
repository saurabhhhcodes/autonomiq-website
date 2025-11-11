# 🌐 Custom Domain Setup for AxonFlow

## Frontend Deployment (Static Files)
Deploy `frontend/` folder to any static hosting:

### Vercel (Recommended)
```bash
cd frontend
npx vercel --prod
# Add custom domain in dashboard
```

### Netlify
```bash
# Drag frontend/ folder to netlify.com
# Add custom domain in settings
```

## Backend Deployment (API)
Deploy `backend/` folder to:

### Render
```yaml
# render.yaml
services:
  - type: web
    name: axonflow-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python app.py
```

### Railway
```bash
cd backend
railway login && railway init && railway up
```

## DNS Configuration
```
A     @           [Frontend-IP]
CNAME api         [Backend-URL]  
CNAME www         [Frontend-URL]
```

## Update Domain References

### 1. OAuth Redirect URIs
**Azure AD Console:**
- Replace `https://axonflow.in/dashboard.html` 
- With `https://yourdomain.com/dashboard.html`

**Google OAuth Console:**
- Replace `https://axonflow.in/dashboard.html`
- With `https://yourdomain.com/dashboard.html`

### 2. Code Updates Required
**File: `frontend/js/firebase-config.js`**
```javascript
redirectUri: "https://yourdomain.com/dashboard.html"
```

**File: `frontend/js/global-auth.js`**
```javascript
redirect_uri: 'https://yourdomain.com/dashboard.html'
```

**File: `backend/app.py`**
```python
allowed_origins = ['https://yourdomain.com']
```

## SSL Certificate
- Automatic with Vercel/Netlify
- Manual: Use Let's Encrypt or Cloudflare

## Final Steps
1. Deploy frontend to static host
2. Deploy backend to Python host  
3. Update DNS records
4. Update OAuth redirect URIs
5. Replace domain in code files
6. Test SSO authentication