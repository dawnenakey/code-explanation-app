import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement } from 'react'

// Create a custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions = {}
) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Mock data for testing
export const mockCodeExplanationResult = {
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

export const mockPythonResult = {
  ...mockCodeExplanationResult,
  detectedLanguage: 'python',
  explanation: 'This Python code prints "Hello, World!" to the console.',
  keyPoints: [
    'Uses print() function',
    'Prints string literal',
    'Basic Python syntax'
  ],
  stepByStep: [
    {
      step: 'Function Call',
      description: 'Calls the print() function',
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
      name: 'print()',
      description: 'Built-in Python function for outputting text to the console'
    },
    {
      name: 'String Literal',
      description: 'A sequence of characters enclosed in quotes'
    }
  ]
}

// Common test scenarios
export const testScenarios = {
  validJavaScriptCode: 'console.log("Hello, World!");',
  validPythonCode: 'print("Hello, World!")',
  validJavaCode: 'System.out.println("Hello, World!");',
  emptyCode: '',
  longCode: 'a'.repeat(15000),
  complexCode: `
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    console.log(fibonacci(10));
  `,
  malformedCode: 'console.log("unterminated string'
}

// Common assertions
export const commonAssertions = {
  shouldDisplayExplanation: (text: string) => expect(screen.getByText(text)).toBeInTheDocument(),
  shouldShowError: () => expect(screen.getByText(/error/i)).toBeInTheDocument(),
  shouldShowValidation: (message: string) => expect(screen.getByText(message)).toBeInTheDocument(),
  shouldCallApiWith: (apiRequest: any, endpoint: string, data: any) => {
    expect(apiRequest).toHaveBeenCalledWith(endpoint, {
      method: 'POST',
      data
    })
  }
}

// Re-export testing library utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'