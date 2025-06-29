export const isNotifyWhenFail = (response: any): boolean => {
    const status = response?.status;
    const code = response?.data?.errorCode;

    if (status >= 200 && status < 300) return false;

    if ([422, 400, 403, 402].includes(status)) return true;

    return !['TOKEN_EXPIRED', 'INVALID_SESSION'].includes(code);
};
