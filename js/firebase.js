// ✅ Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// ✅ Your Firebase configuration
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

// ✅ Initialize Firebase
let app, auth, db, analytics;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app); // ✅ Correct — use Realtime Database
    analytics = getAnalytics(app);
    console.log("✅ Firebase initialized successfully");
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// ✅ Default admin credentials
const ADMIN_CREDENTIALS = {
    email: "Admin@sma",
    password: "Admin2025"
};

// ✅ Authentication functions
const authService = {
    async login(email, password) {
        try {
            // Allow default admin login (local)
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                const mockUser = {
                    uid: "admin-001",
                    email: ADMIN_CREDENTIALS.email,
                    displayName: "System Administrator"
                };
                return { success: true, user: mockUser };
            }

            // Otherwise, sign in using Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getCurrentUser() {
        return auth.currentUser;
    },

    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
};

// ✅ Export everything needed
export { app, auth, db, analytics, authService, ADMIN_CREDENTIALS };
