// 전역 데이터 관리 시스템
class DataManager {
    constructor() {
        this.initializeData();
    }

    // 데이터 초기화
    initializeData() {
        // 기본 관리자 계정 생성
        if (!this.getUsers().length) {
            this.createDefaultAccounts();
        }
        
        // 기본 에이전트 데이터 생성
        if (!this.getAgents().length) {
            this.createDefaultAgents();
        }
    }

    // 기본 계정 생성
    createDefaultAccounts() {
        const defaultUsers = [
            {
                id: 'admin',
                email: 'admin@agenthub.com',
                password: 'admin123',
                name: '시스템 관리자',
                role: 'admin',
                accountType: 'admin',
                credits: 10000,
                createdAt: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 'company1',
                email: 'manager@company.com',
                password: 'company123',
                name: '김회사',
                role: 'company_admin',
                accountType: 'company',
                companyName: '테스트 회사',
                businessNumber: '123-45-67890',
                department: '마케팅팀',
                position: '팀장',
                credits: 5000,
                createdAt: new Date().toISOString(),
                status: 'active'
            },
            {
                id: 'user1',
                email: 'user@test.com',
                password: 'user123',
                name: '홍길동',
                role: 'user',
                accountType: 'individual',
                credits: 1250,
                createdAt: new Date().toISOString(),
                status: 'active'
            }
        ];

        localStorage.setItem('agenthub_users', JSON.stringify(defaultUsers));
    }

    // 기본 에이전트 생성
    createDefaultAgents() {
        const defaultAgents = [
            {
                id: 'meeting-notes',
                title: '회의록 자동화 AI',
                description: '회의 내용을 체계적인 회의록으로 자동 변환',
                icon: 'fas fa-file-alt',
                credits: 15,
                category: '일반사무',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'email-writer',
                title: '이메일 작성 AI',
                description: '목적에 맞는 전문적인 이메일 자동 작성',
                icon: 'fas fa-envelope',
                credits: 10,
                category: '일반사무',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'ppt-generator',
                title: 'AI PPT 슬라이드 생성기',
                description: '내용을 바탕으로 전문적인 프레젠테이션 생성',
                icon: 'fas fa-presentation',
                credits: 25,
                category: '일반사무',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'voice-document',
                title: '음성파일 기반 문서 자동화',
                description: '음성 파일을 다양한 문서 형태로 변환',
                icon: 'fas fa-microphone',
                credits: 20,
                category: '일반사무',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'review-analysis',
                title: '리뷰 분석 AI',
                description: '고객 리뷰를 분석하여 인사이트 제공',
                icon: 'fas fa-chart-line',
                credits: 18,
                category: '마케팅/광고',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'keyword-analysis',
                title: '키워드 분석',
                description: '키워드 트렌드와 경쟁 상황 분석',
                icon: 'fas fa-search',
                credits: 22,
                category: '마케팅/광고',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'sns-event',
                title: 'SNS 이벤트 기획 AI',
                description: '효과적인 SNS 이벤트 기획안 생성',
                icon: 'fas fa-calendar-star',
                credits: 30,
                category: '마케팅/광고',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'ad-analysis',
                title: '광고 문구 분석 및 제안',
                description: '광고 효과 분석 및 개선안 제안',
                icon: 'fas fa-ad',
                credits: 28,
                category: '마케팅/광고',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'card-news',
                title: 'AI 카드뉴스 생성기',
                description: '매력적인 카드뉴스 콘텐츠 자동 생성',
                icon: 'fas fa-images',
                credits: 35,
                category: '콘텐츠 제작',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            },
            {
                id: 'blog-generator',
                title: 'AI 블로그 생성기',
                description: 'SEO 최적화된 블로그 포스팅 자동 생성',
                icon: 'fas fa-blog',
                credits: 25,
                category: '콘텐츠 제작',
                status: 'active',
                createdAt: new Date().toISOString(),
                usage: 0
            }
        ];

        localStorage.setItem('agenthub_agents', JSON.stringify(defaultAgents));
    }

    // 사용자 관리
    getUsers() {
        const users = localStorage.getItem('agenthub_users');
        return users ? JSON.parse(users) : [];
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
            status: 'active',
            credits: userData.credits || 0
        };
        users.push(newUser);
        localStorage.setItem('agenthub_users', JSON.stringify(users));
        return newUser;
    }

    updateUser(userId, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('agenthub_users', JSON.stringify(users));
            return users[userIndex];
        }
        return null;
    }

    deleteUser(userId) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('agenthub_users', JSON.stringify(filteredUsers));
        return true;
    }

    // 에이전트 관리
    getAgents() {
        const agents = localStorage.getItem('agenthub_agents');
        return agents ? JSON.parse(agents) : [];
    }

    getAgentById(id) {
        const agents = this.getAgents();
        return agents.find(agent => agent.id === id);
    }

    createAgent(agentData) {
        const agents = this.getAgents();
        const newAgent = {
            id: Date.now().toString(),
            ...agentData,
            createdAt: new Date().toISOString(),
            usage: 0
        };
        agents.push(newAgent);
        localStorage.setItem('agenthub_agents', JSON.stringify(agents));
        return newAgent;
    }

    updateAgent(agentId, updates) {
        const agents = this.getAgents();
        const agentIndex = agents.findIndex(agent => agent.id === agentId);
        if (agentIndex !== -1) {
            agents[agentIndex] = { ...agents[agentIndex], ...updates };
            localStorage.setItem('agenthub_agents', JSON.stringify(agents));
            return agents[agentIndex];
        }
        return null;
    }

    deleteAgent(agentId) {
        const agents = this.getAgents();
        const filteredAgents = agents.filter(agent => agent.id !== agentId);
        localStorage.setItem('agenthub_agents', JSON.stringify(filteredAgents));
        return true;
    }

    // 사용 기록 관리
    getUsageHistory() {
        const history = localStorage.getItem('agenthub_usage_history');
        return history ? JSON.parse(history) : [];
    }

    addUsageRecord(userId, agentId, credits) {
        const history = this.getUsageHistory();
        const record = {
            id: Date.now().toString(),
            userId,
            agentId,
            credits,
            timestamp: new Date().toISOString()
        };
        history.push(record);
        localStorage.setItem('agenthub_usage_history', JSON.stringify(history));
        
        // 에이전트 사용 횟수 증가
        const agent = this.getAgentById(agentId);
        if (agent) {
            this.updateAgent(agentId, { usage: agent.usage + 1 });
        }
        
        return record;
    }

    // 인증 관리
    authenticate(email, password) {
        const user = this.getUserByEmail(email);
        if (user && user.password === password && user.status === 'active') {
            // 현재 사용자 정보 저장
            localStorage.setItem('agenthub_current_user', JSON.stringify(user));
            return user;
        }
        return null;
    }

    getCurrentUser() {
        const currentUser = localStorage.getItem('agenthub_current_user');
        return currentUser ? JSON.parse(currentUser) : null;
    }

    logout() {
        localStorage.removeItem('agenthub_current_user');
    }

    // 크레딧 관리
    addCredits(userId, amount) {
        const user = this.getUserById(userId);
        if (user) {
            const newCredits = user.credits + amount;
            return this.updateUser(userId, { credits: newCredits });
        }
        return null;
    }

    deductCredits(userId, amount) {
        const user = this.getUserById(userId);
        if (user && user.credits >= amount) {
            const newCredits = user.credits - amount;
            return this.updateUser(userId, { credits: newCredits });
        }
        return null;
    }

    // 데이터 초기화 (개발용)
    resetData() {
        localStorage.removeItem('agenthub_users');
        localStorage.removeItem('agenthub_agents');
        localStorage.removeItem('agenthub_usage_history');
        localStorage.removeItem('agenthub_current_user');
        this.initializeData();
    }
}

// 전역 데이터 매니저 인스턴스
const dataManager = new DataManager();

// 전역 접근을 위한 window 객체에 추가
window.dataManager = dataManager;