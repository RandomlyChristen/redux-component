import Component from "../../core/Component";

const CLIENT_ID = '87de37f9-bfd1-4161-af4a-8f666809d8ea';
const STATE = 'test';
const AUTH_URL = 'https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/authorize';
const ACCESS_TOKEN_URL = 'http://localhost:3000/access';
const REDIRECTION_URI = 'http://localhost:1234/'
const USER_INFO_URL = 'http://localhost:3000/info';

const getAuthUrl = () => {
    const authUrl = new URL(AUTH_URL);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('state', STATE);
    authUrl.searchParams.set('redirect_uri', REDIRECTION_URI);
    return authUrl;
};

const doAuth = () => {
    const authUrl = getAuthUrl();
    const popup = window.open(authUrl, 'Hyundai OAuth',
        'top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no');
    return new Promise((resolve, reject) => {
        const targetUrl = new URL(REDIRECTION_URI);
        const checker = setInterval(() => {
            try {
                const redirectionUrl = new URL(popup.location.href);
                if (targetUrl.pathname === redirectionUrl.pathname) {
                    const code = redirectionUrl.searchParams.get('code');
                    const state = redirectionUrl.searchParams.get('state');
                    resolve({ code, state });
                    popup.close();
                }
            } catch (e) {} finally {
                if (popup.closed) {
                    clearInterval(checker);
                    reject('authentication canceled');
                }
            }
        }, 1000);
    });
};

const getAccessToken = async (code) => {
    return (await fetch(`${ACCESS_TOKEN_URL}?code=${code}`, {
        cache: 'no-cache'
    })).json();
}

const getUserInfo = async (token) => {
    return (await fetch(USER_INFO_URL, {
        headers: {'Authorization': `Bearer ${token}`}
    })).json();
}

class AuthenticationViewer extends Component {
    template() {
        return `
        <h1 class="auth-code"></h1>
        <h1 class="state"></h1>
        <h1 class="access-token"></h1>
        <textarea class="user-info"></textarea>
        <button class="do-auth-btn">로그인</button>
        <button class="get-token-btn">토큰발급</button>
        <button class="get-userinfo-btn">사용자정보</button>
        `
    }

    initialize() {
        this.addEvent('click', '.do-auth-btn', this.startAuth.bind(this));
        this.addEvent('click', '.get-token-btn', this.getToken.bind(this));
        this.addEvent('click','.get-userinfo-btn', this.getUser.bind(this));
    }

    async startAuth() {
        const $authCode = this.$target.querySelector('.auth-code');
        const $state = this.$target.querySelector('.state');
        const { code, state } = await doAuth();
        $authCode.innerText = code;
        $state.innerHTML = state;
    }

    async getToken() {
        const $authCode = this.$target.querySelector('.auth-code');
        const $accessToken = this.$target.querySelector('.access-token');
        const code = $authCode.innerText;
        const { access_token, refresh_token, token_type, expires_in } = await getAccessToken(code);
        $accessToken.innerText = access_token;
        console.log(`refresh token : ${refresh_token}, token type : ${token_type}, expires_in : ${expires_in}`);
    }

    async getUser() {
        const $userInfo = this.$target.querySelector('.user-info');
        const $accessToken = this.$target.querySelector('.access-token');
        const userInfo = await getUserInfo($accessToken.innerText);
        $userInfo.value = JSON.stringify(userInfo);
    }
}

export default AuthenticationViewer;