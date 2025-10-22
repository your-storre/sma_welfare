import { authService, ADMIN_CREDENTIALS } from './js/firebase.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check saved user on load
        this.checkAuthState();

        // Firebase auth state listener
        authService.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateUI();

            if (user) {
                console.log('User logged in:', user.email);
            } else {
                console.log('User logged out');
            }
        });
    }

    async login(email, password) {
        try {
            this.setLoading(true);
            const result = await authService.login(email, password);

            if (result.success) {
                this.showToast('✅ Login successful!', 'success');

                // Save user data
                localStorage.setItem('user', JSON.stringify({
                    email: result.user.email,
                    uid: result.user.uid,
                    name: result.user.displayName || 'Administrator'
                }));

                this.currentUser = result.user;
                this.updateUI();

                // ✅ Redirect after a brief delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

                return { success: true };
            } else {
                this.showToast(result.error, 'error');
                return { success: false, error: result.error };
            }
        } catch (error) {
            this.showToast('❌ Login failed. Please try again.', 'error');
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
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
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
        const userEmail = document.querySelector('.user-email');
        const userName = document.querySelector('.user-name');

        if (this.currentUser) {
            if (userEmail) userEmail.textContent = this.currentUser.email;
            if (userName) userName.textContent = this.currentUser.name || 'Administrator';
        }
    }

    // ✅ Force redirect functions (used manually if needed)
    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    redirectToLogin() {
        window.location.href = 'index.html';
    }

    setLoading(loading) {
        const btn = document.getElementById('login-btn');
        if (!btn) return;

        if (loading) {
            btn.disabled = true;
            btn.innerHTML = '<div class="spinner"></div> Logging in...';
        } else {
            btn.disabled = false;
            btn.innerHTML = '🔐 Login to System';
        }
    }

    showToast(message, type = 'success') {
        // Remove old toasts
        document.querySelectorAll('.toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    requireAuth() {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
}

const authManager = new AuthManager();
export default authManager;
