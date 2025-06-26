// 회사 관리자 페이지 스크립트

// 현재 활성 섹션
let currentSection = 'overview';

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    showSection('overview');
    initializeEventListeners();
});

// 섹션 전환
function showSection(sectionName) {
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('.company-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 모든 네비게이션 아이템 비활성화
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 선택된 섹션 보이기
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 해당 네비게이션 아이템 활성화
    const targetNavItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`).parentElement;
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
    
    // 페이지 제목 업데이트
    const titles = {
        'overview': '회사 대시보드',
        'employees': '직원 관리',
        'permissions': '권한 관리',
        'agents-settings': 'AI 에이전트 설정',
        'credits-manage': '크레딧 관리',
        'analytics': '사용 분석'
    };
    
    document.getElementById('page-title').textContent = titles[sectionName] || '회사 관리자';
    currentSection = sectionName;
}

// 직원 관리 함수들
function inviteEmployee() {
    const employeeData = {
        email: prompt('초대할 직원의 이메일을 입력하세요:'),
        department: prompt('부서를 입력하세요:'),
        position: prompt('직급을 입력하세요:')
    };
    
    if (employeeData.email && employeeData.department && employeeData.position) {
        alert(`${employeeData.email}로 초대 이메일이 발송되었습니다.\n부서: ${employeeData.department}\n직급: ${employeeData.position}`);
        // 실제로는 서버 API 호출하여 초대 이메일 발송
    }
}

function editEmployee(employeeId) {
    alert(`직원 ${employeeId}의 정보를 수정합니다.`);
    // 실제로는 직원 정보 수정 모달이나 페이지 열기
}

function suspendEmployee(employeeId) {
    if (confirm(`직원 ${employeeId}의 계정을 정지하시겠습니까?`)) {
        alert('직원 계정이 정지되었습니다.');
        // 실제로는 서버 API 호출하여 계정 정지
        updateEmployeeStatus(employeeId, 'suspended');
    }
}

function activateEmployee(employeeId) {
    if (confirm(`직원 ${employeeId}의 계정을 활성화하시겠습니까?`)) {
        alert('직원 계정이 활성화되었습니다.');
        // 실제로는 서버 API 호출하여 계정 활성화
        updateEmployeeStatus(employeeId, 'active');
    }
}

function updateEmployeeStatus(employeeId, status) {
    // DOM에서 해당 직원의 상태 업데이트
    const row = document.querySelector(`tr[data-employee="${employeeId}"]`);
    if (row) {
        const statusCell = row.querySelector('.status-active, .status-inactive');
        if (statusCell) {
            statusCell.className = status === 'active' ? 'status-active' : 'status-inactive';
            statusCell.textContent = status === 'active' ? '활성' : '비활성';
        }
    }
}

// 권한 관리 함수들
function editDepartmentPermissions(department) {
    alert(`${department} 부서의 권한을 수정합니다.`);
    // 실제로는 권한 설정 모달 열기
}

function editIndividualPermissions(employeeId) {
    alert(`직원 ${employeeId}의 개별 권한을 설정합니다.`);
    // 실제로는 개별 권한 설정 모달 열기
}

// 에이전트 설정 함수들
function initializeEventListeners() {
    // 에이전트 토글 스위치 이벤트 리스너
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const agentItem = this.closest('.agent-setting-item');
            const agentName = agentItem.querySelector('.agent-name').textContent;
            
            if (this.checked) {
                agentItem.classList.add('active');
                showNotification(`${agentName}이(가) 활성화되었습니다.`, 'success');
            } else {
                agentItem.classList.remove('active');
                showNotification(`${agentName}이(가) 비활성화되었습니다.`, 'info');
            }
            
            // 실제로는 서버 API 호출하여 에이전트 상태 변경
            updateAgentStatus(agentName, this.checked);
        });
    });
    
    // 권한 체크박스 이벤트 리스너
    const permissionCheckboxes = document.querySelectorAll('.permission-item input[type="checkbox"]');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const agentName = this.nextElementSibling.textContent;
            const department = this.closest('.department-item').querySelector('.department-name').textContent;
            
            if (this.checked) {
                showNotification(`${department}에 ${agentName} 권한이 추가되었습니다.`, 'success');
            } else {
                showNotification(`${department}에서 ${agentName} 권한이 제거되었습니다.`, 'warning');
            }
            
            // 권한 카운트 업데이트
            updatePermissionCount(department);
        });
    });
}

function updateAgentStatus(agentName, isActive) {
    // 실제 환경에서는 서버 API 호출
    console.log(`Agent ${agentName} status changed to: ${isActive ? 'active' : 'inactive'}`);
}

function updatePermissionCount(department) {
    const departmentItem = Array.from(document.querySelectorAll('.department-name'))
        .find(el => el.textContent === department)?.closest('.department-item');
    
    if (departmentItem) {
        const checkedBoxes = departmentItem.querySelectorAll('input[type="checkbox"]:checked').length;
        const totalBoxes = departmentItem.querySelectorAll('input[type="checkbox"]').length;
        const countElement = departmentItem.querySelector('.permission-count');
        
        if (countElement) {
            countElement.textContent = `${checkedBoxes}/${totalBoxes} 에이전트 허용`;
        }
    }
}

// 크레딧 관리 함수들
function chargeCredits() {
    const amount = prompt('충전할 크레딧 수량을 입력하세요:');
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        const currentCredits = parseInt(document.querySelector('.company-credit-info strong').textContent.replace(/,/g, ''));
        const newCredits = currentCredits + parseInt(amount);
        
        // 크레딧 잔액 업데이트
        document.querySelector('.company-credit-info strong').textContent = newCredits.toLocaleString();
        
        alert(`${parseInt(amount).toLocaleString()} 크레딧이 충전되었습니다.\n현재 잔액: ${newCredits.toLocaleString()} 크레딧`);
        
        // 실제로는 결제 페이지로 이동하거나 결제 API 호출
    }
}

// 알림 시스템
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 나타내기
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 실시간 데이터 업데이트 시뮬레이션
function updateCompanyStats() {
    setInterval(() => {
        if (currentSection === 'overview') {
            // 통계 숫자를 약간씩 업데이트하는 시뮬레이션
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach((stat, index) => {
                const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                let newValue;
                
                switch(index) {
                    case 0: // 활성 직원 수
                        // 직원 수는 거의 변하지 않음
                        break;
                    case 1: // AI 사용 횟수
                        newValue = currentValue + Math.floor(Math.random() * 3) + 1;
                        stat.textContent = newValue.toLocaleString();
                        break;
                    case 2: // 사용된 크레딧
                        newValue = currentValue + Math.floor(Math.random() * 10) + 5;
                        stat.textContent = newValue.toLocaleString();
                        break;
                    case 3: // 활성 에이전트
                        // 에이전트 수는 설정에 따라 변함
                        break;
                }
            });
        }
    }, 15000); // 15초마다 업데이트
}

// 차트 데이터 생성 (실제 환경에서는 차트 라이브러리 사용)
function generateAnalyticsChart() {
    // Chart.js, D3.js 등을 사용하여 실제 차트 구현
    // 여기서는 시뮬레이션만
}

// 검색 및 필터링 기능
function setupTableFiltering() {
    // 실제 환경에서는 테이블 검색/필터링 기능 구현
}

// 데이터 내보내기 기능
function exportEmployeeData() {
    alert('직원 데이터를 CSV 파일로 내보냅니다.');
    // 실제로는 CSV 파일 생성 및 다운로드
}

function exportUsageReport() {
    alert('사용량 보고서를 생성합니다.');
    // 실제로는 상세한 사용량 리포트 생성
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + 숫자키로 섹션 빠른 전환
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const sections = ['overview', 'employees', 'permissions', 'agents-settings', 'credits-manage', 'analytics'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            showSection(sections[sectionIndex]);
        }
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 실시간 업데이트 시작
    updateCompanyStats();
    
    // 테이블 필터링 설정
    setupTableFiltering();
    
    // 권한 카운트 초기화
    document.querySelectorAll('.department-name').forEach(departmentEl => {
        updatePermissionCount(departmentEl.textContent);
    });
});

// 회사 설정 관리
function updateCompanySettings(setting, value) {
    // 회사별 설정 저장
    alert(`회사 설정이 업데이트되었습니다: ${setting} = ${value}`);
}

// 사용량 한도 설정
function setUsageLimit(employeeId, limit) {
    alert(`직원 ${employeeId}의 일일 사용 한도가 ${limit}회로 설정되었습니다.`);
}

// 부서별 예산 관리
function manageDepartmentBudget(department) {
    const budget = prompt(`${department}의 월 예산을 설정하세요 (크레딧):`);
    if (budget && !isNaN(budget)) {
        alert(`${department}의 월 예산이 ${parseInt(budget).toLocaleString()} 크레딧으로 설정되었습니다.`);
    }
}