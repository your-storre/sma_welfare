// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWxFyiUQlNw7otVxGJ1kOo6DZdq72inAE",
    authDomain: "sms-wellfare-project.firebaseapp.com",
    databaseURL: "https://sms-wellfare-project-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sms-wellfare-project",
    storageBucket: "sms-wellfare-project.firebasestorage.app",
    messagingSenderId: "114728952953",
    appId: "1:114728952953:web:269c2a0c6cfffa576260a8",
    measurementId: "G-L93NTP1QDS"
};

// Initialize Firebase
let app;
let auth;
let db;
let analytics;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    analytics = getAnalytics(app);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Default admin credentials
const ADMIN_CREDENTIALS = {
    email: "Admin@sma",
    password: "Admin2025"
};

// Authentication functions
const authService = {
    async login(email, password) {
        try {
            // Check for default admin credentials first
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                const mockUser = {
                    uid: 'admin-001',
                    email: ADMIN_CREDENTIALS.email,
                    displayName: 'System Administrator'
                };
                return { success: true, user: mockUser };
            }

            // If not admin credentials, try Firebase auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async logout() {
        try {
            if (auth.currentUser) {
                await signOut(auth);
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getCurrentUser() {
        return auth.currentUser;
    },

    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    }
};

// Export services
export { authService, ADMIN_CREDENTIALS, app, auth, db };
