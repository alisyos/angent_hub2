// 현재 표시되는 페이지 상태 관리
let currentPage = 'dashboard';
let selectedPackage = null;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    showDashboard();
});

// 페이지 전환 함수들
function showDashboard() {
    hideAllPages();
    document.getElementById('dashboard').style.display = 'block';
    currentPage = 'dashboard';
}

function showLoginPage() {
    hideAllPages();
    document.getElementById('login-page').style.display = 'block';
    currentPage = 'login';
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
}

function hideAllPages() {
    const pages = ['dashboard', 'login-page', 'agent-page', 'credit-page'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            page.style.display = 'none';
        }
    });
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
}

function showRegisterTab() {
    document.getElementById('login-tab').style.display = 'none';
    document.getElementById('register-tab').style.display = 'block';
    
    // 탭 버튼 활성화 상태 변경
    const tabs = document.querySelectorAll('.tab-btn');
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
}

// 회사 계정 필드 토글
function toggleCompanyFields(accountType) {
    const companyFields = document.querySelector('.company-fields');
    if (accountType === 'company') {
        companyFields.style.display = 'block';
    } else {
        companyFields.style.display = 'none';
    }
}

// AI 에이전트 실행 페이지 열기
function openAgent(agentType) {
    const agentData = getAgentData(agentType);
    
    // 에이전트 정보 업데이트
    document.getElementById('agent-title').textContent = agentData.title;
    document.getElementById('agent-description').textContent = agentData.description;
    document.getElementById('required-credits').textContent = agentData.credits;
    
    // 아이콘 업데이트
    const agentIcon = document.querySelector('.agent-header .agent-icon i');
    agentIcon.className = agentData.icon;
    
    showAgentPage();
}

// 에이전트 데이터 가져오기
function getAgentData(agentType) {
    const agents = {
        'meeting-notes': {
            title: '회의록 자동화 AI',
            description: '회의 내용을 체계적인 회의록으로 자동 변환',
            icon: 'fas fa-file-alt',
            credits: 15
        },
        'email-writer': {
            title: '이메일 작성 AI',
            description: '목적에 맞는 전문적인 이메일 자동 작성',
            icon: 'fas fa-envelope',
            credits: 10
        },
        'ppt-generator': {
            title: 'AI PPT 슬라이드 생성기',
            description: '내용을 바탕으로 전문적인 프레젠테이션 생성',
            icon: 'fas fa-presentation',
            credits: 25
        },
        'voice-document': {
            title: '음성파일 기반 문서 자동화',
            description: '음성 파일을 다양한 문서 형태로 변환',
            icon: 'fas fa-microphone',
            credits: 20
        },
        'review-analysis': {
            title: '리뷰 분석 AI',
            description: '고객 리뷰를 분석하여 인사이트 제공',
            icon: 'fas fa-chart-line',
            credits: 18
        },
        'keyword-analysis': {
            title: '키워드 분석',
            description: '키워드 트렌드와 경쟁 상황 분석',
            icon: 'fas fa-search',
            credits: 22
        },
        'sns-event': {
            title: 'SNS 이벤트 기획 AI',
            description: '효과적인 SNS 이벤트 기획안 생성',
            icon: 'fas fa-calendar-star',
            credits: 30
        },
        'ad-analysis': {
            title: '광고 문구 분석 및 제안',
            description: '광고 효과 분석 및 개선안 제안',
            icon: 'fas fa-ad',
            credits: 28
        },
        'card-news': {
            title: 'AI 카드뉴스 생성기',
            description: '매력적인 카드뉴스 콘텐츠 자동 생성',
            icon: 'fas fa-images',
            credits: 35
        },
        'blog-generator': {
            title: 'AI 블로그 생성기',
            description: 'SEO 최적화된 블로그 포스팅 자동 생성',
            icon: 'fas fa-blog',
            credits: 25
        }
    };
    
    return agents[agentType] || agents['meeting-notes'];
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
        alert('크레딧 패키지를 선택해주세요.');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // 실제로는 결제 API를 호출하지만, 목업에서는 성공 메시지만 표시
    alert(`${selectedPackage.credits} 크레딧 결제가 완료되었습니다!\n결제 방법: ${getPaymentMethodName(paymentMethod)}\n결제 금액: ${selectedPackage.price.toLocaleString()}원`);
    
    // 크레딧 잔액 업데이트 (시뮬레이션)
    updateCreditBalance(selectedPackage.credits);
    
    // 대시보드로 돌아가기
    showDashboard();
}

// 결제 방법 이름 반환
function getPaymentMethodName(method) {
    const methods = {
        'card': '신용카드/체크카드',
        'naverpay': '네이버페이',
        'kakaopay': '카카오페이',
        'tosspay': '토스페이'
    };
    return methods[method] || '신용카드';
}

// 크레딧 잔액 업데이트
function updateCreditBalance(additionalCredits) {
    const creditElements = document.querySelectorAll('#credit-amount, .credit-balance strong');
    creditElements.forEach(element => {
        const currentCredits = parseInt(element.textContent.replace(/,/g, ''));
        const newCredits = currentCredits + additionalCredits;
        element.textContent = newCredits.toLocaleString();
    });
}

// 네비게이션 메뉴 함수들
function showProfile() {
    alert('프로필 관리 페이지로 이동합니다.');
}

function showCreditManagement() {
    showCreditCharge();
}

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        showLoginPage();
    }
}

// AI 에이전트 실행 시뮬레이션
document.addEventListener('DOMContentLoaded', function() {
    const executeBtn = document.querySelector('.execute-btn');
    if (executeBtn) {
        executeBtn.addEventListener('click', function() {
            const resultSection = document.querySelector('.result-placeholder');
            const requiredCredits = parseInt(document.getElementById('required-credits').textContent);
            const currentCredits = parseInt(document.getElementById('credit-amount').textContent.replace(/,/g, ''));
            
            if (currentCredits < requiredCredits) {
                alert('크레딧이 부족합니다. 크레딧을 충전해주세요.');
                return;
            }
            
            // 로딩 상태 표시
            resultSection.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem; color: #667eea;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>AI가 작업을 수행하고 있습니다...</p>
                </div>
            `;
            
            // 3초 후 결과 표시 (시뮬레이션)
            setTimeout(() => {
                resultSection.innerHTML = `
                    <div style="text-align: left; padding: 1rem; background: white; border-radius: 8px; border: 1px solid #eee;">
                        <h4 style="color: #333; margin-bottom: 1rem;">📋 회의록</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong>회의 제목:</strong> 2024년 2분기 마케팅 전략 회의<br>
                            <strong>일시:</strong> 2024년 6월 26일 14:00-15:30<br>
                            <strong>참석자:</strong> 홍길동, 김철수, 이영희, 박민수
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>주요 안건:</strong>
                            <ul style="margin-left: 1rem;">
                                <li>2분기 마케팅 성과 검토</li>
                                <li>3분기 마케팅 전략 수립</li>
                                <li>신제품 출시 계획</li>
                            </ul>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <strong>결정 사항:</strong>
                            <ul style="margin-left: 1rem;">
                                <li>디지털 마케팅 예산 20% 증액</li>
                                <li>인플루언서 마케팅 강화</li>
                                <li>신제품 출시일 8월 15일 확정</li>
                            </ul>
                        </div>
                        <div class="result-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                            <button onclick="downloadResult()" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-download"></i> 다운로드
                            </button>
                            <button onclick="retryAgent()" style="padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-redo"></i> 다시 실행
                            </button>
                        </div>
                    </div>
                `;
                
                // 크레딧 차감
                updateCreditBalance(-requiredCredits);
                
                alert(`AI 에이전트 실행이 완료되었습니다!\n사용된 크레딧: ${requiredCredits}`);
            }, 3000);
        });
    }
});

// 결과 다운로드
function downloadResult() {
    alert('회의록이 다운로드되었습니다.');
}

// AI 에이전트 재실행
function retryAgent() {
    document.querySelector('.execute-btn').click();
}