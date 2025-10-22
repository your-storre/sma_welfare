import { authService, ADMIN_CREDENTIALS } from './js/firebase.js';

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
            this.setLoading(true);
            const result = await authService.login(email, password);
            
            if (result.success) {
                this.showToast('Login successful!', 'success');
                
                // Save user locally
                localStorage.setItem('user', JSON.stringify({
                    email: result.user.email,
                    uid: result.user.uid,
                    name: result.user.displayName || 'Administrator'
                }));
                
                this.currentUser = result.user;
                this.updateUI();

                // ✅ Redirect directly after success
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);

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

    // ✅ Simplified redirect logic
    redirectToDashboard() {
        if (!window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'dashboard.html';
        }
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }

    // ... (rest of your methods stay exactly the same)
}

// Initialize auth manager
const authManager = new AuthManager();
export default authManager;
