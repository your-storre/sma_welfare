import authManager from './auth.js';

class MembersManager {
    constructor() {
        this.members = [];
        this.init();
    }

    init() {
        if (!authManager.requireAuth()) return;

        this.loadMembers();
        this.setupEventListeners();
        this.checkUrlActions();
        this.updateDateTime();
    }

    async loadMembers() {
        try {
            // Sample data
            this.members = [
                {
                    id: '1',
                    name: 'Kwame Mensah',
                    memberId: 'SMW001',
                    phone: '+233 24 123 4567',
                    contributions: { jan: 'paid', feb: 'paid', mar: 'unpaid' },
                    total: 200,
                    status: 'partial'
                },
                {
                    id: '2',
                    name: 'Ama Serwaa',
                    memberId: 'SMW002',
                    phone: '+233 20 987 6543',
                    contributions: { jan: 'paid', feb: 'paid', mar: 'paid' },
                    total: 300,
                    status: 'paid'
                },
                {
                    id: '3', 
                    name: 'Kofi Asante',
                    memberId: 'SMW003',
                    phone: '+233 54 111 2233',
                    contributions: { jan: 'paid', feb: 'unpaid', mar: 'unpaid' },
                    total: 100,
                    status: 'unpaid'
                }
            ];

            this.renderMembersTable();
        } catch (error) {
            console.error('Error loading members:', error);
            authManager.showToast('Error loading members data', 'error');
        }
    }

    renderMembersTable() {
        const tbody = document.querySelector('.table-container tbody');
        if (!tbody) return;

        tbody.innerHTML = this.members.map(member => `
            <tr>
                <td>${member.name}</td>
                <td>${member.memberId}</td>
                <td>${member.phone}</td>
                <td>${this.getContributionIcon(member.contributions.jan)}</td>
                <td>${this.getContributionIcon(member.contributions.feb)}</td>
                <td>${this.getContributionIcon(member.contributions.mar)}</td>
                <td>₵ ${member.total.toLocaleString()}</td>
                <td><span class="status-badge status-${member.status}">${this.getStatusText(member.status)}</span></td>
                <td>
                    <div class="action-icons">
                        <div class="action-icon" title="Edit" onclick="membersManager.editMember('${member.id}')">🖋</div>
                        <div class="action-icon" title="Delete" onclick="membersManager.deleteMember('${member.id}')">🗑</div>
                        <div class="action-icon" title="View" onclick="membersManager.viewMember('${member.id}')">👁</div>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getContributionIcon(status) {
        const icons = {
            paid: '✅',
            unpaid: '❌',
            partial: '⚠️'
        };
        return icons[status] || '❓';
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
        // Add member button
        const addMemberBtn = document.getElementById('add-member-btn');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => this.showAddMemberModal());
        }

        // Modal buttons
        const cancelMemberBtn = document.getElementById('cancel-member-btn');
        const saveMemberBtn = document.getElementById('save-member-btn');

        if (cancelMemberBtn) {
            cancelMemberBtn.addEventListener('click', () => this.hideAddMemberModal());
        }

        if (saveMemberBtn) {
            saveMemberBtn.addEventListener('click', () => this.saveMember());
        }

        // Search functionality
        const searchInput = document.querySelector('.search-filter input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterMembers(e.target.value));
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => authManager.logout());
        }
    }

    showAddMemberModal() {
        const modal = document.getElementById('add-member-modal');
        if (modal) {
            // Generate member ID
            document.getElementById('member-id').value = 'SMW' + (this.members.length + 1).toString().padStart(3, '0');
            // Set current date as join date
            document.getElementById('member-join-date').value = new Date().toISOString().split('T')[0];
            modal.style.display = 'flex';
        }
    }

    hideAddMemberModal() {
        const modal = document.getElementById('add-member-modal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('add-member-form').reset();
        }
    }

    async saveMember() {
        const memberData = {
            name: document.getElementById('member-name').value,
            phone: document.getElementById('member-phone').value,
            memberId: document.getElementById('member-id').value,
            joinDate: document.getElementById('member-join-date').value,
            monthlyContribution: parseFloat(document.getElementById('member-contribution').value),
            createdAt: new Date()
        };

        if (!memberData.name || !memberData.phone || !memberData.monthlyContribution) {
            authManager.showToast('Please fill all required fields', 'error');
            return;
        }

        try {
            // For demo, add to local array
            const newMember = {
                id: Date.now().toString(),
                ...memberData,
                contributions: { jan: 'unpaid', feb: 'unpaid', mar: 'unpaid' },
                total: 0,
                status: 'unpaid'
            };
            
            this.members.push(newMember);
            this.renderMembersTable();
            this.hideAddMemberModal();
            authManager.showToast('Member added successfully!', 'success');
        } catch (error) {
            authManager.showToast('Error saving member', 'error');
        }
    }

    filterMembers(searchTerm) {
        const filteredMembers = this.members.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm)
        );
        
        // Re-render table with filtered members
        const tbody = document.querySelector('.table-container tbody');
        tbody.innerHTML = filteredMembers.map(member => `
            <tr>
                <td>${member.name}</td>
                <td>${member.memberId}</td>
                <td>${member.phone}</td>
                <td>${this.getContributionIcon(member.contributions.jan)}</td>
                <td>${this.getContributionIcon(member.contributions.feb)}</td>
                <td>${this.getContributionIcon(member.contributions.mar)}</td>
                <td>₵ ${member.total.toLocaleString()}</td>
                <td><span class="status-badge status-${member.status}">${this.getStatusText(member.status)}</span></td>
                <td>
                    <div class="action-icons">
                        <div class="action-icon" title="Edit" onclick="membersManager.editMember('${member.id}')">🖋</div>
                        <div class="action-icon" title="Delete" onclick="membersManager.deleteMember('${member.id}')">🗑</div>
                        <div class="action-icon" title="View" onclick="membersManager.viewMember('${member.id}')">👁</div>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    editMember(memberId) {
        authManager.showToast('Edit functionality coming soon', 'warning');
    }

    async deleteMember(memberId) {
        if (confirm('Are you sure you want to delete this member?')) {
            try {
                this.members = this.members.filter(m => m.id !== memberId);
                this.renderMembersTable();
                authManager.showToast('Member deleted successfully', 'success');
            } catch (error) {
                authManager.showToast('Error deleting member', 'error');
            }
        }
    }

    viewMember(memberId) {
        authManager.showToast('View functionality coming soon', 'warning');
    }

    checkUrlActions() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'add') {
            this.showAddMemberModal();
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
                minute: '2-digit'
            };
            const dateElement = document.getElementById('current-date');
            if (dateElement) {
                dateElement.textContent = now.toLocaleDateString('en-US', options);
            }
        };
        
        update();
        setInterval(update, 60000);
    }
}

// Initialize members manager
const membersManager = new MembersManager();