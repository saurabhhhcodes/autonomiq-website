// Simple Authentication System
window.auth = {
    user: null,
    
    init() {
        this.checkAuthState();
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Google Sign In
        document.addEventListener('click', (e) => {
            if (e.target.closest('.google-signin')) {
                e.preventDefault();
                this.signInWithGoogle();
            }
        });
        
        // Microsoft Sign In  
        document.addEventListener('click', (e) => {
            if (e.target.closest('.microsoft-signin')) {
                e.preventDefault();
                this.signInWithMicrosoft();
            }
        });
    },
    
    async signInWithGoogle() {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            alert('Firebase not loaded. Please refresh the page.');
            return;
        }
        
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
            this.handleAuthSuccess(result.user);
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Sign-in failed. Please try again.');
        }
    },
    
    async signInWithMicrosoft() {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            alert('Firebase not loaded. Please refresh the page.');
            return;
        }
        
        try {
            const provider = new firebase.auth.OAuthProvider('microsoft.com');
            const result = await firebase.auth().signInWithPopup(provider);
            this.handleAuthSuccess(result.user);
        } catch (error) {
            console.error('Microsoft sign-in error:', error);
            alert('Sign-in failed. Please try again.');
        }
    },
    
    handleAuthSuccess(user) {
        this.user = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL,
            referralCode: 'AXN' + user.uid.substring(0, 6).toUpperCase()
        };
        
        localStorage.setItem('axonflow_user', JSON.stringify(this.user));
        this.updateUI();
        this.showWelcomeMessage();
    },
    
    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        
        if (this.user) {
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.innerHTML = `
                    <img src="${this.user.photo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2MzY2ZjEiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggOEMxMC4yMDkxIDggMTIgNi4yMDkxNCAxMiA0QzEyIDEuNzkwODYgMTAuMjA5MSAwIDggMEM1Ljc5MDg2IDAgNCAx'}"
                         alt="Profile" class="w-8 h-8 rounded-full">
                    <span class="text-sm font-medium text-white">${this.user.name}</span>
                    <button onclick="auth.signOut()" class="text-xs text-slate-400 hover:text-white ml-2">Sign Out</button>
                `;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    },
    
    showWelcomeMessage() {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
        toast.innerHTML = `
            <div class="flex items-center">
                <span class="text-xl mr-2">🎉</span>
                <div>
                    <p class="font-bold">Welcome ${this.user.name}!</p>
                    <p class="text-sm">Referral Code: ${this.user.referralCode}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    },
    
    async signOut() {
        try {
            if (firebase.auth) {
                await firebase.auth().signOut();
            }
            this.user = null;
            localStorage.removeItem('axonflow_user');
            this.updateUI();
            
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
            toast.textContent = 'Signed out successfully';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    },
    
    checkAuthState() {
        const userData = localStorage.getItem('axonflow_user');
        if (userData) {
            this.user = JSON.parse(userData);
            this.updateUI();
        }
        
        // Listen to Firebase auth state
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user && !this.user) {
                    this.handleAuthSuccess(user);
                }
            });
        }
    },
    
    isAuthenticated() {
        return !!this.user;
    },
    
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    },
    
    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
};

// Initialize auth system
document.addEventListener('DOMContentLoaded', () => {
    window.auth.init();
});