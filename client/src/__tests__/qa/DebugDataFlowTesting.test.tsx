import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../utils/testUtils'
import { apiRequest } from '@/lib/queryClient'
import Home from '@/pages/home'
import { 
  TestDebugger, 
  createDebugMock, 
  debugRender, 
  debugUserAction, 
  debugAssertion,
  debugDomState,
  TestTimer,
  initializeTestDebugging,
  cleanupTestDebugging
} from '../utils/debugUtils'

// Mock the API request with debugging
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: {
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  },
}))

describe('Debug-Enhanced Data Flow Testing', () => {
  let debugger: TestDebugger;
  let timer: TestTimer;

  beforeEach(() => {
    debugger = initializeTestDebugging('Debug Data Flow Testing');
    timer = new TestTimer('Data Flow Test');
    vi.clearAllMocks();
  });

  afterEach(() => {
    timer.finish();
    cleanupTestDebugging();
  });

  describe('Data Flow Validation with Debug', () => {
    it('should detect and debug API response mapping issues', async () => {
      debugger.log('Starting API response mapping test');
      
      const mockResponse = {
        explanation: 'Debug test explanation',
        detectedLanguage: 'javascript',
        keyPoints: ['Debug point 1', 'Debug point 2'],
        stepByStep: [
          { step: 'Debug Step 1', description: 'Debug description 1', color: 'blue' },
          { step: 'Debug Step 2', description: 'Debug description 2', color: 'green' }
        ],
        concepts: [
          { name: 'Debug Concept', description: 'Debug concept description' }
        ],
        performanceNotes: 'Debug performance notes',
        responseTime: 150
      };

      const mockApiRequest = createDebugMock('apiRequest', mockResponse);
      vi.mocked(apiRequest).mockImplementation(mockApiRequest);

      debugRender('Home', { testMode: true });
      renderWithProviders(<Home />);
      
      timer.checkpoint('Component rendered');

      // Debug DOM state before interaction
      const codeInput = screen.getByPlaceholderText(/paste your code here/i);
      debugDomState('Code input before interaction', codeInput);

      debugUserAction('type', 'code input', 'console.log("debug test");');
      fireEvent.change(codeInput, { target: { value: 'console.log("debug test");' } });
      
      timer.checkpoint('User input completed');

      const submitButton = screen.getByRole('button', { name: /explain code/i });
      debugDomState('Submit button before click', submitButton);

      debugUserAction('click', 'submit button');
      fireEvent.click(submitButton);

      timer.checkpoint('Submit button clicked');

      // Wait for API response with debugging
      await waitFor(() => {
        debugAssertion('API called', true, mockApiRequest.mock.calls.length > 0);
        expect(mockApiRequest).toHaveBeenCalledWith('POST', '/api/explain-code', {
          code: 'console.log("debug test");',
          language: 'javascript'
        });
      });

      timer.checkpoint('API call completed');

      // Debug each UI element mapping
      debugger.log('Checking explanation text mapping');
      await waitFor(() => {
        const explanationElement = screen.queryByText('Debug test explanation');
        debugDomState('Explanation element', explanationElement);
        debugAssertion('Explanation displayed', true, explanationElement !== null);
        expect(explanationElement).toBeInTheDocument();
      });

      debugger.log('Checking key points mapping');
      const keyPoint1 = screen.queryByText('Debug point 1');
      const keyPoint2 = screen.queryByText('Debug point 2');
      debugDomState('Key point 1', keyPoint1);
      debugDomState('Key point 2', keyPoint2);
      debugAssertion('Key points displayed', 2, [keyPoint1, keyPoint2].filter(Boolean).length);
      expect(keyPoint1).toBeInTheDocument();
      expect(keyPoint2).toBeInTheDocument();

      debugger.log('Checking step-by-step mapping');
      const step1 = screen.queryByText('Debug Step 1');
      const step2 = screen.queryByText('Debug Step 2');
      debugDomState('Step 1', step1);
      debugDomState('Step 2', step2);
      debugAssertion('Steps displayed', 2, [step1, step2].filter(Boolean).length);
      expect(step1).toBeInTheDocument();
      expect(step2).toBeInTheDocument();

      debugger.log('Checking concepts mapping');
      const concept = screen.queryByText('Debug Concept');
      debugDomState('Concept', concept);
      debugAssertion('Concept displayed', true, concept !== null);
      expect(concept).toBeInTheDocument();

      debugger.log('Checking performance notes mapping');
      const performanceNotes = screen.queryByText('Debug performance notes');
      debugDomState('Performance notes', performanceNotes);
      debugAssertion('Performance notes displayed', true, performanceNotes !== null);
      expect(performanceNotes).toBeInTheDocument();

      timer.checkpoint('All assertions completed');
      debugger.log('API response mapping test completed successfully');
    });

    it('should debug malformed API response handling', async () => {
      debugger.log('Starting malformed API response test');
      
      const malformedResponse = {
        explanation: null, // Should be string
        detectedLanguage: 'javascript',
        keyPoints: 'Not an array', // Should be array
        stepByStep: undefined, // Should be array
        concepts: null, // Should be array
        performanceNotes: 123, // Should be string
        responseTime: 'slow' // Should be number
      };

      const mockApiRequest = createDebugMock('apiRequest-malformed', malformedResponse);
      vi.mocked(apiRequest).mockImplementation(mockApiRequest);

      debugRender('Home', { testMode: true });
      renderWithProviders(<Home />);

      const codeInput = screen.getByPlaceholderText(/paste your code here/i);
      debugUserAction('type', 'code input', 'malformed test');
      fireEvent.change(codeInput, { target: { value: 'malformed test' } });

      const submitButton = screen.getByRole('button', { name: /explain code/i });
      debugUserAction('click', 'submit button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        debugAssertion('API called with malformed response', true, mockApiRequest.mock.calls.length > 0);
        expect(mockApiRequest).toHaveBeenCalled();
      });

      // Debug error handling
      debugger.log('Checking error handling for malformed response');
      await waitFor(() => {
        const errorElement = screen.queryByText(/error/i);
        const noDataElement = screen.queryByText(/no explanation available/i);
        
        debugDomState('Error element', errorElement);
        debugDomState('No data element', noDataElement);
        
        const hasErrorHandling = errorElement || noDataElement;
        debugAssertion('Error handling present', true, hasErrorHandling !== null);
        expect(hasErrorHandling).toBeTruthy();
      });

      debugger.log('Malformed API response test completed');
    });

    it('should debug data persistence between requests', async () => {
      debugger.log('Starting data persistence test');
      
      const firstResponse = {
        explanation: 'First debug explanation',
        detectedLanguage: 'javascript',
        keyPoints: ['First debug point'],
        stepByStep: [{ step: 'First step', description: 'First description', color: 'blue' }],
        concepts: [{ name: 'First concept', description: 'First concept description' }],
        responseTime: 100
      };

      const secondResponse = {
        explanation: 'Second debug explanation',
        detectedLanguage: 'python',
        keyPoints: ['Second debug point'],
        stepByStep: [{ step: 'Second step', description: 'Second description', color: 'green' }],
        concepts: [{ name: 'Second concept', description: 'Second concept description' }],
        responseTime: 150
      };

      const mockApiRequest = vi.fn()
        .mockResolvedValueOnce(firstResponse)
        .mockResolvedValueOnce(secondResponse);
      
      vi.mocked(apiRequest).mockImplementation(mockApiRequest);

      debugRender('Home', { testMode: true });
      renderWithProviders(<Home />);

      // First request
      debugger.log('Making first API request');
      const codeInput = screen.getByPlaceholderText(/paste your code here/i);
      debugUserAction('type', 'code input', 'first request');
      fireEvent.change(codeInput, { target: { value: 'first request' } });

      const submitButton = screen.getByRole('button', { name: /explain code/i });
      debugUserAction('click', 'submit button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const firstExplanation = screen.queryByText('First debug explanation');
        debugDomState('First explanation', firstExplanation);
        debugAssertion('First explanation displayed', true, firstExplanation !== null);
        expect(firstExplanation).toBeInTheDocument();
      });

      timer.checkpoint('First request completed');

      // Second request
      debugger.log('Making second API request');
      debugUserAction('clear and type', 'code input', 'second request');
      fireEvent.change(codeInput, { target: { value: 'second request' } });
      
      debugUserAction('click', 'submit button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const secondExplanation = screen.queryByText('Second debug explanation');
        debugDomState('Second explanation', secondExplanation);
        debugAssertion('Second explanation displayed', true, secondExplanation !== null);
        expect(secondExplanation).toBeInTheDocument();
      });

      timer.checkpoint('Second request completed');

      // Verify data isolation (no mixing)
      debugger.log('Verifying data isolation');
      const firstExplanationCheck = screen.queryByText('First debug explanation');
      const firstPointCheck = screen.queryByText('First debug point');
      const firstConceptCheck = screen.queryByText('First concept');
      
      debugDomState('First explanation check', firstExplanationCheck);
      debugDomState('First point check', firstPointCheck);
      debugDomState('First concept check', firstConceptCheck);
      
      debugAssertion('First explanation not present', null, firstExplanationCheck);
      debugAssertion('First point not present', null, firstPointCheck);
      debugAssertion('First concept not present', null, firstConceptCheck);
      
      expect(firstExplanationCheck).not.toBeInTheDocument();
      expect(firstPointCheck).not.toBeInTheDocument();
      expect(firstConceptCheck).not.toBeInTheDocument();

      debugger.log('Data persistence test completed successfully');
    });

    it('should debug API error scenarios', async () => {
      debugger.log('Starting API error scenarios test');
      
      const networkError = new Error('Network connection failed');
      const mockApiRequest = createDebugMock('apiRequest-error', networkError);
      vi.mocked(apiRequest).mockImplementation(mockApiRequest);

      debugRender('Home', { testMode: true });
      renderWithProviders(<Home />);

      const codeInput = screen.getByPlaceholderText(/paste your code here/i);
      debugUserAction('type', 'code input', 'error test');
      fireEvent.change(codeInput, { target: { value: 'error test' } });

      const submitButton = screen.getByRole('button', { name: /explain code/i });
      debugUserAction('click', 'submit button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        debugAssertion('API called with error', true, mockApiRequest.mock.calls.length > 0);
        expect(mockApiRequest).toHaveBeenCalled();
      });

      // Debug error display
      debugger.log('Checking error display');
      await waitFor(() => {
        const errorElement = screen.queryByText(/error/i);
        debugDomState('Error element', errorElement);
        debugAssertion('Error displayed', true, errorElement !== null);
        expect(errorElement).toBeInTheDocument();
      });

      // Debug UI state after error
      debugger.log('Checking UI state after error');
      const submitButtonAfterError = screen.getByRole('button', { name: /explain code/i });
      debugDomState('Submit button after error', submitButtonAfterError);
      debugAssertion('Submit button enabled after error', false, submitButtonAfterError.disabled);
      expect(submitButtonAfterError).not.toBeDisabled();

      debugger.log('API error scenarios test completed');
    });
  });

  describe('Performance Debugging', () => {
    it('should debug performance with large inputs', async () => {
      debugger.log('Starting performance debugging test');
      
      const largeCode = Array(1000).fill('console.log("performance test");').join('\n');
      debugger.log('Generated large code input', { length: largeCode.length });

      const mockResponse = {
        explanation: 'Performance test explanation',
        detectedLanguage: 'javascript',
        keyPoints: ['Performance test point'],
        stepByStep: [],
        concepts: [],
        responseTime: 500
      };

      const mockApiRequest = createDebugMock('apiRequest-performance', mockResponse);
      vi.mocked(apiRequest).mockImplementation(mockApiRequest);

      debugRender('Home', { testMode: true });
      renderWithProviders(<Home />);

      const codeInput = screen.getByPlaceholderText(/paste your code here/i);
      
      // Measure input performance
      const startTime = performance.now();
      debugUserAction('type', 'code input', `large input (${largeCode.length} chars)`);
      fireEvent.change(codeInput, { target: { value: largeCode } });
      const endTime = performance.now();
      
      const inputTime = endTime - startTime;
      debugger.log('Input performance measured', { 
        inputTime: `${inputTime}ms`, 
        charactersPerMs: largeCode.length / inputTime 
      });
      
      debugAssertion('Input performance acceptable', true, inputTime < 1000);
      expect(inputTime).toBeLessThan(1000);

      const submitButton = screen.getByRole('button', { name: /explain code/i });
      debugUserAction('click', 'submit button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        const explanation = screen.queryByText('Performance test explanation');
        debugDomState('Performance explanation', explanation);
        debugAssertion('Performance explanation displayed', true, explanation !== null);
        expect(explanation).toBeInTheDocument();
      });

      debugger.log('Performance debugging test completed');
    });
  });
});