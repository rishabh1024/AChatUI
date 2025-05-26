import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ChatService } from '../../services/chatService'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ChatService', () => {
  let chatService: ChatService
  
  beforeEach(() => {
    chatService = new ChatService('http://localhost:8000', 5000)
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('sendMessage', () => {
    it('sends message to correct endpoint with proper payload', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ message: 'AI response' }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await chatService.sendMessage('Hello, AI!')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Hello, AI!',
          }),
          signal: expect.any(AbortSignal),
        }
      )
    })

    it('returns successful response with message', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ message: 'AI response' }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await chatService.sendMessage('Test message')

      expect(result).toEqual({
        message: 'AI response',
        success: true,
      })
    })

    it('handles response field instead of message field', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ response: 'AI response via response field' }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      const result = await chatService.sendMessage('Test message')

      expect(result).toEqual({
        message: 'AI response via response field',
        success: true,
      })
    })

    it('throws error for HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      }
      mockFetch.mockResolvedValue(mockResponse)

      await expect(chatService.sendMessage('Test message')).rejects.toThrow(
        'HTTP 500: Internal Server Error'
      )
    })

    it('throws error for invalid response format', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ data: 'no message field' }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await expect(chatService.sendMessage('Test message')).rejects.toThrow(
        'Invalid response format: missing message field'
      )
    })

    it('handles timeout correctly', async () => {
      vi.useFakeTimers()
      
      const chatServiceWithShortTimeout = new ChatService('http://localhost:8000', 100)
      
      // Mock a request that never resolves
      mockFetch.mockImplementation(() => new Promise(() => {}))

      const promise = chatServiceWithShortTimeout.sendMessage('Test message')
      
      // Fast-forward time to trigger timeout
      vi.advanceTimersByTime(100)
      
      await expect(promise).rejects.toThrow('Request timeout - please try again')
      
      vi.useRealTimers()
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(chatService.sendMessage('Test message')).rejects.toThrow(
        'Network error'
      )
    })

    it('handles unknown errors', async () => {
      mockFetch.mockRejectedValue('String error')

      await expect(chatService.sendMessage('Test message')).rejects.toThrow(
        'Unknown error occurred'
      )
    })

    it('handles empty response text on error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: async () => { throw new Error('No response body') },
      }
      mockFetch.mockResolvedValue(mockResponse)

      await expect(chatService.sendMessage('Test message')).rejects.toThrow(
        'HTTP 404: Unknown error'
      )
    })
  })

  describe('configuration methods', () => {
    it('allows setting new API URL', () => {
      chatService.setApiUrl('http://newapi.com')
      
      expect(chatService.getApiUrl()).toBe('http://newapi.com')
    })

    it('returns current API URL', () => {
      expect(chatService.getApiUrl()).toBe('http://localhost:8000')
    })

    it('uses new API URL for requests', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ message: 'response from new API' }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      chatService.setApiUrl('http://newapi.com')
      await chatService.sendMessage('Test message')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://newapi.com/chat',
        expect.any(Object)
      )
    })
  })

  describe('constructor parameters', () => {
    it('uses default values when no parameters provided', () => {
      const defaultService = new ChatService()
      
      expect(defaultService.getApiUrl()).toBe('http://localhost:8000')
    })

    it('uses provided API URL and timeout', async () => {
      const customService = new ChatService('http://custom.api', 2000)
      const mockResponse = {
        ok: true,
        json: async () => ({ message: 'response' }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      await customService.sendMessage('test')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://custom.api/chat',
        expect.any(Object)
      )
    })
  })
})
