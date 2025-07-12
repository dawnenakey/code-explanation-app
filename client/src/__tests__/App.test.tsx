import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )
    
    expect(screen.getByText('Code Explanation Tool')).toBeInTheDocument()
  })

  it('renders the router correctly', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )
    
    // Check if main content is rendered
    expect(screen.getByText('Code Explanation Tool')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/paste your code here/i)).toBeInTheDocument()
  })

  it('includes toast notifications', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )
    
    // Toast container should be in the DOM
    const toastContainer = document.querySelector('[data-sonner-toaster]')
    expect(toastContainer).toBeInTheDocument()
  })
})