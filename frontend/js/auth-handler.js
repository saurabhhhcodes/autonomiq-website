// Unified Authentication Handler for AxonFlow
let currentUser = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('axonflow_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI();
    }
});

// Google SSO
async function signInWithGoogle() {
    try {
        const result = await FirebaseAuthHelper.signInWithGoogle();
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('axonflow_user', JSON.stringify(currentUser));
            updateUI();
            closeAuthModal();
            showNotification('✅ Successfully signed in with Google!', 'success');
        } else {
            showNotification('❌ ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('❌ Google sign-in failed: ' + error.message, 'error');
    }
}

// Microsoft SSO
async function signInWithAzure() {
    try {
        const result = await FirebaseAuthHelper.signInWithMicrosoft();
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('axonflow_user', JSON.stringify(currentUser));
            updateUI();
            closeAuthModal();
            showNotification('✅ Successfully signed in with Microsoft!', 'success');
        } else {
            showNotification('❌ ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('❌ Microsoft sign-in failed: ' + error.message, 'error');
    }
}

// Firebase Email Authentication
async function signInWithEmail(email, password) {
    try {
        const result = await FirebaseAuthHelper.signInWithEmail(email, password);
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('axonflow_user', JSON.stringify(currentUser));
            updateUI();
            closeAuthModal();
            showNotification('✅ Successfully signed in!', 'success');
        } else {
            showNotification('❌ ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('❌ Email sign-in failed: ' + error.message, 'error');
    }
}

// Sign Out
function signOut() {
    FirebaseAuthHelper.signOut();
    currentUser = null;
    localStorage.removeItem('axonflow_user');
    updateUI();
    showNotification('👋 Successfully signed out!', 'info');
}

// Update UI
function updateUI() {
    const userInfo = document.getElementById('user-info') || document.getElementById('auth-buttons');
    if (!userInfo) return;
    
    if (currentUser) {
        userInfo.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${currentUser.avatar}" alt="Avatar" class="w-8 h-8 rounded-full">
                <div class="hidden md:block">
                    <p class="text-white text-sm font-medium">${currentUser.name}</p>
                    <p class="text-gray-400 text-xs">${currentUser.email || currentUser.phone || ''}</p>
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
}

// Modal Controls
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
}

// Notification System
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}
