export const APP_ACCESS_TOKEN = 'app_access_token';
export const APP_REFRESH_TOKEN = 'app_refresh_token';

export const getAccessToken = (): string | null => {
    return localStorage.getItem(APP_ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(APP_REFRESH_TOKEN);
};

export const
    setAccessToken = (authInfo: any): void => {
    localStorage.setItem(APP_ACCESS_TOKEN, authInfo.token);
    localStorage.setItem(APP_REFRESH_TOKEN, authInfo.refresh_token);
}

export const removeToken = (): void => {
    localStorage.removeItem(APP_ACCESS_TOKEN);
    localStorage.removeItem(APP_REFRESH_TOKEN);
}
