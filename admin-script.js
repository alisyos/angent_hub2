// 관리자 페이지 스크립트

// 현재 활성 섹션
let currentSection = 'dashboard';

// 관리자 페이지 초기화 및 데이터 관리
let currentAdminUser = null;
let currentView = 'dashboard';

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 관리자 인증 확인
    checkAdminAuth();
    
    // 초기 데이터 로드
    if (currentAdminUser) {
        loadDashboardData();
        setupEventListeners();
    }
});

// 관리자 인증 확인
function checkAdminAuth() {
    const currentUser = dataManager.getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
        alert('관리자 권한이 필요합니다.');
        window.location.href = 'index.html';
        return;
    }
    
    currentAdminUser = currentUser;
    updateAdminInfo();
}

// 관리자 정보 업데이트
function updateAdminInfo() {
    if (currentAdminUser) {
        const adminNameElement = document.getElementById('admin-name');
        if (adminNameElement) {
            adminNameElement.textContent = currentAdminUser.name;
        }
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 사이드바 메뉴 클릭
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.addEventListener('click', function() {
            const targetView = this.getAttribute('data-view');
            if (targetView) {
                switchView(targetView);
            }
        });
    });
    
    // 모달 관련 이벤트
    setupModalEvents();
    
    // 실시간 업데이트
    setInterval(updateRealTimeData, 30000); // 30초마다 업데이트
}

// 모달 이벤트 설정
function setupModalEvents() {
    // 모달 닫기 버튼
    document.querySelectorAll('.modal .close, .modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // 모달 외부 클릭 시 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAllModals();
            }
        });
    });
}

// 모든 모달 닫기
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// 뷰 전환
function switchView(viewName) {
    // 사이드바 메뉴 활성화 상태 업데이트
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    // 콘텐츠 영역 업데이트
    hideAllViews();
    currentView = viewName;
    
    switch(viewName) {
        case 'dashboard':
            showDashboard();
            break;
        case 'users':
            showUsersManagement();
            break;
        case 'agents':
            showAgentsManagement();
            break;
        case 'credits':
            showCreditsManagement();
            break;
        case 'logs':
            showLogsManagement();
            break;
        default:
            showDashboard();
    }
}

// 모든 뷰 숨기기
function hideAllViews() {
    const views = ['dashboard-view', 'users-view', 'agents-view', 'credits-view', 'logs-view'];
    views.forEach(viewId => {
        const element = document.getElementById(viewId);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// 대시보드 표시
function showDashboard() {
    const dashboardView = document.getElementById('dashboard-view');
    if (dashboardView) {
        dashboardView.style.display = 'block';
        loadDashboardData();
    }
}

// 대시보드 데이터 로드
function loadDashboardData() {
    const users = dataManager.getUsers();
    const agents = dataManager.getAgents();
    const usageHistory = dataManager.getUsageHistory();
    
    // 통계 업데이트
    updateStatistics(users, agents, usageHistory);
    
    // 최근 활동 업데이트
    updateRecentActivity(usageHistory);
    
    // 인기 에이전트 업데이트
    updatePopularAgents(agents, usageHistory);
}

// 통계 업데이트
function updateStatistics(users, agents, usageHistory) {
    // 총 사용자 수
    const totalUsersElement = document.getElementById('total-users');
    if (totalUsersElement) {
        totalUsersElement.textContent = users.length.toLocaleString();
    }
    
    // 활성 에이전트 수
    const activeAgentsElement = document.getElementById('active-agents');
    if (activeAgentsElement) {
        const activeAgents = agents.filter(agent => agent.status === 'active');
        activeAgentsElement.textContent = activeAgents.length.toLocaleString();
    }
    
    // 오늘 사용량
    const todayUsageElement = document.getElementById('today-usage');
    if (todayUsageElement) {
        const today = new Date().toDateString();
        const todayUsage = usageHistory.filter(record => 
            new Date(record.timestamp).toDateString() === today
        );
        todayUsageElement.textContent = todayUsage.length.toLocaleString();
    }
    
    // 총 수익 (크레딧 판매 기준 가상 계산)
    const totalRevenueElement = document.getElementById('total-revenue');
    if (totalRevenueElement) {
        const totalCreditsUsed = usageHistory.reduce((sum, record) => sum + record.credits, 0);
        const estimatedRevenue = Math.floor(totalCreditsUsed * 0.1); // 크레딧당 0.1원 가정
        totalRevenueElement.textContent = `${estimatedRevenue.toLocaleString()}원`;
    }
}

// 최근 활동 업데이트
function updateRecentActivity(usageHistory) {
    const recentActivityElement = document.getElementById('recent-activity');
    if (!recentActivityElement) return;
    
    const recentRecords = usageHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    
    recentActivityElement.innerHTML = '';
    
    if (recentRecords.length === 0) {
        recentActivityElement.innerHTML = '<p class="no-data">최근 활동이 없습니다.</p>';
        return;
    }
    
    recentRecords.forEach(record => {
        const user = dataManager.getUserById(record.userId);
        const agent = dataManager.getAgentById(record.agentId);
        
        if (user && agent) {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-info">
                    <strong>${user.name}</strong>님이 
                    <span class="agent-name">${agent.title}</span> 사용
                </div>
                <div class="activity-meta">
                    <span class="credits">${record.credits} 크레딧</span>
                    <span class="time">${formatTimeAgo(record.timestamp)}</span>
                </div>
            `;
            recentActivityElement.appendChild(activityItem);
        }
    });
}

// 인기 에이전트 업데이트
function updatePopularAgents(agents, usageHistory) {
    const popularAgentsElement = document.getElementById('popular-agents');
    if (!popularAgentsElement) return;
    
    // 에이전트별 사용 횟수 계산
    const agentUsage = {};
    usageHistory.forEach(record => {
        agentUsage[record.agentId] = (agentUsage[record.agentId] || 0) + 1;
    });
    
    // 사용 횟수 기준 정렬
    const sortedAgents = agents
        .map(agent => ({
            ...agent,
            usageCount: agentUsage[agent.id] || 0
        }))
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5);
    
    popularAgentsElement.innerHTML = '';
    
    if (sortedAgents.length === 0) {
        popularAgentsElement.innerHTML = '<p class="no-data">사용 기록이 없습니다.</p>';
        return;
    }
    
    sortedAgents.forEach((agent, index) => {
        const agentItem = document.createElement('div');
        agentItem.className = 'popular-agent-item';
        agentItem.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="agent-info">
                <div class="agent-name">${agent.title}</div>
                <div class="usage-count">${agent.usageCount}회 사용</div>
            </div>
            <div class="agent-credits">${agent.credits} 크레딧</div>
        `;
        popularAgentsElement.appendChild(agentItem);
    });
}

// 사용자 관리 표시
function showUsersManagement() {
    const usersView = document.getElementById('users-view');
    if (usersView) {
        usersView.style.display = 'block';
        loadUsersData();
    }
}

// 사용자 데이터 로드
function loadUsersData() {
    const users = dataManager.getUsers();
    const usersTableBody = document.getElementById('users-table-body');
    
    if (!usersTableBody) return;
    
    usersTableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </td>
            <td>
                <span class="role-badge role-${user.role}">${getRoleDisplayName(user.role)}</span>
            </td>
            <td>${user.accountType === 'company' ? user.companyName || '-' : '개인'}</td>
            <td class="credits">${user.credits.toLocaleString()}</td>
            <td>
                <span class="status-badge status-${user.status}">${getStatusDisplayName(user.status)}</span>
            </td>
            <td class="actions">
                <button onclick="editUser('${user.id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteUser('${user.id}')" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

// 역할 표시명 반환
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': '시스템 관리자',
        'company_admin': '회사 관리자',
        'user': '일반 사용자'
    };
    return roleNames[role] || role;
}

// 상태 표시명 반환
function getStatusDisplayName(status) {
    const statusNames = {
        'active': '활성',
        'inactive': '비활성',
        'suspended': '정지'
    };
    return statusNames[status] || status;
}

// 사용자 편집
function editUser(userId) {
    const user = dataManager.getUserById(userId);
    if (!user) return;
    
    // 편집 모달 표시
    const modal = document.getElementById('edit-user-modal');
    if (modal) {
        // 폼에 사용자 정보 채우기
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.name;
        document.getElementById('edit-user-email').value = user.email;
        document.getElementById('edit-user-role').value = user.role;
        document.getElementById('edit-user-credits').value = user.credits;
        document.getElementById('edit-user-status').value = user.status;
        
        modal.style.display = 'block';
    }
}

// 사용자 정보 저장
function saveUserEdit() {
    const userId = document.getElementById('edit-user-id').value;
    const updates = {
        name: document.getElementById('edit-user-name').value,
        email: document.getElementById('edit-user-email').value,
        role: document.getElementById('edit-user-role').value,
        credits: parseInt(document.getElementById('edit-user-credits').value),
        status: document.getElementById('edit-user-status').value
    };
    
    const updatedUser = dataManager.updateUser(userId, updates);
    if (updatedUser) {
        showAlert('사용자 정보가 업데이트되었습니다.', 'success');
        closeAllModals();
        loadUsersData();
    } else {
        showAlert('사용자 정보 업데이트에 실패했습니다.', 'error');
    }
}

// 사용자 삭제
function deleteUser(userId) {
    const user = dataManager.getUserById(userId);
    if (!user) return;
    
    if (user.role === 'admin') {
        showAlert('관리자 계정은 삭제할 수 없습니다.', 'warning');
        return;
    }
    
    if (confirm(`정말로 ${user.name}님의 계정을 삭제하시겠습니까?`)) {
        if (dataManager.deleteUser(userId)) {
            showAlert('사용자가 삭제되었습니다.', 'success');
            loadUsersData();
        } else {
            showAlert('사용자 삭제에 실패했습니다.', 'error');
        }
    }
}

// 에이전트 관리 표시
function showAgentsManagement() {
    const agentsView = document.getElementById('agents-view');
    if (agentsView) {
        agentsView.style.display = 'block';
        loadAgentsData();
    }
}

// 에이전트 데이터 로드
function loadAgentsData() {
    const agents = dataManager.getAgents();
    const agentsGrid = document.getElementById('agents-grid');
    
    if (!agentsGrid) return;
    
    agentsGrid.innerHTML = '';
    
    agents.forEach(agent => {
        const agentCard = document.createElement('div');
        agentCard.className = 'admin-agent-card';
        agentCard.innerHTML = `
            <div class="agent-header">
                <div class="agent-icon">
                    <i class="${agent.icon}"></i>
                </div>
                <div class="agent-status">
                    <span class="status-badge status-${agent.status}">${agent.status}</span>
                </div>
            </div>
            <div class="agent-info">
                <h3>${agent.title}</h3>
                <p>${agent.description}</p>
                <div class="agent-meta">
                    <span class="credits">${agent.credits} 크레딧</span>
                    <span class="category">${agent.category}</span>
                    <span class="usage">${agent.usage}회 사용</span>
                </div>
            </div>
            <div class="agent-actions">
                <button onclick="editAgent('${agent.id}')" class="btn btn-primary">
                    <i class="fas fa-edit"></i> 편집
                </button>
                <button onclick="toggleAgentStatus('${agent.id}')" class="btn btn-secondary">
                    <i class="fas fa-power-off"></i> ${agent.status === 'active' ? '비활성화' : '활성화'}
                </button>
            </div>
        `;
        agentsGrid.appendChild(agentCard);
    });
}

// 에이전트 편집
function editAgent(agentId) {
    const agent = dataManager.getAgentById(agentId);
    if (!agent) return;
    
    const modal = document.getElementById('edit-agent-modal');
    if (modal) {
        document.getElementById('edit-agent-id').value = agent.id;
        document.getElementById('edit-agent-title').value = agent.title;
        document.getElementById('edit-agent-description').value = agent.description;
        document.getElementById('edit-agent-credits').value = agent.credits;
        document.getElementById('edit-agent-category').value = agent.category;
        document.getElementById('edit-agent-icon').value = agent.icon;
        document.getElementById('edit-agent-status').value = agent.status;
        
        modal.style.display = 'block';
    }
}

// 에이전트 정보 저장
function saveAgentEdit() {
    const agentId = document.getElementById('edit-agent-id').value;
    const updates = {
        title: document.getElementById('edit-agent-title').value,
        description: document.getElementById('edit-agent-description').value,
        credits: parseInt(document.getElementById('edit-agent-credits').value),
        category: document.getElementById('edit-agent-category').value,
        icon: document.getElementById('edit-agent-icon').value,
        status: document.getElementById('edit-agent-status').value
    };
    
    const updatedAgent = dataManager.updateAgent(agentId, updates);
    if (updatedAgent) {
        showAlert('에이전트 정보가 업데이트되었습니다.', 'success');
        closeAllModals();
        loadAgentsData();
    } else {
        showAlert('에이전트 정보 업데이트에 실패했습니다.', 'error');
    }
}

// 에이전트 상태 토글
function toggleAgentStatus(agentId) {
    const agent = dataManager.getAgentById(agentId);
    if (!agent) return;
    
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    const updatedAgent = dataManager.updateAgent(agentId, { status: newStatus });
    
    if (updatedAgent) {
        showAlert(`에이전트가 ${newStatus === 'active' ? '활성화' : '비활성화'}되었습니다.`, 'success');
        loadAgentsData();
    } else {
        showAlert('에이전트 상태 변경에 실패했습니다.', 'error');
    }
}

// 크레딧 관리 표시
function showCreditsManagement() {
    const creditsView = document.getElementById('credits-view');
    if (creditsView) {
        creditsView.style.display = 'block';
        loadCreditsData();
    }
}

// 크레딧 데이터 로드
function loadCreditsData() {
    const users = dataManager.getUsers();
    const usageHistory = dataManager.getUsageHistory();
    
    // 크레딧 통계 업데이트
    updateCreditsStatistics(users, usageHistory);
    
    // 사용자별 크레딧 현황 업데이트
    updateUserCreditsTable(users);
}

// 크레딧 통계 업데이트
function updateCreditsStatistics(users, usageHistory) {
    const totalCredits = users.reduce((sum, user) => sum + user.credits, 0);
    const totalUsed = usageHistory.reduce((sum, record) => sum + record.credits, 0);
    
    const totalCreditsElement = document.getElementById('total-credits-stat');
    const totalUsedElement = document.getElementById('total-used-stat');
    
    if (totalCreditsElement) {
        totalCreditsElement.textContent = totalCredits.toLocaleString();
    }
    
    if (totalUsedElement) {
        totalUsedElement.textContent = totalUsed.toLocaleString();
    }
}

// 사용자별 크레딧 테이블 업데이트
function updateUserCreditsTable(users) {
    const tableBody = document.getElementById('user-credits-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td class="credits">${user.credits.toLocaleString()}</td>
            <td class="actions">
                <button onclick="adjustUserCredits('${user.id}')" class="btn btn-primary">
                    <i class="fas fa-coins"></i> 크레딧 조정
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 사용자 크레딧 조정
function adjustUserCredits(userId) {
    const user = dataManager.getUserById(userId);
    if (!user) return;
    
    const modal = document.getElementById('adjust-credits-modal');
    if (modal) {
        document.getElementById('adjust-user-id').value = userId;
        document.getElementById('adjust-user-name').textContent = user.name;
        document.getElementById('current-credits').textContent = user.credits.toLocaleString();
        document.getElementById('credits-amount').value = '';
        document.getElementById('credits-operation').value = 'add';
        
        modal.style.display = 'block';
    }
}

// 크레딧 조정 실행
function executeCreditsAdjustment() {
    const userId = document.getElementById('adjust-user-id').value;
    const amount = parseInt(document.getElementById('credits-amount').value);
    const operation = document.getElementById('credits-operation').value;
    
    if (!amount || amount <= 0) {
        showAlert('유효한 크레딧 금액을 입력해주세요.', 'warning');
        return;
    }
    
    let updatedUser;
    if (operation === 'add') {
        updatedUser = dataManager.addCredits(userId, amount);
    } else {
        updatedUser = dataManager.deductCredits(userId, amount);
    }
    
    if (updatedUser) {
        showAlert(`크레딧이 ${operation === 'add' ? '추가' : '차감'}되었습니다.`, 'success');
        closeAllModals();
        loadCreditsData();
    } else {
        showAlert('크레딧 조정에 실패했습니다.', 'error');
    }
}

// 로그 관리 표시
function showLogsManagement() {
    const logsView = document.getElementById('logs-view');
    if (logsView) {
        logsView.style.display = 'block';
        loadLogsData();
    }
}

// 로그 데이터 로드
function loadLogsData() {
    const usageHistory = dataManager.getUsageHistory();
    const logsTableBody = document.getElementById('logs-table-body');
    
    if (!logsTableBody) return;
    
    logsTableBody.innerHTML = '';
    
    // 최근 100개 로그만 표시
    const recentLogs = usageHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 100);
    
    if (recentLogs.length === 0) {
        logsTableBody.innerHTML = '<tr><td colspan="5" class="no-data">로그 데이터가 없습니다.</td></tr>';
        return;
    }
    
    recentLogs.forEach(log => {
        const user = dataManager.getUserById(log.userId);
        const agent = dataManager.getAgentById(log.agentId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDateTime(log.timestamp)}</td>
            <td>${user ? user.name : '알 수 없음'}</td>
            <td>${agent ? agent.title : '알 수 없음'}</td>
            <td class="credits">${log.credits}</td>
            <td>에이전트 실행</td>
        `;
        logsTableBody.appendChild(row);
    });
}

// 실시간 데이터 업데이트
function updateRealTimeData() {
    if (currentView === 'dashboard') {
        loadDashboardData();
    }
}

// 시간 포맷팅 함수들
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) {
        return '방금 전';
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else {
        return `${Math.floor(diffInSeconds / 86400)}일 전`;
    }
}

function formatDateTime(timestamp) {
    return new Date(timestamp).toLocaleString('ko-KR');
}

// 알림 시스템 (메인 스크립트와 동일)
function showAlert(message, type = 'info') {
    // 기존 알림 제거
    const existingAlert = document.querySelector('.alert-toast');
    const existingOverlay = document.querySelector('.alert-overlay');
    if (existingAlert) {
        existingAlert.remove();
    }
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // 오버레이 배경 생성
    const overlay = document.createElement('div');
    overlay.className = 'alert-overlay';
    overlay.onclick = () => closeAlert();
    
    // 새 알림 생성
    const alert = document.createElement('div');
    alert.className = `alert-toast alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close" onclick="closeAlert()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(alert);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

// 알림 닫기 함수
function closeAlert() {
    const alert = document.querySelector('.alert-toast');
    const overlay = document.querySelector('.alert-overlay');
    
    if (alert) {
        alert.style.animation = 'alertSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 300);
    }
    
    if (overlay) {
        overlay.style.animation = 'overlayFadeOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 300);
    }
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// 로그아웃
function adminLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        dataManager.logout();
        window.location.href = 'index.html';
    }
}

// 데이터 초기화 (개발용)
function resetAllData() {
    if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        dataManager.resetData();
        showAlert('모든 데이터가 초기화되었습니다.', 'success');
        loadDashboardData();
    }
}