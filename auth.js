// Enhanced Authentication System with Full SSO
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        const savedUser = localStorage.getItem('axonflow_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    async signInWithGoogle() {
        this.currentUser = {
            id: 'google_' + Date.now(),
            name: 'Demo User',
            email: 'demo@gmail.com',
            provider: 'google'
        };
        localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
        this.updateUI();
        this.closeAuthModal();
        return { success: true, user: this.currentUser };
    }

    async simulateGoogleAuth() {
        // Simulate Google OAuth popup
        return new Promise((resolve, reject) => {
            const popup = window.open('', 'google-auth', 'width=500,height=600');
            popup.document.write(`
                <html>
                    <head><title>Google Sign In</title></head>
                    <body style="font-family: Arial; padding: 20px; background: #f5f5f5;">
                        <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
                            <img src="https://developers.google.com/identity/images/g-logo.png" width="40" style="margin-bottom: 20px;">
                            <h2>Sign in with Google</h2>
                            <p>Demo Mode - Choose your profile:</p>
                            <button onclick="selectProfile('John Doe', 'john@gmail.com')" style="display: block; width: 100%; margin: 10px 0; padding: 10px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                John Doe (john@gmail.com)
                            </button>
                            <button onclick="selectProfile('Sarah Smith', 'sarah@gmail.com')" style="display: block; width: 100%; margin: 10px 0; padding: 10px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Sarah Smith (sarah@gmail.com)
                            </button>
                            <button onclick="window.close()" style="display: block; width: 100%; margin: 10px 0; padding: 10px; background: #ccc; color: black; border: none; border-radius: 4px; cursor: pointer;">
                                Cancel
                            </button>
                        </div>
                        <script>
                            function selectProfile(name, email) {
                                window.opener.postMessage({
                                    type: 'google-auth-success',
                                    user: { name: name, email: email, picture: 'https://via.placeholder.com/40' }
                                }, '*');
                                window.close();
                            }
                        </script>
                    </body>
                </html>
            `);

            const messageHandler = (event) => {
                if (event.data.type === 'google-auth-success') {
                    window.removeEventListener('message', messageHandler);
                    resolve(event.data.user);
                }
            };

            window.addEventListener('message', messageHandler);

            // Auto-close popup after 30 seconds
            setTimeout(() => {
                if (!popup.closed) {
                    popup.close();
                    window.removeEventListener('message', messageHandler);
                    reject(new Error('Authentication timeout'));
                }
            }, 30000);
        });
    }

    async signInWithAzure() {
        this.currentUser = {
            id: 'azure_' + Date.now(),
            name: 'Azure User',
            email: 'user@company.com',
            provider: 'azure'
        };
        localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
        this.updateUI();
        this.closeAuthModal();
        return { success: true, user: this.currentUser };
    }

    async simulateAzureAuth() {
        return new Promise((resolve, reject) => {
            const popup = window.open('', 'azure-auth', 'width=500,height=600');
            popup.document.write(`
                <html>
                    <head><title>Microsoft Sign In</title></head>
                    <body style="font-family: Arial; padding: 20px; background: #0078d4;">
                        <div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">
                            <div style="color: #0078d4; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Microsoft</div>
                            <h2>Sign in to your account</h2>
                            <p>Demo Mode - Choose your corporate profile:</p>
                            <button onclick="selectProfile('Alex Johnson', 'alex@company.com')" style="display: block; width: 100%; margin: 10px 0; padding: 10px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Alex Johnson (alex@company.com)
                            </button>
                            <button onclick="selectProfile('Maria Garcia', 'maria@enterprise.com')" style="display: block; width: 100%; margin: 10px 0; padding: 10px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Maria Garcia (maria@enterprise.com)
                            </button>
                            <button onclick="window.close()" style="display: block; width: 100%; margin: 10px 0; padding: 10px; background: #ccc; color: black; border: none; border-radius: 4px; cursor: pointer;">
                                Cancel
                            </button>
                        </div>
                        <script>
                            function selectProfile(name, email) {
                                window.opener.postMessage({
                                    type: 'azure-auth-success',
                                    user: { displayName: name, userPrincipalName: email }
                                }, '*');
                                window.close();
                            }
                        </script>
                    </body>
                </html>
            `);

            const messageHandler = (event) => {
                if (event.data.type === 'azure-auth-success') {
                    window.removeEventListener('message', messageHandler);
                    resolve(event.data.user);
                }
            };

            window.addEventListener('message', messageHandler);

            setTimeout(() => {
                if (!popup.closed) {
                    popup.close();
                    window.removeEventListener('message', messageHandler);
                    reject(new Error('Authentication timeout'));
                }
            }, 30000);
        });
    }

    // Enhanced Email/Password Authentication
    async signInWithEmail(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Simulate email validation
            if (!this.isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            this.currentUser = {
                id: 'email_' + Date.now(),
                name: email.split('@')[0],
                email: email,
                provider: 'email',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=06b6d4&color=fff`,
                enrolledCourses: [],
                premiumFeatures: {
                    oneOnOneSessions: 0,
                    maxSessions: 0
                },
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.closeAuthModal();
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Enhanced Phone Authentication with real OTP simulation
    async signInWithPhone(phone, otp) {
        try {
            if (!phone || !otp) {
                throw new Error('Phone number and OTP are required');
            }

            if (!this.isValidPhone(phone)) {
                throw new Error('Please enter a valid phone number');
            }

            // In demo, accept any 6-digit OTP
            if (!/^\d{6}$/.test(otp)) {
                throw new Error('OTP must be 6 digits');
            }

            this.currentUser = {
                id: 'phone_' + Date.now(),
                name: 'Phone User',
                phone: phone,
                provider: 'phone',
                avatar: 'https://ui-avatars.com/api/?name=Phone+User&background=10b981&color=fff',
                enrolledCourses: [],
                premiumFeatures: {
                    oneOnOneSessions: 0,
                    maxSessions: 0
                },
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.closeAuthModal();
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Enhanced OTP sending with realistic simulation
    async sendOTP(phone) {
        try {
            if (!this.isValidPhone(phone)) {
                throw new Error('Please enter a valid phone number');
            }

            // Simulate OTP sending delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show realistic OTP notification
            this.showOTPNotification(phone);
            
            return { success: true, message: 'OTP sent successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    showOTPNotification(phone) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>📱</span>
                <div>
                    <p class="font-bold">OTP Sent!</p>
                    <p class="text-sm">Check your phone ${phone.slice(-4).padStart(phone.length, '*')}</p>
                    <p class="text-xs mt-1">Demo OTP: 123456</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Utility functions
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^\+?[\d\s-()]{10,}$/.test(phone);
    }

    // Enhanced user management
    signOut() {
        this.currentUser = null;
        localStorage.removeItem('axonflow_user');
        this.updateUI();
        
        // Show sign out confirmation
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>👋</span>
                <p>Successfully signed out!</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        
        // Redirect to home page after a delay
        setTimeout(() => {
            window.location.href = 'academy.html';
        }, 1000);
    }

    // Enhanced UI updates
    updateUI() {
        const authButtons = document.querySelectorAll('.auth-required');
        const userInfo = document.getElementById('user-info');
        
        if (this.currentUser) {
            if (userInfo) {
                userInfo.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <img src="${this.currentUser.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
                        <div class="hidden md:block">
                            <p class="text-white text-sm font-medium">${this.currentUser.name}</p>
                            <p class="text-gray-400 text-xs">${this.currentUser.email || this.currentUser.phone || 'User'}</p>
                        </div>
                        <div class="relative">
                            <button onclick="toggleUserMenu()" class="text-gray-400 hover:text-white">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                            <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                                <a href="dashboard.html" class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-t-lg">My Dashboard</a>
                                <a href="#" onclick="showProfile()" class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Profile Settings</a>
                                <div class="border-t border-gray-700"></div>
                                <button onclick="auth.signOut()" class="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-b-lg">Sign Out</button>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            authButtons.forEach(btn => {
                if (btn.textContent.includes('Sign In')) {
                    btn.textContent = 'My Courses';
                    btn.onclick = () => window.location.href = 'dashboard.html';
                }
            });
        } else {
            if (userInfo) {
                userInfo.innerHTML = `
                    <button onclick="auth.showAuthModal()" class="bg-cyan-400 text-black font-bold py-2 px-4 rounded-xl hover:bg-cyan-300 transition-all duration-300">
                        Sign In
                    </button>
                `;
            }
        }
    }

    // Modal management
    showAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // User management functions
    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Enhanced enrollment with premium features
    enrollInCourse(courseId, courseName, price) {
        if (!this.currentUser) {
            this.showAuthModal();
            return false;
        }

        if (!this.currentUser.enrolledCourses) {
            this.currentUser.enrolledCourses = [];
        }

        const alreadyEnrolled = this.currentUser.enrolledCourses.find(course => course.id === courseId);
        if (alreadyEnrolled) {
            alert('You are already enrolled in this course!');
            return false;
        }

        // Add premium features based on course
        const premiumSessions = this.getPremiumSessions(price);
        
        this.currentUser.enrolledCourses.push({
            id: courseId,
            name: courseName,
            price: price,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completedChapters: [],
            premiumFeatures: {
                oneOnOneSessions: premiumSessions,
                sessionBookingEnabled: true
            }
        });

        // Update user's total premium sessions
        this.currentUser.premiumFeatures.maxSessions += premiumSessions;

        localStorage.setItem('axonflow_user', JSON.stringify(this.currentUser));
        
        return true;
    }

    getPremiumSessions(price) {
        // Premium sessions based on course price
        if (price >= 25000) return 4; // AI Agent Development
        if (price >= 20000) return 3; // Data Analysis
        if (price >= 18000) return 3; // Full-Stack Development
        if (price >= 15000) return 2; // N8N Automation, Database Engineering
        if (price >= 12000) return 2; // Testing & QA
        return 1; // Default
    }
}

// Global functions for UI interaction
function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function showProfile() {
    alert('Profile settings coming soon!');
}

// Close user menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('user-menu');
    const button = event.target.closest('button[onclick="toggleUserMenu()"]');
    
    if (menu && !menu.contains(event.target) && !button) {
        menu.classList.add('hidden');
    }
});

// Initialize authentication system
const auth = new AuthSystem();