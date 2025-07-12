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

describe('Algorithmic Analysis and Code Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Performance Analysis', () => {
    it('should detect O(n²) complexity and suggest HashMap optimization', async () => {
      const nestedLoopCode = `
        function findPairs(arr) {
          const pairs = [];
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[i] + arr[j] === 10) {
                pairs.push([arr[i], arr[j]]);
              }
            }
          }
          return pairs;
        }
      `

      const mockResponse = {
        explanation: 'This function finds pairs of numbers that sum to 10.',
        detectedLanguage: 'javascript',
        keyPoints: [
          'Nested loops create O(n²) time complexity',
          'HashMap approach would be O(n) time complexity',
          'Space complexity is O(1) for current approach'
        ],
        stepByStep: [
          {
            step: 'Outer loop iteration',
            description: 'Iterates through each element in the array',
            color: 'blue'
          },
          {
            step: 'Inner loop iteration',
            description: 'For each outer element, checks all remaining elements',
            color: 'red'
          },
          {
            step: 'Sum calculation',
            description: 'Calculates sum of two elements and compares to target',
            color: 'green'
          }
        ],
        concepts: [
          {
            name: 'Time Complexity',
            description: 'O(n²) - nested loops iterate through all pairs'
          },
          {
            name: 'Space Complexity',
            description: 'O(1) - only storing result pairs'
          }
        ],
        performanceNotes: 'This loop has O(n²) complexity. Consider using a HashMap to reduce it to O(n). Store seen numbers in a Map and check if (target - current) exists.',
        optimizationSuggestions: [
          {
            issue: 'Nested loops causing O(n²) complexity',
            solution: 'Use HashMap/Set for O(n) lookup',
            example: 'const seen = new Map(); for (let num of arr) { if (seen.has(10 - num)) return true; seen.set(num, true); }'
          }
        ],
        responseTime: 200
      }

      vi.mocked(apiRequest).mockResolvedValue(mockResponse)

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: nestedLoopCode } })

      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/This loop has O\(n²\) complexity/)).toBeInTheDocument()
        expect(screen.getByText(/Consider using a HashMap to reduce it to O\(n\)/)).toBeInTheDocument()
      })

      // Check for algorithmic analysis
      expect(screen.getByText('Time Complexity')).toBeInTheDocument()
      expect(screen.getByText('O(n²) - nested loops iterate through all pairs')).toBeInTheDocument()
    })

    it('should analyze sorting algorithms and suggest optimizations', async () => {
      const bubbleSortCode = `
        function bubbleSort(arr) {
          const n = arr.length;
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
              if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              }
            }
          }
          return arr;
        }
      `

      const mockResponse = {
        explanation: 'This is a bubble sort implementation.',
        detectedLanguage: 'javascript',
        keyPoints: [
          'Bubble sort has O(n²) time complexity',
          'Not efficient for large datasets',
          'In-place sorting algorithm'
        ],
        stepByStep: [
          {
            step: 'Compare adjacent elements',
            description: 'Compares each pair of adjacent elements',
            color: 'blue'
          },
          {
            step: 'Swap if needed',
            description: 'Swaps elements if they are in wrong order',
            color: 'red'
          }
        ],
        concepts: [
          {
            name: 'Bubble Sort',
            description: 'Simple sorting algorithm with O(n²) complexity'
          },
          {
            name: 'Algorithm Efficiency',
            description: 'Time and space complexity analysis'
          }
        ],
        performanceNotes: 'Bubble sort has O(n²) time complexity. For better performance, consider: QuickSort O(n log n), MergeSort O(n log n), or built-in Array.sort().',
        optimizationSuggestions: [
          {
            issue: 'Inefficient O(n²) sorting algorithm',
            solution: 'Use more efficient sorting algorithms',
            example: 'arr.sort((a, b) => a - b) // Built-in sort, typically O(n log n)'
          },
          {
            issue: 'Multiple unnecessary comparisons',
            solution: 'Add early termination for sorted arrays',
            example: 'let swapped = false; if (!swapped) break; // Early exit optimization'
          }
        ],
        responseTime: 180
      }

      vi.mocked(apiRequest).mockResolvedValue(mockResponse)

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: bubbleSortCode } })

      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Bubble sort has O\(n²\) time complexity/)).toBeInTheDocument()
        expect(screen.getByText(/consider: QuickSort O\(n log n\)/)).toBeInTheDocument()
      })
    })

    it('should analyze data structure usage and suggest improvements', async () => {
      const inefficientArrayCode = `
        function findUser(users, id) {
          for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
              return users[i];
            }
          }
          return null;
        }
      `

      const mockResponse = {
        explanation: 'This function searches for a user by ID in an array.',
        detectedLanguage: 'javascript',
        keyPoints: [
          'Linear search through array - O(n) complexity',
          'No indexing or caching used',
          'Simple but inefficient for large datasets'
        ],
        stepByStep: [
          {
            step: 'Iterate through array',
            description: 'Loops through each user in the array',
            color: 'blue'
          },
          {
            step: 'Compare IDs',
            description: 'Checks if current user ID matches target ID',
            color: 'green'
          }
        ],
        concepts: [
          {
            name: 'Linear Search',
            description: 'O(n) time complexity - checks each element sequentially'
          },
          {
            name: 'Data Structure Choice',
            description: 'Array vs HashMap for different use cases'
          }
        ],
        performanceNotes: 'Linear search is O(n). If you frequently search by ID, consider using a Map/Object for O(1) lookup: const userMap = new Map(users.map(u => [u.id, u]))',
        optimizationSuggestions: [
          {
            issue: 'O(n) linear search for frequent lookups',
            solution: 'Use HashMap/Map for O(1) lookup time',
            example: 'const userMap = new Map(users.map(u => [u.id, u])); return userMap.get(id);'
          },
          {
            issue: 'Rebuilding search index repeatedly',
            solution: 'Cache the Map for multiple lookups',
            example: 'const userIndex = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);'
          }
        ],
        responseTime: 160
      }

      vi.mocked(apiRequest).mockResolvedValue(mockResponse)

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: inefficientArrayCode } })

      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Linear search is O\(n\)/)).toBeInTheDocument()
        expect(screen.getByText(/consider using a Map\/Object for O\(1\) lookup/)).toBeInTheDocument()
      })
    })

    it('should analyze recursive algorithms and suggest optimizations', async () => {
      const fibonacciCode = `
        function fibonacci(n) {
          if (n <= 1) return n;
          return fibonacci(n - 1) + fibonacci(n - 2);
        }
      `

      const mockResponse = {
        explanation: 'This is a recursive Fibonacci implementation.',
        detectedLanguage: 'javascript',
        keyPoints: [
          'Recursive approach with exponential time complexity',
          'Recalculates same values multiple times',
          'Can cause stack overflow for large n'
        ],
        stepByStep: [
          {
            step: 'Base case check',
            description: 'Returns n if n <= 1',
            color: 'green'
          },
          {
            step: 'Recursive calls',
            description: 'Calls itself with n-1 and n-2',
            color: 'red'
          }
        ],
        concepts: [
          {
            name: 'Recursion',
            description: 'Function calling itself with smaller inputs'
          },
          {
            name: 'Dynamic Programming',
            description: 'Optimization technique for overlapping subproblems'
          }
        ],
        performanceNotes: 'Recursive Fibonacci has O(2^n) time complexity due to repeated calculations. Use memoization or iterative approach for O(n) complexity.',
        optimizationSuggestions: [
          {
            issue: 'Exponential O(2^n) time complexity',
            solution: 'Use memoization to cache results',
            example: 'const memo = {}; function fib(n) { if (n in memo) return memo[n]; return memo[n] = fib(n-1) + fib(n-2); }'
          },
          {
            issue: 'Stack overflow risk for large inputs',
            solution: 'Use iterative approach instead',
            example: 'let [a, b] = [0, 1]; for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; return b;'
          }
        ],
        responseTime: 190
      }

      vi.mocked(apiRequest).mockResolvedValue(mockResponse)

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: fibonacciCode } })

      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/O\(2\^n\) time complexity/)).toBeInTheDocument()
        expect(screen.getByText(/Use memoization/)).toBeInTheDocument()
      })
    })

    it('should analyze memory usage patterns and suggest improvements', async () => {
      const memoryIntensiveCode = `
        function processLargeArray(data) {
          const results = [];
          const intermediate = [];
          const cache = {};
          
          for (let item of data) {
            intermediate.push(item.value * 2);
            cache[item.id] = item;
            results.push(transform(item));
          }
          
          return results;
        }
      `

      const mockResponse = {
        explanation: 'This function processes a large array with multiple data structures.',
        detectedLanguage: 'javascript',
        keyPoints: [
          'Creates multiple arrays and objects',
          'Stores intermediate results unnecessarily',
          'Memory usage grows with input size'
        ],
        stepByStep: [
          {
            step: 'Initialize data structures',
            description: 'Creates results array, intermediate array, and cache object',
            color: 'blue'
          },
          {
            step: 'Process each item',
            description: 'Transforms data and stores in multiple places',
            color: 'yellow'
          }
        ],
        concepts: [
          {
            name: 'Space Complexity',
            description: 'Memory usage analysis - O(n) for each data structure'
          },
          {
            name: 'Memory Optimization',
            description: 'Techniques to reduce memory footprint'
          }
        ],
        performanceNotes: 'High memory usage due to multiple data structures. Consider: streaming processing, eliminate intermediate arrays, use generators for large datasets.',
        optimizationSuggestions: [
          {
            issue: 'Unnecessary intermediate array storage',
            solution: 'Process items directly without storing intermediates',
            example: 'for (let item of data) { results.push(transform(item)); } // Skip intermediate array'
          },
          {
            issue: 'Memory intensive for large datasets',
            solution: 'Use generator functions for streaming',
            example: 'function* processStream(data) { for (let item of data) yield transform(item); }'
          }
        ],
        responseTime: 210
      }

      vi.mocked(apiRequest).mockResolvedValue(mockResponse)

      renderWithProviders(<Home />)

      const codeInput = screen.getByPlaceholderText(/paste your code here/i)
      fireEvent.change(codeInput, { target: { value: memoryIntensiveCode } })

      const submitButton = screen.getByRole('button', { name: /explain code/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/High memory usage/)).toBeInTheDocument()
        expect(screen.getByText(/streaming processing/)).toBeInTheDocument()
      })
    })
  })
})