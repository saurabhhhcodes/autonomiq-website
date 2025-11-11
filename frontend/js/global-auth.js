// Global Authentication System for AxonFlow
// Handles Google SSO, Microsoft SSO, Firebase Email, and Firebase Phone OTP

const globalAuth = {
    currentUser: null,
    firebaseApp: null,
    firebaseAuth: null,

    init() {
        // Initialize Firebase
        if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
            try {
                this.firebaseApp = firebase.initializeApp(firebaseConfig);
                this.firebaseAuth = firebase.auth();
                console.log('Firebase initialized');
            } catch (error) {
                console.error('Firebase init error:', error);
            }
        }

        // Check saved user
        const savedUser = localStorage.getItem('axonflow_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    },

    // Google SSO
    async signInWithGoogle() {
        try {
            if (!this.firebaseAuth) {
                this.showNotification('❌ Firebase not initialized. Please refresh the page.', 'error');
                return;
            }
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await this.firebaseAuth.signInWithPopup(provider);
            this.currentUser = {
                id: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                provider: 'google',
                avatar: result.user.photoURL
            };
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.closeAuthModal();
            this.showNotification('✅ Successfully signed in with Google!', 'success');
        } catch (error) {
            console.error('Google SSO Error:', error);
            this.showNotification('❌ Google sign-in failed: ' + error.message, 'error');
        }
    },

    // Microsoft SSO
    async signInWithAzure() {
        try {
            if (!this.firebaseAuth) {
                this.showNotification('❌ Firebase not initialized. Please refresh the page.', 'error');
                return;
            }
            const provider = new firebase.auth.OAuthProvider('microsoft.com');
            const result = await this.firebaseAuth.signInWithPopup(provider);
            this.currentUser = {
                id: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                provider: 'microsoft',
                avatar: result.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.displayName)}&background=0078d4&color=fff`
            };
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.closeAuthModal();
            this.showNotification('✅ Successfully signed in with Microsoft!', 'success');
        } catch (error) {
            console.error('Microsoft SSO Error:', error);
            this.showNotification('❌ Microsoft sign-in failed: ' + error.message, 'error');
        }
    },

    // Firebase Email Authentication
    async signInWithEmail(email, password) {
        try {
            const userCredential = await this.firebaseAuth.signInWithEmailAndPassword(email, password);
            this.currentUser = {
                id: userCredential.user.uid,
                name: userCredential.user.displayName || email.split('@')[0],
                email: userCredential.user.email,
                provider: 'email',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=06b6d4&color=fff`
            };
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.closeAuthModal();
            this.showNotification('✅ Successfully signed in!', 'success');
        } catch (error) {
            this.showNotification('❌ ' + error.message, 'error');
        }
    },

    // Email OTP Verification (Demo)
    verifyEmailOTP(email, otp) {
        if (otp === '123456') {
            this.currentUser = {
                id: 'email_otp_' + Date.now(),
                name: email.split('@')[0],
                email: email,
                provider: 'email-otp',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=10b981&color=fff`
            };
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.closeAuthModal();
            this.showNotification('✅ Email verified successfully!', 'success');
        } else {
            this.showNotification('❌ Invalid OTP. Try 123456', 'error');
        }
    },

    // Phone OTP Verification (Demo)
    verifyPhoneOTP(phone, otp) {
        if (otp === '123456') {
            this.currentUser = {
                id: 'phone_otp_' + Date.now(),
                name: phone,
                phone: phone,
                provider: 'phone-otp',
                avatar: 'https://ui-avatars.com/api/?name=Phone+User&background=a855f7&color=fff'
            };
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.closeAuthModal();
            this.showNotification('✅ Phone verified successfully!', 'success');
        } else {
            this.showNotification('❌ Invalid OTP. Try 123456', 'error');
        }
    },

    // Sign Out
    signOut() {
        if (this.firebaseAuth) {
            this.firebaseAuth.signOut();
        }
        this.currentUser = null;
        localStorage.removeItem('axonflow_user');
        this.updateUI();
        this.showNotification('👋 Successfully signed out!', 'info');
    },

    // Update UI
    updateUI() {
        const userInfo = document.getElementById('user-info') || document.getElementById('auth-buttons');
        if (!userInfo) return;

        if (this.currentUser) {
            userInfo.innerHTML = `
                <div class="flex items-center space-x-3">
                    <img src="${this.currentUser.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
                    <div class="hidden md:block">
                        <p class="text-white text-sm font-medium">${this.currentUser.name}</p>
                        <p class="text-gray-400 text-xs">${this.currentUser.email || this.currentUser.phone || ''}</p>
                    </div>
                    <button onclick="signOut()" class="text-red-400 hover:text-red-300 text-sm">Sign Out</button>
                </div>
            `;
        } else {
            userInfo.innerHTML = `
                <button onclick="showAuthModal()" class="bg-cyan-400 text-black font-bold py-2 px-4 rounded-xl hover:bg-cyan-300 transition-all">
                    Sign In
                </button>
            `;
        }
    },

    // Modal Controls
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        this.resetAuthForms();
    },

    resetAuthForms() {
        document.getElementById('email-auth-form').classList.remove('hidden');
        document.getElementById('email-otp-form').classList.add('hidden');
        document.getElementById('phone-otp-form').classList.add('hidden');
    },

    // Notification System
    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50 max-w-md`;
        notification.innerHTML = `
            <div class="flex items-start space-x-2">
                <span class="whitespace-pre-line">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200 flex-shrink-0">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    },

    // Utility
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    toggleUserMenu() {
        const menu = document.getElementById('user-menu');
        if (menu) menu.classList.toggle('hidden');
    },

    requireAuth() {
        if (!this.currentUser) {
            this.showAuthModal();
            return false;
        }
        return true;
    },

    enrollInCourse(courseId, courseName, price) {
        if (!this.requireAuth()) return;
        window.userStorage.addEnrolledCourse(courseId, {name: courseName, price: price});
        this.showNotification(`✅ Enrolled in ${courseName}! Go to My Courses to start learning.`, 'success');
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => globalAuth.init());
