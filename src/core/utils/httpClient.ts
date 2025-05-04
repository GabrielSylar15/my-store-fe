import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {getAccessToken, removeToken} from "@/core";
import {message} from "ant-design-vue";
import {isNotifyWhenFail, jsonDecode} from "@/helpers";

interface Constructor {
    baseURL: string;
    headers?: any;
    isTransform?: boolean;
    isLogout?: boolean;
}

export class HttpClient {
    baseURL: string;
    headers: any;
    isTransform?: boolean = false;
    isRefreshToken: boolean = false;
    isLogout?: boolean = false;

    constructor({baseURL, headers, isTransform, isLogout}: Constructor) {
        this.baseURL = baseURL;
        this.headers = headers;
        this.isTransform = isTransform;
        this.isLogout = isLogout;
    }

    public create(): AxiosInstance {
        const apiClient = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...this.headers,
            }
        });

        apiClient.interceptors.request.use((config) => {
            const token = getAccessToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            config.transformResponse = [(data) => data];
            return config;
        });

        apiClient.interceptors.response.use((response): any => {
            response.data = jsonDecode(response.data);
            if (isNotifyWhenFail(response)) {
                message.error(response.data?.message).then(() => {
                });
            }
            return this.transformResponse(response);
        }, (error) => {
            const originalRequest: any = error.config;
            const statusCode: any = error?.response?.status;
            const errorResponse: any = error?.response || {};
            errorResponse.data = jsonDecode(errorResponse.data);

            if (isNotifyWhenFail(error)) {
                message.error(errorResponse.data?.message).then(() => {
                });
            }

            if (statusCode === 401) {
                if (originalRequest._retry) {
                    return this.rejectErrorAndClearToken(error);
                }

                originalRequest._retry = true;
                return this.rejectErrorAndClearToken(error);
            }

            return this.transformError(error);
        });

        return apiClient;
    }

    private rejectErrorAndClearToken(err: AxiosError) {
        removeToken()
        if (this.isLogout) {
            window.location.href = `/login?returnUrl=${encodeURIComponent(
                window.location.href.replace(window.location.origin, ''),
            )}`;
        }
        return this.transformError(err);
    }

    private transformError(err: AxiosError<any, any>): any {
        const res = err.response;
        const resData = res?.data || {};
        return {
            success: false,
            error: true,
            data: resData.data,
            statusCode: res?.status || err.code,
            message: resData.message || err.message,
            rawResponse: res,
        };
    }

    private transformResponse(res: AxiosResponse) {
        if (this.isTransform) {
            return res;
        }

        const resData = res.data || {};
        const success = !!resData.success;
        return {
            success,
            error: !success,
            data: resData.data,
            statusCode: res?.status,
            message: resData.message,
            rawResponse: res,
        };
    }
}