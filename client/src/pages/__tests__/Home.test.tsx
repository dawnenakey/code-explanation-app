import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '../home'

// Mock the OpenAI API call
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}))

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

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main heading', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    expect(screen.getByText('Code Explanation Tool')).toBeInTheDocument()
  })

  it('renders the code input form', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    expect(screen.getByPlaceholderText(/paste your code here/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /explain code/i })).toBeInTheDocument()
  })

  it('shows validation error for empty code', async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/code is required/i)).toBeInTheDocument()
    })
  })

  it('accepts code input and language selection', async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const testCode = 'console.log("Hello, World!");'
    
    fireEvent.change(codeInput, { target: { value: testCode } })
    
    expect(codeInput).toHaveValue(testCode)
  })

  it('displays language selection dropdown', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument() // Default selection
  })

  it('shows loading state during code explanation', async () => {
    const { apiRequest } = await import('@/lib/queryClient')
    
    // Mock a delayed API response
    vi.mocked(apiRequest).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )
    
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    
    fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/explaining/i)).toBeInTheDocument()
    })
  })
})