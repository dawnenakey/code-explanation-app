import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, waitFor, screen } from '@testing-library/react'
import { renderWithProviders, mockCodeExplanationResult, testScenarios } from '../utils/testUtils'
import { apiRequest } from '@/lib/queryClient'
import Home from '@/pages/home'

// Mock the API request
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  },
}))

describe('End-to-End User Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Happy Path - Complete User Journey', () => {
    it('should complete the entire user journey successfully', async () => {
      // Mock successful API response
      vi.mocked(apiRequest).mockResolvedValue(mockCodeExplanationResult)
      
      renderWithProviders(<Home />)
      
      // Step 1: User sees the initial interface
      expect(screen.getByText('Code Explanation Tool')).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/paste your code here/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /explain code/i })).toBeInTheDocument()
      
      // Step 2: User enters code
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
      
      // Step 3: User selects language (JavaScript is default)
      expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument()
      
      // Step 4: User submits the form
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)
      
      // Step 5: Loading state is shown
      await waitFor(() => {
        expect(screen.getByText(/explaining/i)).toBeInTheDocument()
      })
      
      // Step 6: API is called with correct parameters
      expect(apiRequest).toHaveBeenCalledWith('/api/explain-code', {
        method: 'POST',
        data: {
          code: testScenarios.validJavaScriptCode,
          language: 'javascript'
        }
      })
      
      // Step 7: Explanation is displayed
      await waitFor(() => {
        expect(screen.getByText('This code prints "Hello, World!" to the console.')).toBeInTheDocument()
      })
      
      // Step 8: All explanation sections are shown
      expect(screen.getByText('Uses console.log() function')).toBeInTheDocument()
      expect(screen.getByText('Function Call')).toBeInTheDocument()
      expect(screen.getByText('console.log()')).toBeInTheDocument()
      expect(screen.getByText('This is a simple operation with minimal performance impact.')).toBeInTheDocument()
      
      // Step 9: User can submit another code snippet
      fireEvent.change(codeInput, { target: { value: testScenarios.validPythonCode } })
      
      // Change language to Python
      const languageSelect = screen.getByDisplayValue('JavaScript')
      fireEvent.change(languageSelect, { target: { value: 'python' } })
      
      // Submit again
      fireEvent.click(submitButton)
      
      // Verify second API call
      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith('/api/explain-code', {
          method: 'POST',
          data: {
            code: testScenarios.validPythonCode,
            language: 'python'
          }
        })
      })
    })
  })

  describe('Error Handling Scenarios', () => {
    it('should handle network errors gracefully', async () => {
      // Mock network error
      vi.mocked(apiRequest).mockRejectedValue(new Error('Network error'))
      
      renderWithProviders(<Home />)
      
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })

    it('should handle server errors gracefully', async () => {
      // Mock server error
      vi.mocked(apiRequest).mockRejectedValue(new Error('Server error'))
      
      renderWithProviders(<Home />)
      
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })

    it('should handle API timeout errors', async () => {
      // Mock timeout error
      vi.mocked(apiRequest).mockRejectedValue(new Error('Request timeout'))
      
      renderWithProviders(<Home />)
      
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle complex code with multiple functions', async () => {
      vi.mocked(apiRequest).mockResolvedValue({
        ...mockCodeExplanationResult,
        explanation: 'This code implements a recursive fibonacci function.',
        keyPoints: [
          'Uses recursion',
          'Has base case for termination',
          'Demonstrates mathematical sequence'
        ]
      })
      
      renderWithProviders(<Home />)
      
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: testScenarios.complexCode } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('This code implements a recursive fibonacci function.')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Uses recursion')).toBeInTheDocument()
      expect(screen.getByText('Has base case for termination')).toBeInTheDocument()
    })

    it('should handle malformed code', async () => {
      vi.mocked(apiRequest).mockResolvedValue({
        ...mockCodeExplanationResult,
        explanation: 'This code has a syntax error - unterminated string literal.',
        keyPoints: [
          'Missing closing quote',
          'Will cause syntax error',
          'Needs proper string termination'
        ]
      })
      
      renderWithProviders(<Home />)
      
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: testScenarios.malformedCode } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/syntax error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility and UX', () => {
    it('should be keyboard accessible', async () => {
      renderWithProviders(<Home />)
      
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      
      // Test tab navigation
      codeInput.focus()
      expect(codeInput).toHaveFocus()
      
      // Test enter key submission
      fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
      fireEvent.keyDown(codeInput, { key: 'Enter', code: 'Enter' })
      
      // Form should be submitted
      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalled()
      })
    })

    it('should provide clear feedback during loading', async () => {
      // Mock delayed response
      vi.mocked(apiRequest).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockCodeExplanationResult), 100))
      )
      
      renderWithProviders(<Home />)
      
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      
      fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
      fireEvent.click(submitButton)
      
      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/explaining/i)).toBeInTheDocument()
      })
      
      // Should disable submit button during loading
      expect(submitButton).toBeDisabled()
      
      // Should show result after loading
      await waitFor(() => {
        expect(screen.getByText('This code prints "Hello, World!" to the console.')).toBeInTheDocument()
      })
      
      // Should re-enable submit button
      expect(submitButton).not.toBeDisabled()
    })
  })
})