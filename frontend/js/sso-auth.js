// SSO Authentication System
class SSOAuth {
    constructor() {
        this.initializeFirebase();
        this.setupEventListeners();
    }

    initializeFirebase() {
        // Firebase config will be loaded from firebase-config.js
        if (typeof firebase !== 'undefined') {
            this.auth = firebase.auth();
            this.setupProviders();
        }
    }

    setupProviders() {
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
        this.googleProvider.addScope('email');
        this.googleProvider.addScope('profile');

        this.microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
        this.microsoftProvider.addScope('email');
        this.microsoftProvider.addScope('profile');
    }

    setupEventListeners() {
        // Google Sign In
        document.addEventListener('click', (e) => {
            if (e.target.matches('.google-signin, .google-signin *')) {
                e.preventDefault();
                this.signInWithGoogle();
            }
        });

        // Microsoft Sign In
        document.addEventListener('click', (e) => {
            if (e.target.matches('.microsoft-signin, .microsoft-signin *')) {
                e.preventDefault();
                this.signInWithMicrosoft();
            }
        });

        // Sign Out
        document.addEventListener('click', (e) => {
            if (e.target.matches('.sign-out, .sign-out *')) {
                e.preventDefault();
                this.signOut();
            }
        });
    }

    async signInWithGoogle() {
        try {
            this.showLoading('google');
            const result = await this.auth.signInWithPopup(this.googleProvider);
            await this.handleAuthSuccess(result.user, 'google');
        } catch (error) {
            this.handleAuthError(error, 'google');
        }
    }

    async signInWithMicrosoft() {
        try {
            this.showLoading('microsoft');
            const result = await this.auth.signInWithPopup(this.microsoftProvider);
            await this.handleAuthSuccess(result.user, 'microsoft');
        } catch (error) {
            this.handleAuthError(error, 'microsoft');
        }
    }

    async handleAuthSuccess(user, provider) {
        const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL,
            provider: provider,
            joinDate: new Date().toISOString()
        };

        // Store user data
        localStorage.setItem('axonflow_user', JSON.stringify(userData));
        
        // Send to backend
        try {
            await fetch(`${API_BASE_URL}/auth/sso-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } catch (error) {
            console.log('Backend sync failed, continuing with local auth');
        }

        this.updateUI(userData);
        this.hideLoading();
        
        // Redirect to dashboard or show success
        this.showSuccessMessage(`Welcome ${user.displayName}!`);
    }

    handleAuthError(error, provider) {
        this.hideLoading();
        let message = 'Sign in failed. Please try again.';
        
        if (error.code === 'auth/popup-closed-by-user') {
            message = 'Sign in was cancelled.';
        } else if (error.code === 'auth/popup-blocked') {
            message = 'Popup was blocked. Please allow popups and try again.';
        }
        
        this.showErrorMessage(message);
    }

    async signOut() {
        try {
            await this.auth.signOut();
            localStorage.removeItem('axonflow_user');
            this.updateUI(null);
            this.showSuccessMessage('Signed out successfully');
        } catch (error) {
            this.showErrorMessage('Sign out failed');
        }
    }

    updateUI(user) {
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        
        if (user) {
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.innerHTML = `
                    <img src="${user.photo || '/default-avatar.png'}" alt="Profile" class="w-8 h-8 rounded-full">
                    <span class="text-sm font-medium">${user.name}</span>
                    <button class="sign-out text-xs text-slate-400 hover:text-white ml-2">Sign Out</button>
                `;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    }

    showLoading(provider) {
        const button = document.querySelector(`.${provider}-signin`);
        if (button) {
            button.disabled = true;
            button.innerHTML = `
                <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
            `;
        }
    }

    hideLoading() {
        // Reset Google button
        const googleBtn = document.querySelector('.google-signin');
        if (googleBtn) {
            googleBtn.disabled = false;
            googleBtn.innerHTML = `
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            `;
        }

        // Reset Microsoft button
        const microsoftBtn = document.querySelector('.microsoft-signin');
        if (microsoftBtn) {
            microsoftBtn.disabled = false;
            microsoftBtn.innerHTML = `
                <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                Continue with Microsoft
            `;
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-medium ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Check if user is already signed in
    checkAuthState() {
        const userData = localStorage.getItem('axonflow_user');
        if (userData) {
            this.updateUI(JSON.parse(userData));
        }

        // Also listen to Firebase auth state
        if (this.auth) {
            this.auth.onAuthStateChanged((user) => {
                if (user && !localStorage.getItem('axonflow_user')) {
                    this.handleAuthSuccess(user, 'firebase');
                }
            });
        }
    }
}

// Initialize SSO Auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ssoAuth = new SSOAuth();
    window.ssoAuth.checkAuthState();
});