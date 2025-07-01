// 현재 표시되는 페이지 상태 관리
let currentPage = 'dashboard';
let selectedPackage = null;
let isLoggedIn = false;
let currentUser = null;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    checkLoginStatus();
    
    // 페이지 표시
    if (!isLoggedIn) {
        showHomePage();
    } else {
        showDashboard();
        updateUserInfo();
    }
    updateNavigation();
    loadAgents();
});

// 로그인 상태 확인
function checkLoginStatus() {
    currentUser = dataManager.getCurrentUser();
    isLoggedIn = !!currentUser;
    
    // 관리자 계정인 경우 해당 페이지로 리다이렉트
    if (currentUser) {
        if (currentUser.role === 'admin') {
            window.location.href = 'admin.html';
            return;
        } else if (currentUser.role === 'company_admin') {
            window.location.href = 'company-admin.html';
            return;
        }
    }
}

// 페이지 전환 함수들
function showDashboard() {
    hideAllPages();
    document.getElementById('dashboard').style.display = 'block';
    currentPage = 'dashboard';
    updateNavigation();
    updateUserInfo();
    loadAgents();
}

function showLoginPage() {
    hideAllPages();
    document.getElementById('login-page').style.display = 'block';
    currentPage = 'login';
    updateNavigation();
}

function showAgentPage() {
    hideAllPages();
    document.getElementById('agent-page').style.display = 'block';
    currentPage = 'agent';
}

function showCreditCharge() {
    hideAllPages();
    document.getElementById('credit-page').style.display = 'block';
    currentPage = 'credit';
    updateUserInfo(); // 크레딧 페이지에서도 사용자 정보 업데이트
}

function hideAllPages() {
    const pages = ['home-page', 'dashboard', 'login-page', 'agent-page', 'credit-page'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            page.style.display = 'none';
        }
    });
}

function showHomePage() {
    hideAllPages();
    document.getElementById('home-page').style.display = 'block';
    currentPage = 'home';
    updateNavigation();
}

function goBack() {
    if (currentPage === 'agent' || currentPage === 'credit') {
        showDashboard();
    }
}

// 로그인/회원가입 탭 전환
function showLoginTab() {
    document.getElementById('login-tab').style.display = 'block';
    document.getElementById('register-tab').style.display = 'none';
    
    // 탭 버튼 활성화 상태 변경
    const tabs = document.querySelectorAll('.tab-btn');
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
    
    // 폼 리셋
    document.getElementById('login-form').reset();
}

function showRegisterTab() {
    document.getElementById('login-tab').style.display = 'none';
    document.getElementById('register-tab').style.display = 'block';
    
    // 탭 버튼 활성화 상태 변경
    const tabs = document.querySelectorAll('.tab-btn');
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
    
    // 폼 리셋
    document.getElementById('register-form').reset();
    toggleCompanyFields('individual');
}

// 회사 계정 필드 토글
function toggleCompanyFields(accountType) {
    const companyFields = document.getElementById('company-fields');
    if (accountType === 'company') {
        companyFields.style.display = 'block';
    } else {
        companyFields.style.display = 'none';
    }
}

// 로그인 폼 제출
function submitLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAlert('이메일과 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    if (handleLogin(email, password)) {
        // 로그인 성공 시 폼 초기화
        document.getElementById('login-form').reset();
    }
}

// 회원가입 폼 제출
function submitRegister(event) {
    event.preventDefault();
    
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (password !== passwordConfirm) {
        showAlert('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('비밀번호는 6자 이상이어야 합니다.', 'error');
        return;
    }
    
    const accountType = document.getElementById('account-type').value;
    const formData = {
        accountType: accountType,
        name: document.getElementById('register-name').value.trim(),
        email: document.getElementById('register-email').value.trim(),
        password: password,
        role: accountType === 'company' ? 'company_admin' : 'user'
    };
    
    // 회사 계정인 경우 추가 정보
    if (accountType === 'company') {
        formData.companyName = document.getElementById('company-name').value.trim();
        formData.businessNumber = document.getElementById('business-number').value.trim();
        formData.department = document.getElementById('department').value.trim();
        formData.position = document.getElementById('position').value.trim();
    }
    
    if (handleRegister(formData)) {
        // 회원가입 성공 시 폼 초기화
        document.getElementById('register-form').reset();
        toggleCompanyFields('individual');
    }
}

// AI 에이전트 실행 페이지 열기
function openAgent(agentId) {
    const agent = dataManager.getAgentById(agentId);
    if (!agent) {
        showAlert('에이전트를 찾을 수 없습니다.', 'error');
        return;
    }
    
    // 로그인 확인
    if (!isLoggedIn) {
        showAlert('로그인이 필요합니다.', 'warning');
        showLoginPage();
        return;
    }
    
    // 크레딧 확인
    if (currentUser.credits < agent.credits) {
        showAlert(`크레딧이 부족합니다. 필요 크레딧: ${agent.credits}, 보유 크레딧: ${currentUser.credits}`, 'warning');
        showCreditCharge();
        return;
    }
    
    // 에이전트 정보 업데이트
    document.getElementById('agent-title').textContent = agent.title;
    document.getElementById('agent-description').textContent = agent.description;
    document.getElementById('required-credits').textContent = agent.credits;
    
    // 현재 에이전트 ID 저장
    window.currentAgentId = agentId;
    
    // 아이콘 업데이트
    const agentIcon = document.querySelector('.agent-header .agent-icon i');
    if (agentIcon) {
        agentIcon.className = agent.icon;
    }
    
    // 입력 폼 초기화
    const inputField = document.getElementById('agent-input');
    if (inputField) {
        inputField.value = '';
    }
    
    // 결과 영역 초기화
    const resultArea = document.getElementById('agent-result');
    if (resultArea) {
        resultArea.style.display = 'none';
    }
    
    showAgentPage();
}

// 크레딧 패키지 선택
function selectPackage(credits, price) {
    selectedPackage = { credits, price };
    
    // 모든 패키지 카드에서 선택 상태 제거
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 클릭된 패키지 카드에 선택 상태 추가
    event.currentTarget.classList.add('selected');
    
    // 결제 요약 정보 업데이트
    document.getElementById('selected-package').textContent = `${credits} 크레딧`;
    document.getElementById('payment-amount').textContent = `${price.toLocaleString()}원`;
}

// 결제 처리
function processPayment() {
    if (!selectedPackage) {
        showAlert('크레딧 패키지를 선택해주세요.', 'warning');
        return;
    }
    
    if (!isLoggedIn || !currentUser) {
        showAlert('로그인이 필요합니다.', 'warning');
        showLoginPage();
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) {
        showAlert('결제 수단을 선택해주세요.', 'warning');
        return;
    }
    
    // 결제 시뮬레이션
    const loadingElement = document.querySelector('.payment-loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    setTimeout(() => {
        // 크레딧 추가
        const updatedUser = dataManager.addCredits(currentUser.id, selectedPackage.credits);
        if (updatedUser) {
            currentUser = updatedUser;
            // 현재 사용자 정보 업데이트
            localStorage.setItem('agenthub_current_user', JSON.stringify(currentUser));
            
            showAlert(`${selectedPackage.credits} 크레딧이 충전되었습니다!`, 'success');
            updateUserInfo();
            
            // 선택 상태 초기화
            selectedPackage = null;
            document.querySelectorAll('.package-card').forEach(card => {
                card.classList.remove('selected');
            });
            document.getElementById('selected-package').textContent = '선택된 패키지 없음';
            document.getElementById('payment-amount').textContent = '0원';
            
            // 결제 방법 선택 해제
            document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
                radio.checked = false;
            });
        } else {
            showAlert('크레딧 충전에 실패했습니다.', 'error');
        }
        
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }, 2000);
}

function getPaymentMethodName(method) {
    const methods = {
        'card': '신용/체크카드',
        'bank': '계좌이체',
        'phone': '휴대폰 결제',
        'kakao': '카카오페이',
        'naver': '네이버페이'
    };
    return methods[method] || method;
}

// AI 에이전트 실행
function executeAgent() {
    if (!isLoggedIn || !currentUser) {
        showAlert('로그인이 필요합니다.', 'warning');
        return;
    }
    
    const agentId = window.currentAgentId;
    const agent = dataManager.getAgentById(agentId);
    
    if (!agent) {
        showAlert('에이전트 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    const input = document.getElementById('agent-input').value.trim();
    if (!input) {
        showAlert('입력 내용을 작성해주세요.', 'warning');
        return;
    }
    
    // 크레딧 확인
    if (currentUser.credits < agent.credits) {
        showAlert(`크레딧이 부족합니다. 필요: ${agent.credits}, 보유: ${currentUser.credits}`, 'warning');
        return;
    }
    
    // 로딩 상태 표시
    const executeBtn = document.querySelector('.execute-btn');
    const originalText = executeBtn.textContent;
    executeBtn.textContent = '실행 중...';
    executeBtn.disabled = true;
    
    // AI 에이전트 실행 시뮬레이션
    setTimeout(() => {
        // 크레딧 차감
        const updatedUser = dataManager.deductCredits(currentUser.id, agent.credits);
        if (updatedUser) {
            currentUser = updatedUser;
            localStorage.setItem('agenthub_current_user', JSON.stringify(currentUser));
            
            // 사용 기록 추가
            dataManager.addUsageRecord(currentUser.id, agentId, agent.credits);
            
            // 결과 생성 및 표시
            const result = generateMockResult(agent.title, input);
            displayAgentResult(result);
            
            // 사용자 정보 업데이트
            updateUserInfo();
            
            showAlert('AI 에이전트 실행이 완료되었습니다!', 'success');
        } else {
            showAlert('크레딧 차감에 실패했습니다.', 'error');
        }
        
        // 버튼 상태 복원
        executeBtn.textContent = originalText;
        executeBtn.disabled = false;
    }, 3000);
}

// 에이전트 결과 표시
function displayAgentResult(result) {
    const resultArea = document.getElementById('agent-result');
    const resultContent = document.getElementById('result-content');
    
    if (resultArea && resultContent) {
        resultContent.innerHTML = result;
        resultArea.style.display = 'block';
        
        // 결과 영역으로 스크롤
        resultArea.scrollIntoView({ behavior: 'smooth' });
    }
}

function getCurrentAgentId() {
    return window.currentAgentId;
}

function generateMockResult(agentTitle, input) {
    const results = {
        '회의록 자동화 AI': `
            <h3>📋 회의록</h3>
            <div class="result-section">
                <h4>회의 정보</h4>
                <ul>
                    <li><strong>날짜:</strong> ${new Date().toLocaleDateString('ko-KR')}</li>
                    <li><strong>참석자:</strong> ${currentUser.name} 외 3명</li>
                    <li><strong>주제:</strong> ${input}</li>
                </ul>
            </div>
            <div class="result-section">
                <h4>주요 논의사항</h4>
                <ol>
                    <li>프로젝트 진행 현황 검토</li>
                    <li>예산 배정 및 리소스 배분</li>
                    <li>일정 조정 및 마일스톤 설정</li>
                </ol>
            </div>
            <div class="result-section">
                <h4>결정사항</h4>
                <ul>
                    <li>다음 주까지 프로토타입 완성</li>
                    <li>추가 인력 2명 투입 결정</li>
                    <li>주간 진행 상황 보고 미팅 신설</li>
                </ul>
            </div>
        `,
        '이메일 작성 AI': `
            <h3>📧 생성된 이메일</h3>
            <div class="result-section">
                <div class="email-content">
                    <p><strong>제목:</strong> ${input} 관련 문의</p>
                    <br>
                    <p>안녕하세요,</p>
                    <br>
                    <p>${input}에 대해 문의드리고자 연락드립니다.</p>
                    <br>
                    <p>구체적으로 다음 사항들에 대해 알고 싶습니다:</p>
                    <ul>
                        <li>세부 진행 과정 및 일정</li>
                        <li>필요한 준비사항</li>
                        <li>예상 소요 시간</li>
                    </ul>
                    <br>
                    <p>빠른 시일 내에 답변 주시면 감사하겠습니다.</p>
                    <br>
                    <p>감사합니다.</p>
                    <p>${currentUser.name} 드림</p>
                </div>
            </div>
        `,
        'AI PPT 슬라이드 생성기': `
            <h3>🎯 PPT 슬라이드 구성안</h3>
            <div class="result-section">
                <h4>제목: ${input}</h4>
                <ol>
                    <li><strong>표지 슬라이드</strong>
                        <ul><li>제목, 부제목, 발표자, 날짜</li></ul>
                    </li>
                    <li><strong>목차</strong>
                        <ul><li>발표 순서 및 주요 내용</li></ul>
                    </li>
                    <li><strong>현황 분석</strong>
                        <ul><li>현재 상황 및 문제점 파악</li></ul>
                    </li>
                    <li><strong>해결방안</strong>
                        <ul><li>구체적인 솔루션 제시</li></ul>
                    </li>
                    <li><strong>기대효과</strong>
                        <ul><li>예상 성과 및 ROI</li></ul>
                    </li>
                    <li><strong>실행계획</strong>
                        <ul><li>단계별 추진 일정</li></ul>
                    </li>
                    <li><strong>마무리</strong>
                        <ul><li>요약 및 Q&A</li></ul>
                    </li>
                </ol>
            </div>
        `
    };
    
    return results[agentTitle] || `
        <h3>🤖 AI 분석 결과</h3>
        <div class="result-section">
            <p><strong>입력 내용:</strong> ${input}</p>
            <p><strong>분석 완료:</strong> ${new Date().toLocaleString('ko-KR')}</p>
            <p><strong>처리 결과:</strong> 요청하신 내용에 대한 AI 분석이 완료되었습니다. 상세한 결과를 확인해보세요.</p>
        </div>
    `;
}

function getMockContent(agentTitle) {
    const contents = {
        '회의록 자동화 AI': '2024년 2분기 마케팅 전략 회의록이 생성되었습니다. 주요 결정사항: 디지털 마케팅 예산 20% 증액, 인플루언서 마케팅 강화...',
        '이메일 작성 AI': '비즈니스 이메일이 작성되었습니다. 제목: "2분기 프로젝트 진행 현황 안내", 내용: 안녕하세요. 2분기 프로젝트의 현재 진행 상황을...',
        'AI PPT 슬라이드 생성기': '총 15장의 프레젠테이션 슬라이드가 생성되었습니다. 표지, 목차, 현황 분석, 전략 수립, 실행 계획 등의 구성으로...',
        '음성파일 기반 문서 자동화': '음성 파일이 텍스트로 변환되고 문서화되었습니다. 총 1,250단어, 3페이지 분량의 회의 내용이 정리되었습니다...',
        '리뷰 분석 AI': '총 500개의 고객 리뷰를 분석했습니다. 긍정 리뷰 72%, 부정 리뷰 28%. 주요 키워드: 품질 우수, 빠른 배송, 친절한 서비스...',
        '키워드 분석': '키워드 "AI 마케팅" 분석 완료. 월간 검색량 45,000회, 경쟁도 중간, 관련 키워드 120개 발견...',
        'SNS 이벤트 기획 AI': 'SNS 이벤트 기획안이 생성되었습니다. 이벤트명: "AI와 함께하는 스마트 라이프", 기간: 2주, 예상 참여자: 5,000명...',
        '광고 문구 분석 및 제안': '현재 광고 문구의 CTR 3.2% 분석 완료. 개선된 문구 5개 제안. 예상 CTR 향상률 40%...',
        'AI 카드뉴스 생성기': '총 8장의 카드뉴스가 생성되었습니다. 테마: 친환경 라이프스타일, 컬러: 그린&화이트, 해시태그 20개 포함...',
        'AI 블로그 생성기': 'SEO 최적화된 블로그 포스팅이 생성되었습니다. 제목: "2024년 AI 트렌드 완벽 가이드", 2,500단어, 메타 설명 포함...'
    };
    
    return contents[agentTitle] || 'AI 에이전트가 성공적으로 작업을 완료했습니다.';
}

function showProfile() {
    showAlert('프로필 페이지는 준비 중입니다.', 'info');
}

function showCreditManagement() {
    showCreditCharge();
}

function logout() {
    dataManager.logout();
    currentUser = null;
    isLoggedIn = false;
    showHomePage();
    updateNavigation();
    showAlert('로그아웃되었습니다.', 'info');
}

function updateNavigation() {
    const guestMenu = document.getElementById('nav-menu-guest');
    const loggedInMenu = document.getElementById('nav-menu-logged-in');
    
    if (isLoggedIn && currentUser) {
        // 게스트 메뉴 숨기기
        if (guestMenu) guestMenu.style.display = 'none';
        
        // 로그인된 사용자 메뉴 표시
        if (loggedInMenu) {
            loggedInMenu.style.display = 'flex';
            
            // 사용자 이름 업데이트
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name;
            }
            
            // 크레딧 정보 업데이트
            const creditAmountElement = document.getElementById('credit-amount');
            if (creditAmountElement) {
                creditAmountElement.textContent = currentUser.credits.toLocaleString();
            }
        }
    } else {
        // 로그인되지 않은 상태
        if (guestMenu) guestMenu.style.display = 'flex';
        if (loggedInMenu) loggedInMenu.style.display = 'none';
    }
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 로그인 처리
function handleLogin(email, password) {
    const user = dataManager.authenticate(email, password);
    
    if (user) {
        currentUser = user;
        isLoggedIn = true;
        
        // 관리자 계정 체크 및 리다이렉트
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
            return true;
        } else if (user.role === 'company_admin') {
            window.location.href = 'company-admin.html';
            return true;
        }
        
        showAlert(`환영합니다, ${user.name}님!`, 'success');
        showDashboard();
        updateNavigation();
        return true;
    } else {
        showAlert('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
        return false;
    }
}

// 회원가입 처리
function handleRegister(formData) {
    // 입력 검증
    if (!formData.name || !formData.email || !formData.password) {
        showAlert('모든 필수 항목을 입력해주세요.', 'error');
        return false;
    }
    
    // 이메일 중복 체크
    if (dataManager.getUserByEmail(formData.email)) {
        showAlert('이미 사용 중인 이메일입니다.', 'error');
        return false;
    }
    
    // 회사 계정인 경우 추가 검증
    if (formData.accountType === 'company') {
        if (!formData.companyName || !formData.businessNumber) {
            showAlert('회사명과 사업자번호를 입력해주세요.', 'error');
            return false;
        }
    }
    
    // 기본 크레딧 설정
    formData.credits = formData.accountType === 'company' ? 5000 : 1000;
    
    // 사용자 생성
    const newUser = dataManager.createUser(formData);
    
    if (newUser) {
        showAlert('회원가입이 완료되었습니다! 로그인해주세요.', 'success');
        showLoginTab();
        return true;
    } else {
        showAlert('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
        return false;
    }
}

// 사용자 정보 업데이트
function updateUserInfo() {
    if (!isLoggedIn || !currentUser) return;
    
    // 현재 사용자 정보 새로고침
    const refreshedUser = dataManager.getUserById(currentUser.id);
    if (refreshedUser) {
        currentUser = refreshedUser;
        localStorage.setItem('agenthub_current_user', JSON.stringify(currentUser));
    }
    
    // 네비게이션의 사용자 정보 업데이트
    updateNavigation();
    
    // 대시보드의 사용자 정보 업데이트 (있을 경우)
    const userCreditsElement = document.getElementById('user-credits');
    if (userCreditsElement) {
        userCreditsElement.textContent = currentUser.credits.toLocaleString();
    }
}

// 에이전트 목록 로드
function loadAgents() {
    const agents = dataManager.getAgents();
    const categories = ['일반사무', '마케팅/광고', '콘텐츠 제작'];
    
    categories.forEach(category => {
        const categoryAgents = agents.filter(agent => agent.category === category && agent.status === 'active');
        const container = document.getElementById(`${getCategoryId(category)}-agents`);
        
        if (container) {
            container.innerHTML = '';
            categoryAgents.forEach(agent => {
                const agentCard = createAgentCard(agent);
                container.appendChild(agentCard);
            });
        }
    });
}

function getCategoryId(category) {
    const categoryMap = {
        '일반사무': 'business',
        '마케팅/광고': 'marketing',
        '콘텐츠 제작': 'content'
    };
    return categoryMap[category] || 'other';
}

function createAgentCard(agent) {
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.onclick = () => openAgent(agent.id);
    
    card.innerHTML = `
        <div class="agent-icon">
            <i class="${agent.icon}"></i>
        </div>
        <h3>${agent.title}</h3>
        <p>${agent.description}</p>
        <div class="agent-info">
            <span class="credits">${agent.credits} 크레딧</span>
            <span class="usage">사용 ${agent.usage}회</span>
        </div>
        <button class="agent-btn">실행하기</button>
    `;
    
    return card;
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

function downloadResult() {
    const resultContent = document.getElementById('result-content');
    if (!resultContent) {
        showAlert('다운로드할 결과가 없습니다.', 'warning');
        return;
    }
    
    const content = resultContent.innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent_result_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showAlert('결과가 다운로드되었습니다.', 'success');
}

function retryAgent() {
    executeAgent();
}