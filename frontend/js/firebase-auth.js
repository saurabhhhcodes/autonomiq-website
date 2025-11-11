// Firebase Authentication Integration
let firebaseApp, firebaseAuth;

// Initialize Firebase when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        try {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            firebaseAuth = firebase.auth();
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    }
});

// Firebase Auth Helper
class FirebaseAuthHelper {
    // Google SSO
    static async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebaseAuth.signInWithPopup(provider);
            return {
                success: true,
                user: {
                    id: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    provider: 'google',
                    avatar: result.user.photoURL
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Microsoft SSO
    static async signInWithMicrosoft() {
        try {
            const provider = new firebase.auth.OAuthProvider('microsoft.com');
            const result = await firebaseAuth.signInWithPopup(provider);
            return {
                success: true,
                user: {
                    id: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    provider: 'microsoft',
                    avatar: result.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.displayName)}&background=0078d4&color=fff`
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Firebase Email Authentication
    static async signInWithEmail(email, password) {
        try {
            const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
            return {
                success: true,
                user: {
                    id: userCredential.user.uid,
                    name: userCredential.user.displayName || email.split('@')[0],
                    email: userCredential.user.email,
                    provider: 'email',
                    avatar: userCredential.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=06b6d4&color=fff`
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

    // Firebase Phone OTP
    static async sendOTP(phoneNumber) {
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible'
                });
            }
            const confirmationResult = await firebaseAuth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
            window.confirmationResult = confirmationResult;
            return { success: true, message: 'OTP sent to your phone' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async verifyOTP(otp) {
        try {
            if (!window.confirmationResult) {
                return { success: false, error: 'No OTP request found' };
            }
            const result = await window.confirmationResult.confirm(otp);
            return {
                success: true,
                user: {
                    id: result.user.uid,
                    name: result.user.phoneNumber,
                    phone: result.user.phoneNumber,
                    provider: 'phone',
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