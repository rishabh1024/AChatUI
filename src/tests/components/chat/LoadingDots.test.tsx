import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test-utils/testing-library-utils'
import LoadingDots from '../../../components/chat/LoadingDots'

describe('LoadingDots Component', () => {
  it('renders loading animation correctly', () => {
    render(<LoadingDots />)
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })

  it('contains exactly three dots', () => {
    render(<LoadingDots />)
    
    const dots = screen.getAllByTestId('loading-dot')
    expect(dots).toHaveLength(3)
  })

  it('has proper animation classes', () => {
    render(<LoadingDots />)
    
    const dots = screen.getAllByTestId('loading-dot')
    
    // Each dot should have bounce animation
    dots.forEach(dot => {
      expect(dot).toHaveClass('animate-bounce')
    })
  })

  it('has accessibility attributes', () => {
    render(<LoadingDots />)
    
    const container = screen.getByLabelText('AI thinking')
    expect(container).toHaveAttribute('role', 'status')
    expect(container).toHaveAttribute('aria-live', 'polite')
  })

  it('displays correct message', () => {
    render(<LoadingDots />)
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('is thinking')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    render(<LoadingDots />)
    
    const container = screen.getByLabelText('AI thinking')
    expect(container).toHaveClass('flex', 'items-center', 'gap-2', 'text-secondary/60')
  })
})
