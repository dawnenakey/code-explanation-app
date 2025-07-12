import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../utils/testUtils'
import { apiRequest } from '@/lib/queryClient'
import Home from '@/pages/home'

// Mock the API request to simulate different data flow scenarios
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  },
}))

describe('QA Data Flow Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Data Flow Validation', () => {
    it('should detect when API response data is not properly mapped to UI', async () => {
      // Test scenario: API returns data but UI doesn't display it correctly
      const apiResponse = {
        explanation: 'This is a test explanation',
        detectedLanguage: 'javascript',
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        stepByStep: [
          { step: 'Step 1', description: 'First step', color: 'blue' },
          { step: 'Step 2', description: 'Second step', color: 'green' }
        ],
        concepts: [
          { name: 'Console', description: 'Output mechanism' }
        ],
        performanceNotes: 'Performance is good',
        responseTime: 120
      }

      vi.mocked(apiRequest).mockResolvedValue(apiResponse)

      renderWithProviders(<Home />)

      // Submit code
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      // Verify ALL data from API response is displayed in UI
      await waitFor(() => {
        expect(screen.getByText('This is a test explanation')).toBeInTheDocument()
      })

      // Check if key points are displayed
      expect(screen.getByText('Point 1')).toBeInTheDocument()
      expect(screen.getByText('Point 2')).toBeInTheDocument()
      expect(screen.getByText('Point 3')).toBeInTheDocument()

      // Check if step-by-step is displayed
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('First step')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.getByText('Second step')).toBeInTheDocument()

      // Check if concepts are displayed
      expect(screen.getByText('Console')).toBeInTheDocument()
      expect(screen.getByText('Output mechanism')).toBeInTheDocument()

      // Check if performance notes are displayed
      expect(screen.getByText('Performance is good')).toBeInTheDocument()

      // If any of these assertions fail, there's a data flow issue
    })

    it('should detect missing or incorrect data transformation', async () => {
      // Test scenario: API returns data in different format than expected
      const malformedApiResponse = {
        explanation: null, // Should be string
        detectedLanguage: 'javascript',
        keyPoints: 'Point 1, Point 2', // Should be array
        stepByStep: null, // Should be array
        concepts: undefined, // Should be array
        performanceNotes: '', // Empty string
        responseTime: 'fast' // Should be number
      }

      vi.mocked(apiRequest).mockResolvedValue(malformedApiResponse)

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: 'console.log("test");' } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      // This test should catch if the app doesn't handle malformed data properly
      await waitFor(() => {
        // Check if error handling works when data is malformed
        const errorElement = screen.queryByText(/error/i)
        if (errorElement) {
          expect(errorElement).toBeInTheDocument()
        } else {
          // If no error is shown, verify the app handles gracefully
          expect(screen.getByText(/no explanation available/i)).toBeInTheDocument()
        }
      })
    })

    it('should validate data persistence and state management', async () => {
      // Test scenario: Ensure data persists correctly between interactions
      const firstResponse = {
        explanation: 'First explanation',
        detectedLanguage: 'javascript',
        keyPoints: ['First point'],
        stepByStep: [],
        concepts: [],
        responseTime: 100
      }

      const secondResponse = {
        explanation: 'Second explanation',
        detectedLanguage: 'python',
        keyPoints: ['Second point'],
        stepByStep: [],
        concepts: [],
        responseTime: 150
      }

      vi.mocked(apiRequest)
        .mockResolvedValueOnce(firstResponse)
        .mockResolvedValueOnce(secondResponse)

      renderWithProviders(<Home />)

      // First request
      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: 'console.log("first");' } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('First explanation')).toBeInTheDocument()
      })

      // Second request - should replace first data, not append
      fireEvent.change(codeInput, { target: { value: 'print("second")' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Second explanation')).toBeInTheDocument()
      })

      // Verify old data is gone (no data leakage)
      expect(screen.queryByText('First explanation')).not.toBeInTheDocument()
      expect(screen.queryByText('First point')).not.toBeInTheDocument()
    })
  })

  describe('UI Parity Detection', () => {
    it('should detect UI inconsistencies across different states', async () => {
      // Test loading, success, and error states for UI consistency
      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      // Test initial state
      expect(codeInput).toBeInTheDocument()
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()

      // Test loading state
      vi.mocked(apiRequest).mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )

      fireEvent.change(codeInput, { target: { value: 'test code' } })
      fireEvent.click(submitButton)

      // Check loading state UI
      await waitFor(() => {
        expect(screen.getByText(/explaining/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
      })

      // Test error state
      vi.mocked(apiRequest).mockRejectedValue(new Error('API Error'))

      fireEvent.change(codeInput, { target: { value: 'error code' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
        expect(submitButton).not.toBeDisabled() // Should be enabled after error
      })
    })

    it('should detect visual regression in explanation display', async () => {
      const testResponse = {
        explanation: 'Test explanation with specific formatting',
        detectedLanguage: 'javascript',
        keyPoints: ['Key point 1', 'Key point 2'],
        stepByStep: [
          { step: 'Step 1', description: 'Description 1', color: 'blue' },
          { step: 'Step 2', description: 'Description 2', color: 'green' }
        ],
        concepts: [
          { name: 'Concept 1', description: 'Description 1' },
          { name: 'Concept 2', description: 'Description 2' }
        ],
        performanceNotes: 'Performance notes here',
        responseTime: 200
      }

      vi.mocked(apiRequest).mockResolvedValue(testResponse)

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: 'test code' } })
      
      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Test explanation with specific formatting')).toBeInTheDocument()
      })

      // Check if all sections are properly structured
      const explanationSection = screen.getByText('Test explanation with specific formatting')
      expect(explanationSection).toBeVisible()

      // Check if key points section exists
      expect(screen.getByText('Key point 1')).toBeVisible()
      expect(screen.getByText('Key point 2')).toBeVisible()

      // Check if step-by-step section exists
      expect(screen.getByText('Step 1')).toBeVisible()
      expect(screen.getByText('Description 1')).toBeVisible()

      // Check if concepts section exists
      expect(screen.getByText('Concept 1')).toBeVisible()
      expect(screen.getByText('Description 1')).toBeVisible()

      // Check if performance notes section exists
      expect(screen.getByText('Performance notes here')).toBeVisible()
    })

    it('should detect form validation parity issues', async () => {
      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      const submitButton = screen.getByRole('button', { name: /explain code/i })

      // Test empty input validation
      fireEvent.change(codeInput, { target: { value: '' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/code is required/i)).toBeInTheDocument()
      })

      // Test max length validation
      const longCode = 'a'.repeat(15000)
      fireEvent.change(codeInput, { target: { value: longCode } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/code must be less than 10,000 characters/i)).toBeInTheDocument()
      })

      // Verify validation clears when valid input is provided
      fireEvent.change(codeInput, { target: { value: 'valid code' } })
      
      // Wait for validation to clear
      await waitFor(() => {
        expect(screen.queryByText(/code is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/code must be less than 10,000 characters/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Cross-Browser and Responsive Testing', () => {
    it('should test responsive behavior for different screen sizes', () => {
      // Mock different viewport sizes
      const testViewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ]

      testViewports.forEach(({ width, height }) => {
        // Mock window dimensions
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

        // Check if key elements are present regardless of screen size
        expect(screen.getByText('Code Explanation Tool')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/paste your code here/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /explain code/i })).toBeInTheDocument()
      })
    })
  })
})