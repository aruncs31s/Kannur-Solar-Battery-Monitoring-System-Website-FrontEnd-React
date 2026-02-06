import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_BASE_URL = 'http://localhost:8080/api';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 
        'Accept': 'application/json'
        // Note: Content-Type is intentionally NOT set here
        // It will be set automatically by axios based on data type
        // For JSON: 'application/json'
        // For FormData: 'multipart/form-data' with boundary
      },
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Set Content-Type based on data type
        // For FormData, let axios set it automatically with boundary
        // For regular JSON requests, set it explicitly
        if (config.data && !(config.data instanceof FormData)) {
          config.headers['Content-Type'] = 'application/json';
        }
        // If it's FormData, axios will automatically set:
        // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
        
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        
        if (error.code === 'ERR_NETWORK') {
          console.error('❌ Backend server is not running or not accessible at:', API_BASE_URL);
          console.error('Please ensure your Go backend is running on http://localhost:8080');
        } else {
          console.error('API Error:', error.message, error.response?.data);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get(url, config);
    // For blob responses, return raw data
    if (config?.responseType === 'blob') {
      return response.data as T;
    }
    return this.unwrapResponse<T>(response.data);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post(url, data, config);
    return this.unwrapResponse<T>(response.data);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put(url, data, config);
    return this.unwrapResponse<T>(response.data);
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete(url, config);
    return this.unwrapResponse<T>(response.data);
  }

  private unwrapResponse<T>(response: any): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data as T;
    }
    return response as T;
  }
}

export const httpClient = new HttpClient();
