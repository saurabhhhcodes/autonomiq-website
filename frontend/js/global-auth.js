// Global Authentication System - Unified across all pages
class GlobalAuth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check for existing user session
        const savedUser = localStorage.getItem('axonflow_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateAllUI();
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('axonflow_user');
            }
        }
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for storage changes (cross-tab authentication)
        window.addEventListener('storage', (e) => {
            if (e.key === 'axonflow_user') {
                if (e.newValue) {
                    this.currentUser = JSON.parse(e.newValue);
                } else {
                    this.currentUser = null;
                }
                this.updateAllUI();
            }
        });

        // Auto-close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
            }
        });
    }

    // Authentication Methods
    async signInWithGoogle() {
        try {
            this.currentUser = {
                id: 'google_' + Date.now(),
                name: 'Demo User',
                email: 'demo@gmail.com',
                provider: 'google',
                avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4285f4&color=fff',
                verified: true,
                enrolledCourses: [],
                premiumAccess: true,
                createdAt: new Date().toISOString()
            };
            
            this.saveUser();
            this.closeAuthModal();
            this.showNotification('✅ Successfully signed in with Google!', 'success');
            return { success: true };
        } catch (error) {
            this.showNotification('❌ Google sign-in failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }

    async signInWithAzure() {
        try {
            this.currentUser = {
                id: 'azure_' + Date.now(),
                name: 'Azure User',
                email: 'user@company.com',
                provider: 'azure',
                avatar: 'https://ui-avatars.com/api/?name=Azure+User&background=0078d4&color=fff',
                verified: true,
                enrolledCourses: [],
                premiumAccess: true,
                createdAt: new Date().toISOString()
            };
            
            this.saveUser();
            this.closeAuthModal();
            this.showNotification('✅ Successfully signed in with Microsoft!', 'success');
            return { success: true };
        } catch (error) {
            this.showNotification('❌ Microsoft sign-in failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }

    async signInWithEmail(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (!this.isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            this.currentUser = {
                id: 'email_' + Date.now(),
                name: email.split('@')[0],
                email: email,
                provider: 'email',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=06b6d4&color=fff`,
                verified: true,
                enrolledCourses: [],
                premiumAccess: true,
                createdAt: new Date().toISOString()
            };
            
            this.saveUser();
            this.closeAuthModal();
            this.showNotification('✅ Successfully signed in!', 'success');
            return { success: true };
        } catch (error) {
            this.showNotification('❌ ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    async verifyEmailOTP(email, otp) {
        try {
            if (!email || !otp) {
                throw new Error('Email and OTP are required');
            }

            if (otp.length !== 6) {
                throw new Error('Please enter a valid 6-digit OTP');
            }

            // Accept any 6-digit OTP for demo
            if (!/^\d{6}$/.test(otp)) {
                throw new Error('OTP must be 6 digits');
            }

            this.currentUser = {
                id: 'email_otp_' + Date.now(),
                name: email.split('@')[0],
                email: email,
                provider: 'email_otp',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=10b981&color=fff`,
                verified: true,
                enrolledCourses: [],
                premiumAccess: true,
                createdAt: new Date().toISOString()
            };
            
            this.saveUser();
            this.closeAuthModal();
            this.showNotification('✅ Email verified successfully!', 'success');
            return { success: true };
        } catch (error) {
            this.showNotification('❌ ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    async verifyPhoneOTP(phone, otp) {
        try {
            if (!phone || !otp) {
                throw new Error('Phone number and OTP are required');
            }

            if (otp.length !== 6) {
                throw new Error('Please enter a valid 6-digit OTP');
            }

            // Accept any 6-digit OTP for demo
            if (!/^\d{6}$/.test(otp)) {
                throw new Error('OTP must be 6 digits');
            }

            this.currentUser = {
                id: 'phone_otp_' + Date.now(),
                name: `User ${phone.slice(-4)}`,
                phone: phone,
                provider: 'phone_otp',
                avatar: `https://ui-avatars.com/api/?name=User+${phone.slice(-4)}&background=8b5cf6&color=fff`,
                verified: true,
                enrolledCourses: [],
                premiumAccess: true,
                createdAt: new Date().toISOString()
            };
            
            this.saveUser();
            this.closeAuthModal();
            this.showNotification('✅ Phone verified successfully!', 'success');
            return { success: true };
        } catch (error) {
            this.showNotification('❌ ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    signOut() {
        this.currentUser = null;
        localStorage.removeItem('axonflow_user');
        this.updateAllUI();
        this.showNotification('👋 Successfully signed out!', 'info');
        
        // Redirect to home if on protected page
        if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('profile')) {
            window.location.href = 'index.html';
        }
    }

    // User Management
    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateAllUI();
        }
    }

    isAuthenticated() {
        return this.currentUser !== null && this.currentUser.verified === true;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            this.showAuthModal();
            return false;
        }
        return true;
    }

    // UI Management
    updateAllUI() {
        this.updateNavigation();
        this.updateAuthButtons();
        this.updateUserProfile();
    }

    updateNavigation() {
        const userInfo = document.getElementById('user-info');
        const authButtons = document.getElementById('auth-buttons');
        
        if (this.currentUser) {
            if (userInfo) {
                userInfo.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <img src="${this.currentUser.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
                        <div class="hidden md:block">
                            <p class="text-white text-sm font-medium">${this.currentUser.name}</p>
                            <p class="text-gray-400 text-xs">${this.currentUser.email || this.currentUser.phone || 'Verified User'}</p>
                        </div>
                        <div class="relative">
                            <button onclick="globalAuth.toggleUserMenu()" class="text-gray-400 hover:text-white">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                            <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                                <a href="academy.html" class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-t-lg">My Courses</a>
                                <button onclick="globalAuth.showAITeacher()" class="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">🤖 AI Teacher</button>
                                <div class="border-t border-gray-700"></div>
                                <button onclick="globalAuth.signOut()" class="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg">Sign Out</button>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (authButtons) {
                authButtons.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <img src="${this.currentUser.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
                        <div class="hidden md:block">
                            <p class="text-white text-sm font-medium">${this.currentUser.name}</p>
                            <p class="text-gray-400 text-xs">${this.currentUser.email || this.currentUser.phone || 'Verified User'}</p>
                        </div>
                        <button onclick="globalAuth.signOut()" class="text-red-400 hover:text-red-300 text-sm">Sign Out</button>
                    </div>
                `;
            }
        } else {
            if (userInfo) {
                userInfo.innerHTML = `
                    <button onclick="globalAuth.showAuthModal()" class="bg-cyan-400 text-black font-bold py-2 px-4 rounded-xl hover:bg-cyan-300 transition-all">
                        Sign In
                    </button>
                `;
            }
            
            if (authButtons) {
                authButtons.innerHTML = `
                    <button onclick="globalAuth.showAuthModal()" class="bg-cyan-400 text-black font-bold py-2 px-4 rounded-xl hover:bg-cyan-300 transition-all">
                        Sign In
                    </button>
                `;
            }
        }
    }

    updateAuthButtons() {
        const buttons = document.querySelectorAll('[onclick*="showAuthModal"]');
        buttons.forEach(button => {
            if (this.currentUser) {
                button.textContent = 'My Dashboard';
                button.onclick = () => window.location.href = 'academy.html';
            } else {
                button.textContent = 'Sign In';
                button.onclick = () => this.showAuthModal();
            }
        });
    }

    updateUserProfile() {
        const profileElements = document.querySelectorAll('.user-profile');
        profileElements.forEach(element => {
            if (this.currentUser) {
                element.classList.remove('hidden');
                element.innerHTML = `
                    <img src="${this.currentUser.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
                    <span class="text-white">${this.currentUser.name}</span>
                `;
            } else {
                element.classList.add('hidden');
            }
        });
    }

    // Modal Management
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Reset forms
            this.resetAuthForms();
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.resetAuthForms();
        }
    }

    resetAuthForms() {
        // Reset all auth forms to default state
        const forms = ['email-auth-form', 'email-otp-form', 'phone-otp-form'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                if (formId === 'email-auth-form') {
                    form.classList.remove('hidden');
                } else {
                    form.classList.add('hidden');
                }
                form.reset();
            }
        });

        // Reset OTP inputs
        const otpInputs = document.querySelectorAll('[id$="-otp-input"]');
        otpInputs.forEach(input => input.classList.add('hidden'));
    }

    toggleUserMenu() {
        const menu = document.getElementById('user-menu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    }

    // AI Teacher Integration
    showAITeacher() {
        if (!this.requireAuth()) return;
        
        if (window.enhancedAI) {
            window.enhancedAI.show();
        } else if (window.showAITeacher) {
            window.showAITeacher();
        } else {
            this.showNotification('🤖 AI Teacher is loading... Please wait a moment.', 'info');
            // Try to load AI Teacher after a delay
            setTimeout(() => {
                if (window.enhancedAI) {
                    window.enhancedAI.show();
                } else {
                    this.showNotification('❌ AI Teacher is not available on this page. Please visit the Academy page.', 'error');
                }
            }, 2000);
        }
    }

    // Course Enrollment
    enrollInCourse(courseId, courseName, price) {
        if (!this.requireAuth()) return false;

        if (!this.currentUser.enrolledCourses) {
            this.currentUser.enrolledCourses = [];
        }

        const alreadyEnrolled = this.currentUser.enrolledCourses.find(course => course.id === courseId);
        if (alreadyEnrolled) {
            this.showNotification('ℹ️ You are already enrolled in this course!', 'info');
            return false;
        }

        this.currentUser.enrolledCourses.push({
            id: courseId,
            name: courseName,
            price: price,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            status: 'active'
        });

        this.saveUser();
        this.showNotification(`✅ Successfully enrolled in ${courseName}!`, 'success');
        return true;
    }

    // Utility Functions
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[\d\s\-\(\)]{10,}$/.test(phone);
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-start space-x-2">
                <span class="flex-shrink-0">${message.split(' ')[0]}</span>
                <div class="flex-1">
                    <p class="text-sm">${message.substring(message.indexOf(' ') + 1)}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200 ml-2">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize global authentication
const globalAuth = new GlobalAuth();

// Make it available globally
window.globalAuth = globalAuth;

// Backward compatibility
window.auth = globalAuth;
window.showAuthModal = () => globalAuth.showAuthModal();
window.closeAuthModal = () => globalAuth.closeAuthModal();
window.signInWithGoogle = () => globalAuth.signInWithGoogle();
window.signInWithAzure = () => globalAuth.signInWithAzure();
window.signOut = () => globalAuth.signOut();

// Close user menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('user-menu');
    const button = event.target.closest('button[onclick*="toggleUserMenu"]');
    
    if (menu && !menu.contains(event.target) && !button) {
        menu.classList.add('hidden');
    }
});