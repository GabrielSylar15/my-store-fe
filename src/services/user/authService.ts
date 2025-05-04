import {httpClient, setAccessToken} from '@/core';

class AuthService {
    redirectToGoogleOAuth(): void {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI);
        const scope = encodeURIComponent(
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
        );

        const url = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=${scope}&access_type=offline&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow`;

        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            url,
            "GoogleOAuthPopup",
            `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
        );
    }

    login(): void {
        alert("Đăng nhập thành công");
    }

    loginWithGoogle(): void {
        window.addEventListener("message", (event) => {
            if (event.data?.type === "google-auth-success") {
                const accessToken = event.data.token;
                setAccessToken({accessToken});
                const urlParams = new URLSearchParams(window.location.search);
                window.location.href = urlParams.get("returnUrl") || "/";
            }
        });
    }

    async handleOAuthCallback(): Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) return;

        try {
            const response = await httpClient.get(`/api/v1/users/auth/callback?code=${code}`);
            console.log(response);
            if (window.opener) {
                window.opener.postMessage({
                    type: "google-auth-success",
                    accessToken: response.data.token
                }, "*");
            }
            window.close();
        } catch (error: any) {
            console.error("OAuth error:", error);
            alert("Đăng nhập Google thất bại.");
        }
    }
}

export const authService = new AuthService();
