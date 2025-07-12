import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '@/pages/home'
import { apiRequest } from '@/lib/queryClient'

// Mock the API request
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}))

const mockCodeExplanationResult = {
  explanation: 'This code prints "Hello, World!" to the console.',
  detectedLanguage: 'javascript',
  keyPoints: [
    'Uses console.log() function',
    'Prints string literal',
    'Basic JavaScript syntax'
  ],
  stepByStep: [
    {
      step: 'Function Call',
      description: 'Calls the console.log() function',
      color: 'blue'
    },
    {
      step: 'String Output',
      description: 'Outputs the string "Hello, World!"',
      color: 'green'
    }
  ],
  concepts: [
    {
      name: 'console.log()',
      description: 'Built-in JavaScript function for outputting text to the console'
    },
    {
      name: 'String Literal',
      description: 'A sequence of characters enclosed in quotes'
    }
  ],
  performanceNotes: 'This is a simple operation with minimal performance impact.',
  responseTime: 150
}

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

describe('Code Explanation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should complete full code explanation workflow', async () => {
    // Mock successful API response
    vi.mocked(apiRequest).mockResolvedValue(mockCodeExplanationResult)
    
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    // Enter code
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const testCode = 'console.log("Hello, World!");'
    
    fireEvent.change(codeInput, { target: { value: testCode } })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    fireEvent.click(submitButton)
    
    // Wait for API call and response
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/api/explain-code', {
        method: 'POST',
        data: {
          code: testCode,
          language: 'javascript'
        }
      })
    })
    
    // Check if explanation is displayed
    await waitFor(() => {
      expect(screen.getByText('This code prints "Hello, World!" to the console.')).toBeInTheDocument()
    })
    
    // Check if key points are displayed
    expect(screen.getByText('Uses console.log() function')).toBeInTheDocument()
    expect(screen.getByText('Prints string literal')).toBeInTheDocument()
    expect(screen.getByText('Basic JavaScript syntax')).toBeInTheDocument()
    
    // Check if step-by-step breakdown is displayed
    expect(screen.getByText('Function Call')).toBeInTheDocument()
    expect(screen.getByText('Calls the console.log() function')).toBeInTheDocument()
    
    // Check if concepts are displayed
    expect(screen.getByText('console.log()')).toBeInTheDocument()
    expect(screen.getByText('String Literal')).toBeInTheDocument()
    
    // Check if performance notes are displayed
    expect(screen.getByText('This is a simple operation with minimal performance impact.')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    vi.mocked(apiRequest).mockRejectedValue(new Error('API Error'))
    
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    // Enter code and submit
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
    
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    fireEvent.click(submitButton)
    
    // Wait for error handling
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('should handle different programming languages', async () => {
    // Mock successful API response for Python
    const pythonResult = {
      ...mockCodeExplanationResult,
      detectedLanguage: 'python',
      explanation: 'This Python code prints "Hello, World!" to the console.'
    }
    
    vi.mocked(apiRequest).mockResolvedValue(pythonResult)
    
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    // Enter Python code
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const pythonCode = 'print("Hello, World!")'
    
    fireEvent.change(codeInput, { target: { value: pythonCode } })
    
    // Change language to Python
    const languageSelect = screen.getByDisplayValue('JavaScript')
    fireEvent.change(languageSelect, { target: { value: 'python' } })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    fireEvent.click(submitButton)
    
    // Wait for API call with Python language
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/api/explain-code', {
        method: 'POST',
        data: {
          code: pythonCode,
          language: 'python'
        }
      })
    })
    
    // Check if Python explanation is displayed
    await waitFor(() => {
      expect(screen.getByText('This Python code prints "Hello, World!" to the console.')).toBeInTheDocument()
    })
  })

  it('should validate form inputs', async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    // Try to submit without code
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    fireEvent.click(submitButton)
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/code is required/i)).toBeInTheDocument()
    })
    
    // API should not be called
    expect(apiRequest).not.toHaveBeenCalled()
  })

  it('should handle very long code inputs', async () => {
    const longCode = 'a'.repeat(15000) // Exceeds 10,000 character limit
    
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    )
    
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    fireEvent.change(codeInput, { target: { value: longCode } })
    
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    fireEvent.click(submitButton)
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/code must be less than 10,000 characters/i)).toBeInTheDocument()
    })
    
    // API should not be called
    expect(apiRequest).not.toHaveBeenCalled()
  })
})