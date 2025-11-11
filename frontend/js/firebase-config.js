// Firebase Configuration for AxonFlow
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "axonflow-auth.firebaseapp.com",
    projectId: "axonflow-auth",
    storageBucket: "axonflow-auth.appspot.com",
    messagingSenderId: "346992451501",
    appId: "1:346992451501:web:XXXXXXXXXXXXXXXX"
};

// Microsoft Azure AD Configuration
const azureConfig = {
    clientId: "992d2bac-329d-4a05-a4ad-ed07f7fc06c2",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://axonflow.in/dashboard.html",
    scopes: ["openid", "profile", "email"]
};

// Google OAuth Configuration  
const googleConfig = {
    clientId: "346992451501-q9u01l8t7jk4d6bm53rsiigb0i160c4d.apps.googleusercontent.com",
    redirectUri: "https://axonflow.in/dashboard.html",
    scope: "openid profile email"
};

export { firebaseConfig, azureConfig, googleConfig };