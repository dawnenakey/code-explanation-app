import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, testScenarios } from '../utils/testUtils'
import { fireEvent, waitFor, screen } from '@testing-library/react'
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

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle rapid successive requests', async () => {
    // Mock fast API responses
    vi.mocked(apiRequest).mockResolvedValue({
      explanation: 'Fast response',
      detectedLanguage: 'javascript',
      keyPoints: ['Quick test'],
      stepByStep: [],
      concepts: [],
      responseTime: 50
    })
    
    renderWithProviders(<Home />)
    
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    
    // Submit multiple requests quickly
    fireEvent.change(codeInput, { target: { value: 'test1' } })
    fireEvent.click(submitButton)
    
    fireEvent.change(codeInput, { target: { value: 'test2' } })
    fireEvent.click(submitButton)
    
    fireEvent.change(codeInput, { target: { value: 'test3' } })
    fireEvent.click(submitButton)
    
    // Should handle all requests
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledTimes(3)
    })
  })

  it('should handle slow API responses', async () => {
    // Mock slow API response
    vi.mocked(apiRequest).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        explanation: 'Slow response',
        detectedLanguage: 'javascript',
        keyPoints: ['Slow test'],
        stepByStep: [],
        concepts: [],
        responseTime: 5000
      }), 1000))
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
    
    // Should eventually show result
    await waitFor(() => {
      expect(screen.getByText('Slow response')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should handle large code inputs efficiently', async () => {
    const largeCodeInput = testScenarios.complexCode.repeat(10) // Large but valid code
    
    vi.mocked(apiRequest).mockResolvedValue({
      explanation: 'Large code explanation',
      detectedLanguage: 'javascript',
      keyPoints: ['Large code test'],
      stepByStep: [],
      concepts: [],
      responseTime: 200
    })
    
    renderWithProviders(<Home />)
    
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    
    // Measure time to input large code
    const startTime = performance.now()
    fireEvent.change(codeInput, { target: { value: largeCodeInput } })
    const endTime = performance.now()
    
    // Should handle large input reasonably fast (< 100ms)
    expect(endTime - startTime).toBeLessThan(100)
    
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Large code explanation')).toBeInTheDocument()
    })
  })

  it('should maintain responsive UI during API calls', async () => {
    // Mock delayed response
    vi.mocked(apiRequest).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        explanation: 'Responsive test',
        detectedLanguage: 'javascript',
        keyPoints: ['UI test'],
        stepByStep: [],
        concepts: [],
        responseTime: 100
      }), 500))
    )
    
    renderWithProviders(<Home />)
    
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    
    fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
    fireEvent.click(submitButton)
    
    // UI should remain responsive during API call
    const newCodeInput = screen.getByPlaceholderText(/paste your code here/i)
    fireEvent.change(newCodeInput, { target: { value: 'new code' } })
    
    expect(newCodeInput).toHaveValue('new code')
    
    await waitFor(() => {
      expect(screen.getByText('Responsive test')).toBeInTheDocument()
    })
  })

  it('should clean up resources properly', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      explanation: 'Cleanup test',
      detectedLanguage: 'javascript',
      keyPoints: ['Resource test'],
      stepByStep: [],
      concepts: [],
      responseTime: 50
    })
    
    const { unmount } = renderWithProviders(<Home />)
    
    const codeInput = screen.getByPlaceholderText(/paste your code here/i)
    const submitButton = screen.getByRole('button', { name: /explain code/i })
    
    fireEvent.change(codeInput, { target: { value: testScenarios.validJavaScriptCode } })
    fireEvent.click(submitButton)
    
    // Unmount component during API call
    unmount()
    
    // Should not cause memory leaks or errors
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalled()
    })
  })
})