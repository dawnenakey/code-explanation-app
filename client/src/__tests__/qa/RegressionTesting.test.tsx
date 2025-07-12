import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../utils/testUtils'
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

describe('Regression Testing for QA', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Critical Path Testing', () => {
    it('should maintain core functionality after code changes', async () => {
      // This test ensures the basic flow always works
      const standardResponse = {
        explanation: 'This JavaScript code uses console.log to output text.',
        detectedLanguage: 'javascript',
        keyPoints: ['Uses console.log function', 'Outputs string to console'],
        stepByStep: [
          { step: 'Function Call', description: 'Calls console.log()', color: 'blue' }
        ],
        concepts: [
          { name: 'console.log', description: 'Built-in output function' }
        ],
        performanceNotes: 'Simple operation with minimal overhead',
        responseTime: 150
      }

      vi.mocked(apiRequest).mockResolvedValue(standardResponse)

      renderWithProviders(<Home />)

      // Standard user workflow
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      fireEvent.change(codeInput, { target: { value: 'console.log("Hello World");' } })
      fireEvent.click(submitButton)

      // Verify core functionality
      await waitFor(() => {
        expect(screen.getByText('This JavaScript code uses console.log to output text.')).toBeInTheDocument()
      })

      expect(screen.getByText('Uses console.log function')).toBeInTheDocument()
      expect(screen.getByText('Function Call')).toBeInTheDocument()
      expect(screen.getByText('console.log')).toBeInTheDocument()
      expect(screen.getByText('Simple operation with minimal overhead')).toBeInTheDocument()
    })

    it('should detect if form submission behavior changes', async () => {
      // This test catches changes to form handling
      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      // Test that form prevents submission with empty input
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/code is required/i)).toBeInTheDocument()
      })

      // Verify API was NOT called with empty input
      expect(apiRequest).not.toHaveBeenCalled()

      // Test that form allows submission with valid input
      fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
      fireEvent.click(submitButton)

      // Verify API IS called with valid input
      expect(apiRequest).toHaveBeenCalledWith('POST', '/api/explain-code', {
        code: 'console.log("test");',
        language: 'javascript'
      })
    })

    it('should detect if language selection behavior changes', async () => {
      vi.mocked(apiRequest).mockResolvedValue({
        explanation: 'Python print statement',
        detectedLanguage: 'python',
        keyPoints: ['Uses print function'],
        stepByStep: [],
        concepts: [],
        responseTime: 100
      })

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      // Change language selection (this tests if language dropdown still works)
      const languageSelect = screen.getByDisplayValue('JavaScript')
      fireEvent.change(languageSelect, { target: { value: 'python' } })

      fireEvent.change(codeInput, { target: { value: 'print("Hello")' } })
      fireEvent.click(submitButton)

      // Verify the correct language is sent to API
      expect(apiRequest).toHaveBeenCalledWith('POST', '/api/explain-code', {
        code: 'print("Hello")',
        language: 'python'
      })
    })
  })

  describe('Error Handling Regression', () => {
    it('should maintain error handling for network failures', async () => {
      vi.mocked(apiRequest).mockRejectedValue(new Error('Network Error'))

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })

      // Verify error doesn't break the UI
      expect(codeInput).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })

    it('should maintain error handling for API errors', async () => {
      vi.mocked(apiRequest).mockRejectedValue(new Error('500: Internal Server Error'))

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })

      // Verify user can try again after error
      fireEvent.change(codeInput, { target: { value: 'console.log("retry");' } })
      expect(codeInput).toHaveValue('console.log("retry");')
    })
  })

  describe('Performance Regression', () => {
    it('should maintain performance with large code inputs', async () => {
      const largeCode = Array(1000).fill('console.log("line");').join('\n')

      vi.mocked(apiRequest).mockResolvedValue({
        explanation: 'Large code explanation',
        detectedLanguage: 'javascript',
        keyPoints: ['Multiple console.log statements'],
        stepByStep: [],
        concepts: [],
        responseTime: 500
      })

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      // Measure input performance
      const startTime = performance.now()
      fireEvent.change(codeInput, { target: { value: largeCode } })
      const endTime = performance.now()

      // Should handle large input in reasonable time (< 1 second)
      expect(endTime - startTime).toBeLessThan(1000)

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Large code explanation')).toBeInTheDocument()
      })
    })

    it('should maintain responsive UI during API calls', async () => {
      // Mock slow API response
      vi.mocked(apiRequest).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          explanation: 'Slow response',
          detectedLanguage: 'javascript',
          keyPoints: ['Slow test'],
          stepByStep: [],
          concepts: [],
          responseTime: 3000
        }), 1000))
      )

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
      fireEvent.click(submitButton)

      // UI should remain responsive during API call
      await waitFor(() => {
        expect(screen.getByText(/explaining/i)).toBeInTheDocument()
      })

      // Should be able to modify input even during API call
      fireEvent.change(codeInput, { target: { value: 'console.log("modified");' } })
      expect(codeInput).toHaveValue('console.log("modified");')
    })
  })

  describe('Cross-Browser Compatibility', () => {
    it('should work with different user agents', () => {
      // Test with different browser user agents
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ]

      userAgents.forEach(userAgent => {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          writable: true
        })

        renderWithProviders(<Home />)

        // Basic functionality should work regardless of browser
        expect(screen.getByText('Code Explanation Tool')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/paste your code here/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /explain code/i })).toBeInTheDocument()
      })
    })

    it('should handle different screen sizes', () => {
      const screenSizes = [
        { width: 320, height: 568 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1024, height: 768 },  // Laptop
        { width: 1920, height: 1080 }  // Desktop
      ]

      screenSizes.forEach(({ width, height }) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        })
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: height,
        })

        renderWithProviders(<Home />)

        // Core elements should be accessible at all screen sizes
        expect(screen.getByText('Code Explanation Tool')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/paste your code here/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /explain code/i })).toBeInTheDocument()
      })
    })
  })

  describe('Data Consistency Testing', () => {
    it('should maintain data consistency across multiple explanations', async () => {
      const responses = [
        {
          explanation: 'First explanation',
          detectedLanguage: 'javascript',
          keyPoints: ['First key point'],
          stepByStep: [{ step: 'First step', description: 'First desc', color: 'blue' }],
          concepts: [{ name: 'First concept', description: 'First concept desc' }],
          responseTime: 100
        },
        {
          explanation: 'Second explanation',
          detectedLanguage: 'python',
          keyPoints: ['Second key point'],
          stepByStep: [{ step: 'Second step', description: 'Second desc', color: 'green' }],
          concepts: [{ name: 'Second concept', description: 'Second concept desc' }],
          responseTime: 150
        }
      ]

      vi.mocked(apiRequest)
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      // First explanation
      fireEvent.change(codeInput, { target: { value: 'console.log("first");' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('First explanation')).toBeInTheDocument()
      })

      // Second explanation should replace first
      fireEvent.change(codeInput, { target: { value: 'print("second")' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Second explanation')).toBeInTheDocument()
      })

      // Verify no data mixing
      expect(screen.queryByText('First explanation')).not.toBeInTheDocument()
      expect(screen.queryByText('First key point')).not.toBeInTheDocument()
      expect(screen.queryByText('First step')).not.toBeInTheDocument()
      expect(screen.queryByText('First concept')).not.toBeInTheDocument()
    })
  })
})