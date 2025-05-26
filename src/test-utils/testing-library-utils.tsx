import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ErrorBoundary } from '../components/layout'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
