import authManager from './auth.js';

class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        // Check authentication
        if (!authManager.requireAuth()) return;

        this.loadDashboardData();
        this.setupEventListeners();
        this.updateDateTime();
    }

    async loadDashboardData() {
        try {
            this.updateSummaryCards();
            this.updateRecentActivity();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    updateSummaryCards() {
        // Sample data - replace with Firestore data
        const summaryData = {
            totalMembers: 142,
            totalFunds: 45280,
            unpaidContributors: 23,
            lastWithdrawal: 5000
        };

        const cards = document.querySelectorAll('.card');
        if (cards[0]) cards[0].querySelector('.card-value').textContent = summaryData.totalMembers;
        if (cards[1]) cards[1].querySelector('.card-value').textContent = `₵ ${summaryData.totalFunds.toLocaleString()}`;
        if (cards[2]) cards[2].querySelector('.card-value').textContent = summaryData.unpaidContributors;
        if (cards[3]) cards[3].querySelector('.card-value').textContent = `₵ ${summaryData.lastWithdrawal.toLocaleString()}`;
    }

    updateRecentActivity() {
        // Sample recent activity data
        const activities = [
            { member: 'Kwame Mensah', amount: 100, month: 'January 2025', method: 'Mobile Money', status: 'paid' },
            { member: 'Ama Serwaa', amount: 100, month: 'January 2025', method: 'Cash', status: 'paid' },
            { member: 'Kofi Asante', amount: 50, month: 'January 2025', method: 'Mobile Money', status: 'partial' }
        ];

        const tbody = document.querySelector('.table-container tbody');
        if (tbody) {
            tbody.innerHTML = activities.map(activity => `
                <tr>
                    <td>${activity.member}</td>
                    <td>₵ ${activity.amount.toLocaleString()}</td>
                    <td>${activity.month}</td>
                    <td>${activity.method}</td>
                    <td><span class="status-badge status-${activity.status}">${this.getStatusText(activity.status)}</span></td>
                </tr>
            `).join('');
        }
    }

    getStatusText(status) {
        const texts = {
            paid: 'Paid',
            unpaid: 'Unpaid', 
            partial: 'Partial'
        };
        return texts[status] || 'Unknown';
    }

    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => authManager.logout());
        }

        // Add member button
        const addMemberBtn = document.querySelector('.action-buttons .btn');
        if (addMemberBtn && addMemberBtn.href.includes('members.html')) {
            addMemberBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'members.html?action=add';
            });
        }
    }

    updateDateTime() {
        const update = () => {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            const dateElement = document.getElementById('current-date');
            if (dateElement) {
                dateElement.textContent = now.toLocaleDateString('en-US', options);
            }
        };
        
        update();
        setInterval(update, 1000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});
