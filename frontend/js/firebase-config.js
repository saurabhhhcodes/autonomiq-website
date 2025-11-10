// Firebase Configuration - PRODUCTION READY
const firebaseConfig = {
    apiKey: "AIzaSyD10WdBkvyLYTSp30wfD5ACJ-pu24LjWjU",
    authDomain: "axonflow-auth.firebaseapp.com",
    projectId: "axonflow-auth",
    storageBucket: "axonflow-auth.firebasestorage.app",
    messagingSenderId: "277021265161",
    appId: "1:277021265161:web:dc351877acb855fa3c97d8",
    measurementId: "G-Q99RG63QJB"
};

// Initialize Firebase (only if not already initialized)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    
    // Enable persistence for offline support
    if (firebase.auth) {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    }
}

// Export config for use in other files
window.firebaseConfig = firebaseConfig;