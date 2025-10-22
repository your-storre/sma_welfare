import { authService, ADMIN_CREDENTIALS } from './firebase.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check for existing authentication
        this.checkAuthState();
        
        // Set up auth state listener
        authService.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateUI();
            
            if (user) {
                console.log('User logged in:', user.email);
                this.redirectToDashboard();
            } else {
                console.log('User logged out');
                this.redirectToLogin();
            }
        });
    }

    async login(email, password) {
        try {
            // Show loading state
            this.setLoading(true);
            
            const result = await authService.login(email, password);
            
            if (result.success) {
                this.showToast('Login successful!', 'success');
                localStorage.setItem('user', JSON.stringify({
                    email: result.user.email,
                    uid: result.user.uid,
                    name: result.user.displayName || 'Administrator'
                }));
                this.currentUser = result.user;
                this.updateUI();
                return { success: true };
            } else {
                this.showToast(result.error, 'error');
                return { success: false, error: result.error };
            }
        } catch (error) {
            this.showToast('Login failed. Please try again.', 'error');
            return { success: false, error: error.message };
        } finally {
            this.setLoading(false);
        }
    }

    async logout() {
        try {
            const result = await authService.logout();
            if (result.success) {
                localStorage.removeItem('user');
                this.currentUser = null;
                this.showToast('Logged out successfully', 'success');
                this.redirectToLogin();
            }
        } catch (error) {
            this.showToast('Logout failed', 'error');
        }
    }

    checkAuthState() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    updateUI() {
        const userElements = document.querySelectorAll('.user-info, .user-email, .user-name');
        const loginElements = document.querySelectorAll('.login-required');
        const logoutElements = document.querySelectorAll('.logout-required');

        if (this.currentUser) {
            userElements.forEach(el => {
                if (el.classList.contains('user-email')) {
                    el.textContent = this.currentUser.email;
                } else if (el.classList.contains('user-name')) {
                    el.textContent = this.currentUser.name || this.currentUser.email.split('@')[0];
                }
            });
            
            loginElements.forEach(el => el.style.display = 'none');
            logoutElements.forEach(el => el.style.display = 'block');
        } else {
            loginElements.forEach(el => el.style.display = 'block');
            logoutElements.forEach(el => el.style.display = 'none');
        }
    }

    redirectToDashboard() {
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/' || 
            window.location.pathname.endsWith('/')) {
            window.location.href = 'dashboard.html';
        }
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('index.html') && 
            window.location.pathname !== '/' && 
            !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
        }
    }

    setLoading(loading) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (loading) {
                btn.classList.add('loading');
                btn.disabled = true;
                if (btn.type === 'submit') {
                    btn.innerHTML = '<div class="spinner"></div> Loading...';
                }
            } else {
                btn.classList.remove('loading');
                btn.disabled = false;
                if (btn.type === 'submit' && btn.id === 'login-btn') {
                    btn.innerHTML = '🔐 Login to System';
                }
            }
        });
    }

    showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other files
export default authManager;