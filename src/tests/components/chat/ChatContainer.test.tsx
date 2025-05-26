import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../../test-utils/testing-library-utils'
import userEvent from '@testing-library/user-event'
import ChatContainer from '../../../components/chat/ChatContainer'
import { chatService } from '../../../services/chatService'

// Mock the chat service
vi.mock('../../../services/chatService', () => ({
  chatService: {
    sendMessage: vi.fn(),
  },
}))

describe('ChatContainer', () => {
  const mockSendMessage = vi.mocked(chatService.sendMessage)

  beforeEach(() => {
    mockSendMessage.mockClear()
  })

  it('renders the chat interface correctly', () => {
    render(<ChatContainer />)
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('Powered by FastAPI')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Message AI Assistant...')).toBeInTheDocument()
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument()
  })

  it('displays welcome message when no messages exist', () => {
    render(<ChatContainer />)
    
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument()
    expect(screen.getByText('Start a conversation by typing a message below. I\'m here to assist you with any questions or tasks.')).toBeInTheDocument()
  })

  it('allows user to type and send a message', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockResolvedValue({
      message: 'Hello! How can I help you?',
      success: true,
    })

    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')
    const sendButton = screen.getByRole('button')

    await user.type(textarea, 'Hello, AI!')
    await user.click(sendButton)

    expect(mockSendMessage).toHaveBeenCalledWith('Hello, AI!')
  })

  it('sends message on Enter key press', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockResolvedValue({
      message: 'Response from AI',
      success: true,
    })

    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')

    await user.type(textarea, 'Test message{enter}')

    expect(mockSendMessage).toHaveBeenCalledWith('Test message')
  })

  it('prevents sending empty messages', async () => {
    const user = userEvent.setup()
    render(<ChatContainer />)
    
    const sendButton = screen.getByRole('button')

    await user.click(sendButton)

    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('shows loading state while sending message', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ message: 'Response', success: true }), 100)
    ))

    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')
    const sendButton = screen.getByRole('button')

    await user.type(textarea, 'Test message')
    await user.click(sendButton)

    // Should show loading spinner on button
    expect(sendButton).toBeDisabled()
    
    // Should show loading dots
    await waitFor(() => {
      expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    })
  })

  it('displays error message when API call fails', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockRejectedValue(new Error('API Error'))

    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')
    const sendButton = screen.getByRole('button')

    await user.type(textarea, 'Test message')
    await user.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
      expect(screen.getByText(/API Error/)).toBeInTheDocument()
    })
  })

  it('allows dismissing error messages', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockRejectedValue(new Error('Test error'))

    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')
    const sendButton = screen.getByRole('button')

    await user.type(textarea, 'Test message')
    await user.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    })

    const dismissButton = screen.getByText('Dismiss')
    await user.click(dismissButton)

    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
  })

  it('validates message length', async () => {
    const user = userEvent.setup()
    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')
    const sendButton = screen.getByRole('button')

    // Create a message longer than 4000 characters
    const longMessage = 'a'.repeat(4001)
    await user.type(textarea, longMessage)
    await user.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Message too long/)).toBeInTheDocument()
    })

    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('displays user and AI messages correctly', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockResolvedValue({
      message: 'AI response message',
      success: true,
    })

    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')
    const sendButton = screen.getByRole('button')

    await user.type(textarea, 'User message')
    await user.click(sendButton)

    // Check user message appears
    await waitFor(() => {
      expect(screen.getByText('User message')).toBeInTheDocument()
    })

    // Check AI response appears
    await waitFor(() => {
      expect(screen.getByText('AI response message')).toBeInTheDocument()
    })

    // Check role indicators
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })

  it('allows new line with Shift+Enter', async () => {
    const user = userEvent.setup()
    render(<ChatContainer />)
    
    const textarea = screen.getByPlaceholderText('Message AI Assistant...')

    await user.type(textarea, 'Line 1{shift}{enter}Line 2')

    expect(textarea).toHaveValue('Line 1\nLine 2')
    expect(mockSendMessage).not.toHaveBeenCalled()
  })
})
