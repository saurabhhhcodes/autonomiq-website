// Firebase Authentication Integration
// Use global firebaseConfig from firebase-config.js

// Client IDs for SSO (public, safe to expose)
const SSO_CONFIG = {
  google: {
    clientId: '346992451501-q9u01l8t7jk4d6bm53rsiigb0i160c4d.apps.googleusercontent.com'
  },
  microsoft: {
    clientId: '992d2bac-329d-4a05-a4ad-ed07f7fc06c2'
  }
};

// Initialize Firebase
let firebaseApp, firebaseAuth;

// Load Firebase SDK
function initFirebase() {
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
    
    const script2 = document.createElement('script');
    script2.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js';
    
    script1.onload = () => {
        script2.onload = () => {
            if (typeof firebaseConfig !== 'undefined') {
                firebaseApp = firebase.initializeApp(firebaseConfig);
                firebaseAuth = firebase.auth();
                console.log('Firebase initialized');
            } else {
                console.warn('Firebase config not found');
            }
        };
        document.head.appendChild(script2);
    };
    document.head.appendChild(script1);
}

// Firebase Auth Helper
class FirebaseAuthHelper {
    // Real Email Authentication
    static async signInWithEmail(email, password) {
        try {
            const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
            return {
                success: true,
                user: {
                    id: 'firebase_' + userCredential.user.uid,
                    name: userCredential.user.displayName || email.split('@')[0],
                    email: userCredential.user.email,
                    provider: 'firebase',
                    avatar: userCredential.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=06b6d4&color=fff`,
                    emailVerified: userCredential.user.emailVerified
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create Account with Email
    static async createAccount(email, password) {
        try {
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            
            // Send verification email
            await userCredential.user.sendEmailVerification();
            
            return {
                success: true,
                user: {
                    id: 'firebase_' + userCredential.user.uid,
                    name: email.split('@')[0],
                    email: userCredential.user.email,
                    provider: 'firebase',
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=06b6d4&color=fff`,
                    emailVerified: false
                },
                message: 'Account created! Check your email for verification.'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Real Phone Authentication
    static async sendOTP(phoneNumber) {
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => {
                        console.log('reCAPTCHA solved');
                    }
                });
            }

            const confirmationResult = await firebaseAuth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
            window.confirmationResult = confirmationResult;
            
            return {
                success: true,
                message: 'Real OTP sent to your phone',
                verificationId: confirmationResult.verificationId
            };
        } catch (error) {
            // Handle billing error specifically
            if (error.code === 'auth/billing-not-enabled') {
                throw new Error('Phone authentication requires Firebase Blaze plan. Please upgrade your Firebase project.');
            }
            return { success: false, error: error.message };
        }
    }

    static async verifyOTP(otp) {
        try {
            if (!window.confirmationResult) {
                throw new Error('No OTP request found');
            }

            const result = await window.confirmationResult.confirm(otp);
            
            return {
                success: true,
                user: {
                    id: 'firebase_' + result.user.uid,
                    name: 'Phone User',
                    phone: result.user.phoneNumber,
                    provider: 'firebase-phone',
                    avatar: 'https://ui-avatars.com/api/?name=Phone+User&background=10b981&color=fff'
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Password Reset
    static async resetPassword(email) {
        try {
            await firebaseAuth.sendPasswordResetEmail(email);
            return { success: true, message: 'Password reset email sent' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Sign Out
    static async signOut() {
        try {
            await firebaseAuth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize Firebase on load
initFirebase();