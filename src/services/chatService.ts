import { ChatResponse } from '../types/chat';
import { apiConfig } from '../config/api';

export class ChatService {
  private apiUrl: string;
  private timeout: number;

  constructor(apiUrl: string = apiConfig.baseUrl, timeout: number = apiConfig.timeout) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
  }  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.message && !data.response) {
        throw new Error('Invalid response format: missing message field');
      }
      
      return {
        message: data.message || data.response,
        success: true,
      };
    } catch (error) {
      console.error('Chat service error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  setApiUrl(url: string) {
    this.apiUrl = url;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}

export const chatService = new ChatService();
