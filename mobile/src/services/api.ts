import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AuthResponse, 
  User, 
  Profile, 
  Match, 
  SparkEvent, 
  Conversation, 
  Message,
  TierType,
  ApiResponse 
} from '../types';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1' 
  : 'https://api.yourdatingapp.com/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage and redirect to login
          await AsyncStorage.multiRemove(['@auth_token', '@user_data']);
          // You might want to dispatch a logout action here
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method for making requests
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.request({
      method,
      url,
      data,
    });
  }

  // Auth endpoints
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request<AuthResponse>('POST', '/auth/login', credentials),
    
    register: (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName?: string;
      tier: TierType;
      birthDate: string;
      phone?: string;
    }) =>
      this.request<AuthResponse>('POST', '/auth/register', userData),
    
    logout: () =>
      this.request<void>('POST', '/auth/logout'),
  };

  // Profile endpoints
  profile = {
    getCurrentProfile: () =>
      this.request<Profile>('GET', '/profiles/me'),
    
    getProfile: (profileId: string) =>
      this.request<Profile>('GET', `/profiles/${profileId}`),
    
    updateBasicProfile: (updateData: Partial<Profile>) =>
      this.request<Profile>('PUT', '/profiles/basic', updateData),
    
    updateSparkProfile: (updateData: any) =>
      this.request<any>('PUT', '/profiles/spark', updateData),
    
    updateConnectProfile: (updateData: any) =>
      this.request<any>('PUT', '/profiles/connect', updateData),
    
    updateForeverProfile: (updateData: any) =>
      this.request<any>('PUT', '/profiles/forever', updateData),
    
    uploadMedia: (mediaData: { uri: string; type: string }) => {
      const formData = new FormData();
      formData.append('media', {
        uri: mediaData.uri,
        type: mediaData.type,
        name: 'media.jpg',
      } as any);
      
      return this.client.post('/profiles/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    
    deleteMedia: (mediaId: string) =>
      this.request<void>('DELETE', `/profiles/media/${mediaId}`),
  };

  // Matching endpoints
  matching = {
    getDailyMatches: () =>
      this.request<Match[]>('GET', '/matching/daily'),
    
    getTonightMatches: () =>
      this.request<Match[]>('GET', '/matching/tonight'),
    
    likeUser: (targetUserId: string) =>
      this.request<{ success: boolean; matched: boolean }>('POST', '/matching/like', { targetUserId }),
    
    passUser: (targetUserId: string) =>
      this.request<{ success: boolean }>('POST', '/matching/pass', { targetUserId }),
    
    superLike: (targetUserId: string) =>
      this.request<{ success: boolean }>('POST', '/matching/super-like', { targetUserId }),
  };

  // Events endpoints (Spark tier only)
  events = {
    getEvents: () =>
      this.request<SparkEvent[]>('GET', '/events'),
    
    getTonightEvents: () =>
      this.request<SparkEvent[]>('GET', '/events/tonight'),
    
    createEvent: (eventData: Partial<SparkEvent>) =>
      this.request<SparkEvent>('POST', '/events/create', eventData),
    
    joinEvent: (eventId: string) =>
      this.request<{ success: boolean; message: string }>('POST', `/events/${eventId}/join`),
    
    leaveEvent: (eventId: string) =>
      this.request<{ success: boolean; message: string }>('POST', `/events/${eventId}/leave`),
  };

  // Chat endpoints
  chat = {
    getConversations: () =>
      this.request<Conversation[]>('GET', '/chat/conversations'),
    
    getMessages: (conversationId: string) =>
      this.request<Message[]>('GET', `/chat/conversations/${conversationId}/messages`),
    
    sendMessage: (messageData: {
      conversationId: string;
      content: {
        text?: string;
        mediaUrl?: string;
      };
      messageType: 'text' | 'image' | 'video' | 'audio';
    }) =>
      this.request<Message>('POST', '/chat/messages', messageData),
    
    markAsRead: (messageId: string) =>
      this.request<void>('POST', `/chat/messages/${messageId}/read`),
  };
}

// Create and export API client instance
const apiClient = new ApiClient();

// Export individual API modules for easier imports
export const authAPI = apiClient.auth;
export const profileAPI = apiClient.profile;
export const matchingAPI = apiClient.matching;
export const eventsAPI = apiClient.events;
export const chatAPI = apiClient.chat;

// Export the full client for advanced usage
export default apiClient;