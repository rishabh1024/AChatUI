import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test-utils/testing-library-utils'
import MessageComponent from '../../../components/chat/Message'
import type { Message } from '../../types/chat'

describe('Message Component', () => {
  const mockUserMessage: Message = {
    id: '1',
    content: 'Hello, AI!',
    role: 'user',
    timestamp: new Date('2025-05-25T10:00:00Z'),
  }

  const mockAssistantMessage: Message = {
    id: '2',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    timestamp: new Date('2025-05-25T10:01:00Z'),
  }

  it('renders user message correctly', () => {
    render(<MessageComponent message={mockUserMessage} />)
    
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument()
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('10:00 AM')).toBeInTheDocument()
  })

  it('renders assistant message correctly', () => {
    render(<MessageComponent message={mockAssistantMessage} />)
    
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('10:01 AM')).toBeInTheDocument()
  })

  it('applies correct styling for user messages', () => {
    render(<MessageComponent message={mockUserMessage} />)
    
    const messageContainer = screen.getByText('Hello, AI!').closest('div')
    expect(messageContainer).toHaveClass('bg-primary-500', 'text-white')
  })

  it('applies correct styling for assistant messages', () => {
    render(<MessageComponent message={mockAssistantMessage} />)
    
    const messageContainer = screen.getByText('Hello! How can I help you today?').closest('div')
    expect(messageContainer).toHaveClass('bg-gray-100', 'text-gray-900')
  })

  it('displays user avatar icon', () => {
    render(<MessageComponent message={mockUserMessage} />)
    
    const userIcon = screen.getByRole('img', { hidden: true })
    expect(userIcon).toBeInTheDocument()
  })

  it('displays assistant avatar icon', () => {
    render(<MessageComponent message={mockAssistantMessage} />)
    
    const assistantIcon = screen.getByRole('img', { hidden: true })
    expect(assistantIcon).toBeInTheDocument()
  })

  it('preserves whitespace and line breaks in message content', () => {
    const messageWithBreaks: Message = {
      id: '3',
      content: 'Line 1\nLine 2\n\nLine 4',
      role: 'user',
      timestamp: new Date(),
    }

    render(<MessageComponent message={messageWithBreaks} />)
    
    const messageContent = screen.getByText('Line 1\nLine 2\n\nLine 4')
    expect(messageContent).toHaveClass('whitespace-pre-wrap')
  })

  it('handles long messages correctly', () => {
    const longMessage: Message = {
      id: '4',
      content: 'This is a very long message that should wrap properly within the message bubble container and not overflow outside the boundaries.',
      role: 'assistant',
      timestamp: new Date(),
    }

    render(<MessageComponent message={longMessage} />)
    
    expect(screen.getByText(longMessage.content)).toBeInTheDocument()
  })

  it('formats timestamp correctly', () => {
    const specificTime = new Date('2025-05-25T14:30:00Z')
    const messageWithSpecificTime: Message = {
      id: '5',
      content: 'Test message',
      role: 'user',
      timestamp: specificTime,
    }

    render(<MessageComponent message={messageWithSpecificTime} />)
    
    // Should display time in local format (2:30 PM)
    expect(screen.getByText('2:30 PM')).toBeInTheDocument()
  })

  it('handles empty message content', () => {
    const emptyMessage: Message = {
      id: '6',
      content: '',
      role: 'user',
      timestamp: new Date(),
    }

    render(<MessageComponent message={emptyMessage} />)
    
    expect(screen.getByText('You')).toBeInTheDocument()
    // Should still render the message structure even with empty content
  })

  it('handles special characters in message content', () => {
    const specialCharsMessage: Message = {
      id: '7',
      content: 'Special chars: @#$%^&*()_+{}|:<>?[]\\;\'",./`~',
      role: 'assistant',
      timestamp: new Date(),
    }

    render(<MessageComponent message={specialCharsMessage} />)
    
    expect(screen.getByText(specialCharsMessage.content)).toBeInTheDocument()
  })
})
