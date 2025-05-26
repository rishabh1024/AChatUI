import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test-utils/testing-library-utils'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../../../components/layout'

describe('Sidebar', () => {
  it('renders sidebar with correct title', () => {
    render(<Sidebar />)
    
    expect(screen.getByText('Chat History')).toBeInTheDocument()
  })

  it('displays new chat button', () => {
    render(<Sidebar />)
    
    expect(screen.getByText('New Chat')).toBeInTheDocument()
  })

  it('shows placeholder text when no conversations exist', () => {
    render(<Sidebar />)
    
    expect(screen.getByText('No conversations yet')).toBeInTheDocument()
    expect(screen.getByText('Start a new conversation to see it here.')).toBeInTheDocument()
  })

  it('allows clicking new chat button', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    
    const newChatButton = screen.getByText('New Chat')
    await user.click(newChatButton)
    
    // Button should be clickable (no error thrown)
    expect(newChatButton).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<Sidebar />)
    
    const sidebar = screen.getByText('Chat History').closest('div')?.parentElement
    expect(sidebar).toHaveClass('w-64', 'bg-secondary-900', 'text-white')
  })

  it('displays plus icon for new chat', () => {
    render(<Sidebar />)
    
    // Should have a plus icon in the new chat button
    const newChatButton = screen.getByText('New Chat').closest('button')
    const icon = newChatButton?.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('applies hover effects to new chat button', () => {
    render(<Sidebar />)
    
    const newChatButton = screen.getByText('New Chat').closest('button')
    expect(newChatButton).toHaveClass('hover:bg-secondary-800')
  })

  it('has proper accessibility attributes', () => {
    render(<Sidebar />)
    
    const newChatButton = screen.getByRole('button', { name: /new chat/i })
    expect(newChatButton).toBeInTheDocument()
  })

  it('renders with fixed height and scrollable content area', () => {
    render(<Sidebar />)
    
    const sidebar = screen.getByText('Chat History').closest('div')?.parentElement
    expect(sidebar).toHaveClass('h-full')
    
    const contentArea = screen.getByText('No conversations yet').closest('div')
    expect(contentArea).toHaveClass('flex-1', 'overflow-y-auto')
  })

  it('maintains consistent spacing and layout', () => {
    render(<Sidebar />)
    
    const header = screen.getByText('Chat History').closest('div')
    expect(header).toHaveClass('p-4', 'border-b', 'border-secondary-700')
    
    const content = screen.getByText('No conversations yet').closest('div')
    expect(content).toHaveClass('p-4')
  })
})
