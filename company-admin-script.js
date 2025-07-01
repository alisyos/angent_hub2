// 회사 관리자 페이지 스크립트

// 현재 활성 섹션
let currentSection = 'overview';

// 회사 관리자 초기화 및 데이터 관리
let currentCompanyAdmin = null;
let currentView = 'dashboard';
let companyEmployees = [];

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 회사 관리자 인증 확인
    checkCompanyAdminAuth();
    
    // 초기 데이터 로드
    if (currentCompanyAdmin) {
        loadDashboardData();
        setupEventListeners();
    }
});

// 회사 관리자 인증 확인
function checkCompanyAdminAuth() {
    const currentUser = dataManager.getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'company_admin') {
        alert('회사 관리자 권한이 필요합니다.');
        window.location.href = 'index.html';
        return;
    }
    
    currentCompanyAdmin = currentUser;
    updateCompanyAdminInfo();
    loadCompanyEmployees();
}

// 회사 관리자 정보 업데이트
function updateCompanyAdminInfo() {
    if (currentCompanyAdmin) {
        const adminNameElement = document.getElementById('company-admin-name');
        const companyNameElement = document.getElementById('company-name-display');
        
        if (adminNameElement) {
            adminNameElement.textContent = currentCompanyAdmin.name;
        }
        
        if (companyNameElement) {
            companyNameElement.textContent = currentCompanyAdmin.companyName || '회사';
        }
    }
}

// 회사 직원 데이터 로드
function loadCompanyEmployees() {
    const allUsers = dataManager.getUsers();
    // 같은 회사의 직원들 필터링 (실제 환경에서는 회사 ID로 관리)
    companyEmployees = allUsers.filter(user => 
        user.companyName === currentCompanyAdmin.companyName && user.id !== currentCompanyAdmin.id
    );
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
        case 'employees':
            showEmployeesManagement();
            break;
        case 'permissions':
            showPermissionsManagement();
            break;
        case 'usage':
            showUsageAnalysis();
            break;
        case 'company-credits':
            showCompanyCreditsManagement();
            break;
        default:
            showDashboard();
    }
}

// 모든 뷰 숨기기
function hideAllViews() {
    const views = ['dashboard-view', 'employees-view', 'permissions-view', 'usage-view', 'company-credits-view'];
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
    const allUsageHistory = dataManager.getUsageHistory();
    
    // 회사 직원들의 사용 기록만 필터링
    const companyUsageHistory = allUsageHistory.filter(record => {
        const user = dataManager.getUserById(record.userId);
        return user && (user.companyName === currentCompanyAdmin.companyName || user.id === currentCompanyAdmin.id);
    });
    
    // 통계 업데이트
    updateDashboardStatistics(companyUsageHistory);
    
    // 최근 활동 업데이트
    updateRecentCompanyActivity(companyUsageHistory);
    
    // 부서별 사용량 차트 업데이트
    updateDepartmentUsageChart(companyUsageHistory);
    
    // 월별 사용량 트렌드 업데이트
    updateMonthlyUsageTrend(companyUsageHistory);
}

// 대시보드 통계 업데이트
function updateDashboardStatistics(usageHistory) {
    // 총 직원 수
    const totalEmployeesElement = document.getElementById('total-employees');
    if (totalEmployeesElement) {
        totalEmployeesElement.textContent = (companyEmployees.length + 1).toLocaleString(); // +1은 관리자 본인
    }
    
    // 이번 달 AI 사용량
    const thisMonthUsageElement = document.getElementById('this-month-usage');
    if (thisMonthUsageElement) {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const thisMonthUsage = usageHistory.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
        });
        thisMonthUsageElement.textContent = thisMonthUsage.length.toLocaleString();
    }
    
    // 이번 달 크레딧 사용량
    const monthlyCreditsElement = document.getElementById('monthly-credits');
    if (monthlyCreditsElement) {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const monthlyCredits = usageHistory
            .filter(record => {
                const recordDate = new Date(record.timestamp);
                return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
            })
            .reduce((sum, record) => sum + record.credits, 0);
        monthlyCreditsElement.textContent = monthlyCredits.toLocaleString();
    }
    
    // 회사 총 크레딧 잔액
    const companyCreditsElement = document.getElementById('company-total-credits');
    if (companyCreditsElement) {
        const companyUsers = [currentCompanyAdmin, ...companyEmployees];
        const totalCredits = companyUsers.reduce((sum, user) => sum + user.credits, 0);
        companyCreditsElement.textContent = totalCredits.toLocaleString();
    }
}

// 최근 회사 활동 업데이트
function updateRecentCompanyActivity(usageHistory) {
    const recentActivityElement = document.getElementById('recent-company-activity');
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
                    <div class="department">${user.department || '미분류'} / ${user.position || '미정'}</div>
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

// 부서별 사용량 차트 업데이트 (간단한 텍스트 기반)
function updateDepartmentUsageChart(usageHistory) {
    const chartElement = document.getElementById('department-usage-chart');
    if (!chartElement) return;
    
    // 부서별 사용량 집계
    const departmentUsage = {};
    usageHistory.forEach(record => {
        const user = dataManager.getUserById(record.userId);
        if (user) {
            const department = user.department || '미분류';
            departmentUsage[department] = (departmentUsage[department] || 0) + 1;
        }
    });
    
    chartElement.innerHTML = '';
    
    if (Object.keys(departmentUsage).length === 0) {
        chartElement.innerHTML = '<p class="no-data">부서별 사용 데이터가 없습니다.</p>';
        return;
    }
    
    // 부서별 사용량을 막대 차트 형태로 표시
    const maxUsage = Math.max(...Object.values(departmentUsage));
    
    Object.entries(departmentUsage).forEach(([department, usage]) => {
        const percentage = (usage / maxUsage) * 100;
        const chartItem = document.createElement('div');
        chartItem.className = 'chart-item';
        chartItem.innerHTML = `
            <div class="chart-label">${department}</div>
            <div class="chart-bar">
                <div class="chart-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="chart-value">${usage}회</div>
        `;
        chartElement.appendChild(chartItem);
    });
}

// 월별 사용량 트렌드 업데이트
function updateMonthlyUsageTrend(usageHistory) {
    const trendElement = document.getElementById('monthly-usage-trend');
    if (!trendElement) return;
    
    // 최근 6개월 데이터 집계
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('ko-KR', { month: 'short' });
        const usage = usageHistory.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate.getMonth() === date.getMonth() && 
                   recordDate.getFullYear() === date.getFullYear();
        }).length;
        
        months.push({ month: monthName, usage });
    }
    
    trendElement.innerHTML = '';
    
    if (months.every(m => m.usage === 0)) {
        trendElement.innerHTML = '<p class="no-data">월별 사용 데이터가 없습니다.</p>';
        return;
    }
    
    const maxUsage = Math.max(...months.map(m => m.usage));
    
    months.forEach(({ month, usage }) => {
        const percentage = maxUsage > 0 ? (usage / maxUsage) * 100 : 0;
        const trendItem = document.createElement('div');
        trendItem.className = 'trend-item';
        trendItem.innerHTML = `
            <div class="trend-month">${month}</div>
            <div class="trend-bar">
                <div class="trend-fill" style="height: ${percentage}%"></div>
            </div>
            <div class="trend-value">${usage}</div>
        `;
        trendElement.appendChild(trendItem);
    });
}

// 직원 관리 표시
function showEmployeesManagement() {
    const employeesView = document.getElementById('employees-view');
    if (employeesView) {
        employeesView.style.display = 'block';
        loadEmployeesData();
    }
}

// 직원 데이터 로드
function loadEmployeesData() {
    const employeesTableBody = document.getElementById('employees-table-body');
    if (!employeesTableBody) return;
    
    employeesTableBody.innerHTML = '';
    
    if (companyEmployees.length === 0) {
        employeesTableBody.innerHTML = '<tr><td colspan="6" class="no-data">등록된 직원이 없습니다.</td></tr>';
        return;
    }
    
    companyEmployees.forEach(employee => {
        const usageHistory = dataManager.getUsageHistory();
        const employeeUsage = usageHistory.filter(record => record.userId === employee.id);
        const totalUsage = employeeUsage.length;
        const totalCreditsUsed = employeeUsage.reduce((sum, record) => sum + record.credits, 0);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="employee-info">
                    <div class="employee-name">${employee.name}</div>
                    <div class="employee-email">${employee.email}</div>
                </div>
            </td>
            <td>${employee.department || '미분류'}</td>
            <td>${employee.position || '미정'}</td>
            <td class="credits">${employee.credits.toLocaleString()}</td>
            <td>${totalUsage}회 (${totalCreditsUsed} 크레딧)</td>
            <td>
                <span class="status-badge status-${employee.status}">${getStatusDisplayName(employee.status)}</span>
            </td>
            <td class="actions">
                <button onclick="editEmployee('${employee.id}')" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="toggleEmployeeStatus('${employee.id}')" class="btn-toggle">
                    <i class="fas fa-power-off"></i>
                </button>
            </td>
        `;
        employeesTableBody.appendChild(row);
    });
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

// 직원 편집
function editEmployee(employeeId) {
    const employee = dataManager.getUserById(employeeId);
    if (!employee) return;
    
    const modal = document.getElementById('edit-employee-modal');
    if (modal) {
        document.getElementById('edit-employee-id').value = employee.id;
        document.getElementById('edit-employee-name').value = employee.name;
        document.getElementById('edit-employee-email').value = employee.email;
        document.getElementById('edit-employee-department').value = employee.department || '';
        document.getElementById('edit-employee-position').value = employee.position || '';
        document.getElementById('edit-employee-credits').value = employee.credits;
        document.getElementById('edit-employee-status').value = employee.status;
        
        modal.style.display = 'block';
    }
}

// 직원 정보 저장
function saveEmployeeEdit() {
    const employeeId = document.getElementById('edit-employee-id').value;
    const updates = {
        name: document.getElementById('edit-employee-name').value,
        email: document.getElementById('edit-employee-email').value,
        department: document.getElementById('edit-employee-department').value,
        position: document.getElementById('edit-employee-position').value,
        credits: parseInt(document.getElementById('edit-employee-credits').value),
        status: document.getElementById('edit-employee-status').value
    };
    
    const updatedEmployee = dataManager.updateUser(employeeId, updates);
    if (updatedEmployee) {
        showAlert('직원 정보가 업데이트되었습니다.', 'success');
        closeAllModals();
        loadCompanyEmployees();
        loadEmployeesData();
    } else {
        showAlert('직원 정보 업데이트에 실패했습니다.', 'error');
    }
}

// 직원 상태 토글
function toggleEmployeeStatus(employeeId) {
    const employee = dataManager.getUserById(employeeId);
    if (!employee) return;
    
    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    const updatedEmployee = dataManager.updateUser(employeeId, { status: newStatus });
    
    if (updatedEmployee) {
        showAlert(`직원이 ${newStatus === 'active' ? '활성화' : '비활성화'}되었습니다.`, 'success');
        loadCompanyEmployees();
        loadEmployeesData();
    } else {
        showAlert('직원 상태 변경에 실패했습니다.', 'error');
    }
}

// 새 직원 초대
function inviteEmployee() {
    const modal = document.getElementById('invite-employee-modal');
    if (modal) {
        // 폼 초기화
        document.getElementById('invite-form').reset();
        modal.style.display = 'block';
    }
}

// 직원 초대 실행
function executeEmployeeInvitation() {
    const formData = {
        name: document.getElementById('invite-name').value.trim(),
        email: document.getElementById('invite-email').value.trim(),
        department: document.getElementById('invite-department').value.trim(),
        position: document.getElementById('invite-position').value.trim(),
        password: 'temp123', // 임시 비밀번호
        role: 'user',
        accountType: 'company',
        companyName: currentCompanyAdmin.companyName,
        credits: 1000 // 기본 크레딧
    };
    
    // 입력 검증
    if (!formData.name || !formData.email) {
        showAlert('이름과 이메일을 입력해주세요.', 'warning');
        return;
    }
    
    // 이메일 중복 체크
    if (dataManager.getUserByEmail(formData.email)) {
        showAlert('이미 사용 중인 이메일입니다.', 'error');
        return;
    }
    
    // 새 직원 생성
    const newEmployee = dataManager.createUser(formData);
    if (newEmployee) {
        showAlert(`${formData.name}님이 초대되었습니다. 임시 비밀번호: temp123`, 'success');
        closeAllModals();
        loadCompanyEmployees();
        loadEmployeesData();
    } else {
        showAlert('직원 초대에 실패했습니다.', 'error');
    }
}

// 권한 관리 표시
function showPermissionsManagement() {
    const permissionsView = document.getElementById('permissions-view');
    if (permissionsView) {
        permissionsView.style.display = 'block';
        loadPermissionsData();
    }
}

// 권한 데이터 로드
function loadPermissionsData() {
    const agents = dataManager.getAgents();
    const permissionsGrid = document.getElementById('permissions-grid');
    
    if (!permissionsGrid) return;
    
    permissionsGrid.innerHTML = '';
    
    agents.forEach(agent => {
        const permissionCard = document.createElement('div');
        permissionCard.className = 'permission-card';
        
        // 현재는 모든 에이전트를 활성화로 가정 (실제로는 권한 데이터베이스 필요)
        const isEnabled = agent.status === 'active';
        
        permissionCard.innerHTML = `
            <div class="permission-header">
                <div class="agent-icon">
                    <i class="${agent.icon}"></i>
                </div>
                <div class="permission-toggle">
                    <label class="switch">
                        <input type="checkbox" ${isEnabled ? 'checked' : ''} 
                               onchange="toggleAgentPermission('${agent.id}', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="permission-info">
                <h3>${agent.title}</h3>
                <p>${agent.description}</p>
                <div class="permission-meta">
                    <span class="credits">${agent.credits} 크레딧</span>
                    <span class="category">${agent.category}</span>
                </div>
            </div>
        `;
        permissionsGrid.appendChild(permissionCard);
    });
}

// 에이전트 권한 토글
function toggleAgentPermission(agentId, isEnabled) {
    // 실제 환경에서는 회사별 에이전트 권한을 별도 관리
    const status = isEnabled ? 'active' : 'inactive';
    showAlert(`에이전트 권한이 ${isEnabled ? '활성화' : '비활성화'}되었습니다.`, 'success');
}

// 사용량 분석 표시
function showUsageAnalysis() {
    const usageView = document.getElementById('usage-view');
    if (usageView) {
        usageView.style.display = 'block';
        loadUsageAnalysisData();
    }
}

// 사용량 분석 데이터 로드
function loadUsageAnalysisData() {
    const allUsageHistory = dataManager.getUsageHistory();
    const companyUsageHistory = allUsageHistory.filter(record => {
        const user = dataManager.getUserById(record.userId);
        return user && (user.companyName === currentCompanyAdmin.companyName || user.id === currentCompanyAdmin.id);
    });
    
    // 기간별 사용량 분석
    updatePeriodUsageAnalysis(companyUsageHistory);
    
    // 직원별 사용량 순위
    updateEmployeeUsageRanking(companyUsageHistory);
    
    // 에이전트별 인기도
    updateAgentPopularityAnalysis(companyUsageHistory);
}

// 기간별 사용량 분석
function updatePeriodUsageAnalysis(usageHistory) {
    const periodStatsElement = document.getElementById('period-usage-stats');
    if (!periodStatsElement) return;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const todayUsage = usageHistory.filter(record => 
        new Date(record.timestamp) >= today
    ).length;
    
    const thisWeekUsage = usageHistory.filter(record => 
        new Date(record.timestamp) >= thisWeekStart
    ).length;
    
    const thisMonthUsage = usageHistory.filter(record => 
        new Date(record.timestamp) >= thisMonthStart
    ).length;
    
    periodStatsElement.innerHTML = `
        <div class="period-stat">
            <h4>오늘</h4>
            <div class="stat-number">${todayUsage}</div>
            <div class="stat-label">AI 실행</div>
        </div>
        <div class="period-stat">
            <h4>이번 주</h4>
            <div class="stat-number">${thisWeekUsage}</div>
            <div class="stat-label">AI 실행</div>
        </div>
        <div class="period-stat">
            <h4>이번 달</h4>
            <div class="stat-number">${thisMonthUsage}</div>
            <div class="stat-label">AI 실행</div>
        </div>
    `;
}

// 직원별 사용량 순위
function updateEmployeeUsageRanking(usageHistory) {
    const rankingElement = document.getElementById('employee-usage-ranking');
    if (!rankingElement) return;
    
    // 직원별 사용량 집계
    const employeeUsage = {};
    usageHistory.forEach(record => {
        const user = dataManager.getUserById(record.userId);
        if (user) {
            if (!employeeUsage[user.id]) {
                employeeUsage[user.id] = {
                    name: user.name,
                    department: user.department || '미분류',
                    usage: 0,
                    credits: 0
                };
            }
            employeeUsage[user.id].usage++;
            employeeUsage[user.id].credits += record.credits;
        }
    });
    
    // 사용량 기준 정렬
    const sortedEmployees = Object.values(employeeUsage)
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 10);
    
    rankingElement.innerHTML = '';
    
    if (sortedEmployees.length === 0) {
        rankingElement.innerHTML = '<p class="no-data">사용 데이터가 없습니다.</p>';
        return;
    }
    
    sortedEmployees.forEach((employee, index) => {
        const rankItem = document.createElement('div');
        rankItem.className = 'rank-item';
        rankItem.innerHTML = `
            <div class="rank-number">${index + 1}</div>
            <div class="employee-info">
                <div class="employee-name">${employee.name}</div>
                <div class="employee-department">${employee.department}</div>
            </div>
            <div class="usage-stats">
                <div class="usage-count">${employee.usage}회</div>
                <div class="credits-used">${employee.credits} 크레딧</div>
            </div>
        `;
        rankingElement.appendChild(rankItem);
    });
}

// 에이전트별 인기도 분석
function updateAgentPopularityAnalysis(usageHistory) {
    const popularityElement = document.getElementById('agent-popularity-analysis');
    if (!popularityElement) return;
    
    // 에이전트별 사용량 집계
    const agentUsage = {};
    usageHistory.forEach(record => {
        const agent = dataManager.getAgentById(record.agentId);
        if (agent) {
            if (!agentUsage[agent.id]) {
                agentUsage[agent.id] = {
                    title: agent.title,
                    category: agent.category,
                    usage: 0,
                    credits: 0
                };
            }
            agentUsage[agent.id].usage++;
            agentUsage[agent.id].credits += record.credits;
        }
    });
    
    // 사용량 기준 정렬
    const sortedAgents = Object.values(agentUsage)
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);
    
    popularityElement.innerHTML = '';
    
    if (sortedAgents.length === 0) {
        popularityElement.innerHTML = '<p class="no-data">사용 데이터가 없습니다.</p>';
        return;
    }
    
    const maxUsage = sortedAgents[0].usage;
    
    sortedAgents.forEach((agent, index) => {
        const percentage = (agent.usage / maxUsage) * 100;
        const popularityItem = document.createElement('div');
        popularityItem.className = 'popularity-item';
        popularityItem.innerHTML = `
            <div class="agent-info">
                <div class="agent-title">${agent.title}</div>
                <div class="agent-category">${agent.category}</div>
            </div>
            <div class="popularity-bar">
                <div class="popularity-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="popularity-stats">
                <div class="usage-count">${agent.usage}회</div>
                <div class="credits-total">${agent.credits} 크레딧</div>
            </div>
        `;
        popularityElement.appendChild(popularityItem);
    });
}

// 회사 크레딧 관리 표시
function showCompanyCreditsManagement() {
    const creditsView = document.getElementById('company-credits-view');
    if (creditsView) {
        creditsView.style.display = 'block';
        loadCompanyCreditsData();
    }
}

// 회사 크레딧 데이터 로드
function loadCompanyCreditsData() {
    const companyUsers = [currentCompanyAdmin, ...companyEmployees];
    const allUsageHistory = dataManager.getUsageHistory();
    
    // 회사 크레딧 현황 업데이트
    updateCompanyCreditsOverview(companyUsers, allUsageHistory);
    
    // 직원별 크레딧 현황 테이블 업데이트
    updateEmployeeCreditsTable(companyUsers);
}

// 회사 크레딧 현황 업데이트
function updateCompanyCreditsOverview(companyUsers, allUsageHistory) {
    const totalCredits = companyUsers.reduce((sum, user) => sum + user.credits, 0);
    
    const companyUsageHistory = allUsageHistory.filter(record => {
        return companyUsers.some(user => user.id === record.userId);
    });
    
    const totalUsed = companyUsageHistory.reduce((sum, record) => sum + record.credits, 0);
    
    // 이번 달 사용량
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyUsed = companyUsageHistory
        .filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
        })
        .reduce((sum, record) => sum + record.credits, 0);
    
    const overviewElement = document.getElementById('company-credits-overview');
    if (overviewElement) {
        overviewElement.innerHTML = `
            <div class="credits-stat">
                <h4>총 보유 크레딧</h4>
                <div class="stat-number">${totalCredits.toLocaleString()}</div>
            </div>
            <div class="credits-stat">
                <h4>총 사용 크레딧</h4>
                <div class="stat-number">${totalUsed.toLocaleString()}</div>
            </div>
            <div class="credits-stat">
                <h4>이번 달 사용</h4>
                <div class="stat-number">${monthlyUsed.toLocaleString()}</div>
            </div>
        `;
    }
}

// 직원별 크레딧 현황 테이블
function updateEmployeeCreditsTable(companyUsers) {
    const tableBody = document.getElementById('employee-credits-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    companyUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="employee-info">
                    <div class="employee-name">${user.name}</div>
                    <div class="employee-email">${user.email}</div>
                </div>
            </td>
            <td>${user.department || '미분류'}</td>
            <td class="credits">${user.credits.toLocaleString()}</td>
            <td class="actions">
                <button onclick="adjustEmployeeCredits('${user.id}')" class="btn btn-primary">
                    <i class="fas fa-coins"></i> 크레딧 조정
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 직원 크레딧 조정
function adjustEmployeeCredits(userId) {
    const user = dataManager.getUserById(userId);
    if (!user) return;
    
    const modal = document.getElementById('adjust-employee-credits-modal');
    if (modal) {
        document.getElementById('adjust-employee-id').value = userId;
        document.getElementById('adjust-employee-name').textContent = user.name;
        document.getElementById('employee-current-credits').textContent = user.credits.toLocaleString();
        document.getElementById('employee-credits-amount').value = '';
        document.getElementById('employee-credits-operation').value = 'add';
        
        modal.style.display = 'block';
    }
}

// 직원 크레딧 조정 실행
function executeEmployeeCreditsAdjustment() {
    const userId = document.getElementById('adjust-employee-id').value;
    const amount = parseInt(document.getElementById('employee-credits-amount').value);
    const operation = document.getElementById('employee-credits-operation').value;
    
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
        loadCompanyEmployees();
        loadCompanyCreditsData();
    } else {
        showAlert('크레딧 조정에 실패했습니다.', 'error');
    }
}

// 실시간 데이터 업데이트
function updateRealTimeData() {
    if (currentView === 'dashboard') {
        loadDashboardData();
    }
}

// 시간 포맷팅 함수
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

// 알림 시스템
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
function companyAdminLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        dataManager.logout();
        window.location.href = 'index.html';
    }
}