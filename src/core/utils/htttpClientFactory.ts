import {AxiosInstance} from "axios";
import {HttpClient} from "@/core/utils/httpClient";

export const httpClient: AxiosInstance = new HttpClient({
    baseURL: import.meta.env.VITE_API_BASE_URL,
}).create();

