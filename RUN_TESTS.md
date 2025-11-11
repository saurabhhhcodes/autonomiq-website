# 🧪 AxonFlow Platform - Testing Guide

## Quick Start

### 1. Start Backend
```bash
cd backend
python production_app.py
```

### 2. Start Frontend
```bash
cd frontend
python -m http.server 8000
```

### 3. Run Tests
```bash
cd tests
python automation_test.py
```

## What Gets Tested

✅ User Signup
✅ Course Enrollment  
✅ Admin Analytics
✅ Backend APIs
✅ All Course Modules

## Test Results

Tests automatically save to `test_report.json`

## Manual Testing

1. **Sign Up**: Go to academy.html → Click "Sign Up" tab
2. **Enroll**: Choose course → Enter details → Pay
3. **Admin**: Go to admin-dashboard.html (admin emails only)
4. **AI Teacher**: Click "Open AI Teacher" on any course

## Production URLs

- Frontend: http://localhost:8000
- Backend: http://localhost:5000
- Admin: http://localhost:8000/admin-dashboard.html
