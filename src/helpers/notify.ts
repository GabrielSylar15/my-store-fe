export const isNotifyWhenFail = (response: any): boolean => {
    const status = response?.status;
    const code = response?.data?.errorCode;

    if ([422, 400, 403, 402].includes(status)) return false;
    return !['TOKEN_EXPIRED', 'INVALID_SESSION'].includes(code);
};
