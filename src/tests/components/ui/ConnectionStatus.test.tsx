import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '../../../test-utils/testing-library-utils'
import ConnectionStatus from '../../../components/ui/ConnectionStatus'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ConnectionStatus Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders connection status indicator', () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    })

    render(<ConnectionStatus />)
    
    expect(screen.getByLabelText(/connection status/i)).toBeInTheDocument()
  })

  it('shows checking status initially', () => {
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ ok: true, status: 200 }), 1000)
      )
    )

    render(<ConnectionStatus />)
    
    expect(screen.getByText('Checking')).toBeInTheDocument()
  })

  it('displays connected status when API is reachable', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    })

    render(<ConnectionStatus />)
    
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument()
    })
  })

  it('displays disconnected status when API is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<ConnectionStatus />)
    
    await waitFor(() => {
      expect(screen.getByText('Disconnected')).toBeInTheDocument()
    })
  })
})
