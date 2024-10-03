import axios, { type AxiosInstance, type AxiosError } from "axios";

export class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: "https://pokeapi.co/api/v2",
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error(errorMessage);
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public get client(): AxiosInstance {
    return this.api;
  }
}
