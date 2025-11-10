# 🔥 Firebase Setup Instructions for AxonFlow-Auth Project

## Step 1: Get Firebase Configuration

1. **Click on "AxonFlow-Auth" project** in your Firebase console
2. **Go to Project Settings** (gear icon in sidebar)
3. **Scroll down to "Your apps"** section
4. **Click "Add app"** → Select **Web** (</> icon)
5. **App nickname**: `AxonFlow Platform`
6. **Check "Also set up Firebase Hosting"** (optional)
7. **Click "Register app"**

## Step 2: Copy Configuration

You'll see a config object like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "axonflow-auth.firebaseapp.com",
  projectId: "axonflow-auth", 
  storageBucket: "axonflow-auth.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Send me this exact config object!**

## Step 3: Enable Authentication Methods

1. **Go to Authentication** in Firebase console sidebar
2. **Click "Sign-in method" tab**
3. **Enable these providers:**
   - ✅ **Email/Password** → Enable
   - ✅ **Google** → Enable (will auto-configure)
   - ✅ **Microsoft** → Enable (need to configure)

## Step 4: Configure Google OAuth (Auto-configured)

Google should be automatically configured since you're using Firebase.

## Step 5: Configure Microsoft OAuth

1. **In Firebase Authentication → Sign-in method**
2. **Click Microsoft provider**
3. **You'll need Microsoft App ID and Secret**

### Get Microsoft Credentials:
1. Go to https://portal.azure.com
2. **Azure Active Directory** → **App registrations**
3. **New registration**: "AxonFlow Platform"
4. **Redirect URI**: `https://axonflow-auth.firebaseapp.com/__/auth/handler`
5. **Copy Application (client) ID**
6. **Certificates & secrets** → **New client secret**
7. **Copy the secret value**

## Step 6: Add Authorized Domains

1. **In Firebase Authentication → Settings**
2. **Authorized domains** section
3. **Add these domains:**
   - `axonflow.in`
   - `localhost` (for testing)
   - Your Render domain when you deploy

## What I Need From You:

### 🔥 **URGENT - Firebase Config:**
```javascript
// Send me this exact object from Step 2
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "axonflow-auth.firebaseapp.com",
  projectId: "axonflow-auth",
  storageBucket: "axonflow-auth.appspot.com", 
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 🔑 **Microsoft OAuth (Optional but recommended):**
- Application ID: `12345678-1234-1234-1234-123456789abc`
- Client Secret: `abc123~def456_ghi789`

## ⚡ **Quick Start Option:**

**Just send me the Firebase config and I can launch the platform immediately with Google authentication!** 

Microsoft OAuth can be added later. The platform will work perfectly with just Google sign-in.

## 🚀 **After You Send Config:**

1. **I'll update firebase-config.js** (30 seconds)
2. **Test authentication** (2 minutes)  
3. **Platform ready to launch!** (5 minutes total)

**Ready? Send me that Firebase config! 🎯**