import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../../test-utils/testing-library-utils'
import { ErrorBoundary } from '../../../components/layout'
import { ReactNode } from 'react'

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Component that simulates a problematic child
const ProblematicChild = () => {
  throw new Error('Something went wrong in child component')
}

describe('ErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  
  afterEach(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ProblematicChild />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Please refresh the page and try again.')).toBeInTheDocument()
  })

  it('displays refresh button in error state', () => {
    render(
      <ErrorBoundary>
        <ProblematicChild />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
  })

  it('handles dynamic errors correctly', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
    
    // Component throws error on rerender
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('catches errors from nested components', () => {
    const NestedComponent = () => (
      <div>
        <div>
          <ProblematicChild />
        </div>
      </div>
    )
    
    render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('provides fallback UI with proper styling', () => {
    render(
      <ErrorBoundary>
        <ProblematicChild />
      </ErrorBoundary>
    )
    
    const errorContainer = screen.getByText('Something went wrong').closest('div')
    expect(errorContainer).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })

  it('handles multiple children with one error', () => {
    const MultipleChildren = () => (
      <>
        <div>Good component 1</div>
        <ProblematicChild />
        <div>Good component 2</div>
      </>
    )
    
    render(
      <ErrorBoundary>
        <MultipleChildren />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.queryByText('Good component 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Good component 2')).not.toBeInTheDocument()
  })

  it('renders with custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ProblematicChild />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})
