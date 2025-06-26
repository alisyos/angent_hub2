// 관리자 페이지 스크립트

// 현재 활성 섹션
let currentSection = 'dashboard';

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
});

// 섹션 전환
function showSection(sectionName) {
    // 모든 섹션 숨기기
    const sections = document.querySelectorAll('.admin-section');
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
        'dashboard': '대시보드',
        'users': '회원 관리',
        'agents': 'AI 에이전트 관리',
        'credits': '크레딧 관리',
        'logs': '로그 및 통계',
        'settings': '시스템 설정'
    };
    
    document.getElementById('page-title').textContent = titles[sectionName] || '관리자 페이지';
    currentSection = sectionName;
}

// 회원 관리 함수들
function editUser(userId) {
    alert(`회원 ID ${userId}의 정보를 수정합니다.`);
}

function suspendUser(userId) {
    if (confirm(`회원 ID ${userId}를 정지하시겠습니까?`)) {
        alert('회원이 정지되었습니다.');
        // 실제로는 서버 API 호출
    }
}

function activateUser(userId) {
    if (confirm(`회원 ID ${userId}를 활성화하시겠습니까?`)) {
        alert('회원이 활성화되었습니다.');
        // 실제로는 서버 API 호출
    }
}

// AI 에이전트 관리 함수들
function addNewAgent() {
    const agentName = prompt('새로운 AI 에이전트 이름을 입력하세요:');
    if (agentName) {
        alert(`'${agentName}' 에이전트가 추가되었습니다.`);
        // 실제로는 서버 API 호출하여 에이전트 추가
    }
}

function editPrompt(agentId) {
    // 프롬프트 편집 모달 또는 페이지 열기
    const newPrompt = prompt('프롬프트를 수정하세요:');
    if (newPrompt) {
        alert(`${agentId} 에이전트의 프롬프트가 수정되었습니다.`);
        // 실제로는 서버 API 호출하여 프롬프트 업데이트
    }
}

function changeModel(agentId) {
    const models = ['GPT-4', 'GPT-4-mini', 'Claude-4-Sonnet', 'Claude-4-Haiku'];
    let modelOptions = '';
    models.forEach((model, index) => {
        modelOptions += `${index + 1}. ${model}\n`;
    });
    
    const choice = prompt(`사용할 LLM 모델을 선택하세요:\n${modelOptions}\n번호를 입력하세요:`);
    if (choice && choice >= 1 && choice <= models.length) {
        const selectedModel = models[choice - 1];
        alert(`${agentId} 에이전트의 모델이 ${selectedModel}로 변경되었습니다.`);
        // 실제로는 서버 API 호출하여 모델 변경
    }
}

function toggleAgent(agentId) {
    if (confirm(`${agentId} 에이전트를 비활성화하시겠습니까?`)) {
        alert('에이전트가 비활성화되었습니다.');
        // 실제로는 서버 API 호출하여 에이전트 상태 변경
    }
}

// 크레딧 관리 함수들
function addPackage() {
    const packageInfo = {
        credits: prompt('크레딧 수량을 입력하세요:'),
        price: prompt('가격을 입력하세요 (원):'),
        bonus: prompt('보너스 크레딧을 입력하세요 (선택사항):') || 0
    };
    
    if (packageInfo.credits && packageInfo.price) {
        alert(`새 패키지가 추가되었습니다:\n${packageInfo.credits} 크레딧 - ${packageInfo.price}원${packageInfo.bonus > 0 ? ` (+${packageInfo.bonus} 보너스)` : ''}`);
        // 실제로는 서버 API 호출하여 패키지 추가
    }
}

// 실시간 데이터 업데이트 시뮬레이션
function updateDashboardStats() {
    // 실제 환경에서는 WebSocket이나 주기적 API 호출로 실시간 데이터 업데이트
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        // 통계 숫자를 약간씩 증가시키는 시뮬레이션
        setInterval(() => {
            if (currentSection === 'dashboard') {
                stats.forEach((stat, index) => {
                    const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                    const increment = Math.floor(Math.random() * 5) + 1;
                    let newValue;
                    
                    switch(index) {
                        case 0: // 회원 수
                            newValue = currentValue + (Math.random() > 0.7 ? 1 : 0);
                            stat.textContent = newValue.toLocaleString();
                            break;
                        case 1: // AI 실행 횟수
                            newValue = currentValue + increment;
                            stat.textContent = newValue.toLocaleString();
                            break;
                        case 2: // 크레딧 사용량
                            newValue = currentValue + increment * 10;
                            stat.textContent = newValue.toLocaleString();
                            break;
                        case 3: // 매출
                            newValue = currentValue + increment * 1000;
                            stat.textContent = '₩' + newValue.toLocaleString();
                            break;
                    }
                });
            }
        }, 10000); // 10초마다 업데이트
    }
}

// 로그 추가 시뮬레이션
function addNewLog() {
    const logMessages = [
        { message: '새로운 사용자가 가입했습니다', type: 'info' },
        { message: 'AI 에이전트가 성공적으로 실행되었습니다', type: 'success' },
        { message: '크레딧 결제가 완료되었습니다', type: 'info' },
        { message: '시스템 백업이 완료되었습니다', type: 'success' },
        { message: 'API 호출 제한에 도달했습니다', type: 'warning' }
    ];
    
    setInterval(() => {
        if (currentSection === 'logs') {
            const logList = document.querySelector('.log-list');
            if (logList) {
                const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
                const now = new Date();
                const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                                 now.getMinutes().toString().padStart(2, '0');
                
                const logItem = document.createElement('div');
                logItem.className = 'log-item';
                logItem.innerHTML = `
                    <span class="log-time">${timeString}</span>
                    <span class="log-message">${randomLog.message}</span>
                    <span class="log-type ${randomLog.type}">${randomLog.type}</span>
                `;
                
                // 새 로그를 맨 위에 추가
                logList.insertBefore(logItem, logList.firstChild);
                
                // 로그가 너무 많아지면 오래된 것 제거
                if (logList.children.length > 10) {
                    logList.removeChild(logList.lastChild);
                }
            }
        }
    }, 15000); // 15초마다 새 로그 추가
}

// 검색 기능
function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 실시간 업데이트 시작
    updateDashboardStats();
    addNewLog();
    
    // 검색 기능 설정
    setupSearch();
    
    // 툴팁 초기화 (실제 환경에서는 툴팁 라이브러리 사용)
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // 툴팁 표시 로직
        });
    });
});

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + 숫자키로 섹션 빠른 전환
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const sections = ['dashboard', 'users', 'agents', 'credits', 'logs', 'settings'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            showSection(sections[sectionIndex]);
        }
    }
});

// 데이터 내보내기 함수
function exportData(type) {
    // 실제 환경에서는 서버에서 데이터를 가져와 CSV/Excel 파일로 변환
    alert(`${type} 데이터를 내보냅니다.`);
}

// 설정 저장 함수
function saveSetting(settingType, value) {
    // 실제 환경에서는 서버 API 호출하여 설정 저장
    alert(`${settingType} 설정이 저장되었습니다: ${value}`);
}

// 차트 데이터 생성 (실제 환경에서는 차트 라이브러리 사용)
function generateChartData() {
    // Chart.js, D3.js 등의 차트 라이브러리를 사용하여 실제 차트 생성
    // 여기서는 시뮬레이션만 표시
}

// 알림 시스템
function showNotification(message, type = 'info') {
    // 실제 환경에서는 토스트 알림 라이브러리 사용
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 알림을 화면에 표시하는 로직
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}