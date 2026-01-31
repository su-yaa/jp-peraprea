import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { sleep } from './utils';
import categories from '../data/categories.json';
import kanaData from '../data/kana.json';
import wordPicData from '../data/word_pic.json';
import sentenceData from '../data/sentences.json';

// --- Type Definitions ---
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Axios Instance ---
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.Mode === 'production' ? 'https://api.dailytalk.jp' : '', // Mock mode in dev
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Mock Adapter Logic ---
// This acts as a client-side server intercepting requests
axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // If we are in a real environment, we might want to skip this
  // But for now, we enforce mock data
  const isMock = true;

  if (isMock) {
    await sleep(300 + Math.random() * 500); // Simulate network latency

    const { url, method } = config;

    // 1. Categories
    if (url === '/categories' && method === 'get') {
      return mockResponse(config, categories);
    }

    // 2. Kana Data
    if (url === '/kana' && method === 'get') {
      return mockResponse(config, kanaData);
    }

    // 3. Word Picture Data
    if (url === '/word-pic' && method === 'get') {
      return mockResponse(config, wordPicData);
    }

    // 4. Sentence Quiz Data
    if (url?.startsWith('/quiz') && method === 'get') {
      const params = new URLSearchParams(url.split('?')[1]);
      const categoryId = params.get('categoryId');

      let filtered = sentenceData;
      if (categoryId) {
        filtered = sentenceData.filter((q: any) => q.categoryId === categoryId);
      }
      return mockResponse(config, filtered);
    }
  }

  return config;
});

// Helper to create a mock response rejection (which is caught by response interceptor)
function mockResponse(config: InternalAxiosRequestConfig, data: any) {
  return Promise.reject({
    config,
    isMockError: true, // Custom flag to identify mock response
    response: {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    },
  });
}

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if this error was actually a successful mock response
    if (error.isMockError && error.response) {
      return Promise.resolve(error.response);
    }

    // Handle real errors
    console.error('[API Error]', error);
    return Promise.reject(error);
  }
);

// --- Exported API Wrapper ---
// This abstracts axios from the rest of the app, making migration easier
const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

export default api;
