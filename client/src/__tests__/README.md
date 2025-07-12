# Frontend Testing Suite

This directory contains comprehensive automated tests for the Code Explanation Application frontend. The testing framework is designed to ensure reliability, catch regressions, and validate hotfixes and feature requests.

## Quick Start

```bash
# Run all tests
npx vitest run

# Run tests in watch mode for development
npx vitest

# Run specific test file
npx vitest run client/src/__tests__/simple.test.tsx

# Run tests with UI dashboard
npx vitest --ui
```

## Test Categories

### 🧪 Unit Tests
- **Component Tests**: Individual UI components (Button, Toast, etc.)
- **Utility Tests**: Helper functions and API utilities
- **Hook Tests**: Custom React hooks

### 🔗 Integration Tests
- **Code Explanation Workflow**: End-to-end code explanation process
- **Form Validation**: Input validation and error handling
- **API Integration**: Mocked API calls and responses

### 🚀 Performance Tests
- **Load Testing**: Large code inputs and stress testing
- **Memory Usage**: Resource cleanup and memory leaks
- **Response Time**: UI responsiveness during operations

### 🎯 End-to-End Tests
- **User Journeys**: Complete user workflows
- **Error Recovery**: Handling network and server errors
- **Accessibility**: Keyboard navigation and screen readers

## Test Files Structure

```
__tests__/
├── integration/         # Full workflow tests
├── e2e/                # End-to-end user flow tests
├── performance/        # Load and performance tests
├── utils/              # Test utilities and helpers
├── App.test.tsx        # Main application tests
└── simple.test.tsx     # Basic component tests

components/__tests__/    # Component-specific tests
├── Button.test.tsx
├── Toast.test.tsx
└── ...

lib/__tests__/          # Utility and library tests
├── queryClient.test.ts
└── ...

pages/__tests__/        # Page component tests
├── Home.test.tsx
└── ...
```

## Key Features Tested

### ✅ Happy Path Scenarios
- User enters valid code and receives AI explanation
- Language selection and switching
- Structured explanations with key points
- Step-by-step code breakdowns
- Programming concepts and performance notes

### ❌ Error Handling
- Network connection failures
- Server timeout errors
- Invalid code input validation
- Form submission errors
- API rate limiting

### 🔧 Edge Cases
- Very large code inputs (>10,000 characters)
- Malformed or syntax-error code
- Complex nested code structures
- Rapid successive API requests
- Component unmounting during operations

### ♿ Accessibility & UX
- Keyboard navigation support
- Screen reader compatibility
- Loading states and user feedback
- Clear error messages
- Responsive design validation

## Test Utilities

### Custom Render Function
```typescript
import { renderWithProviders } from './utils/testUtils'

// Automatically provides React Query context
renderWithProviders(<YourComponent />)
```

### Mock Data
```typescript
import { 
  mockCodeExplanationResult, 
  testScenarios 
} from './utils/testUtils'

// Predefined test scenarios
testScenarios.validJavaScriptCode
testScenarios.complexCode
testScenarios.malformedCode
```

### API Mocking
```typescript
import { apiRequest } from '@/lib/queryClient'

// Mock API responses
vi.mocked(apiRequest).mockResolvedValue(mockResponse)
```

## Running Tests for Different Scenarios

### Testing Hotfixes
```bash
# Run tests related to specific components
npx vitest run client/src/components/__tests__/Button.test.tsx

# Run integration tests to ensure no regressions
npx vitest run client/src/__tests__/integration/
```

### Testing New Features
```bash
# Run full test suite
npx vitest run

# Run with coverage to identify untested code
npx vitest run --coverage
```

### Performance Testing
```bash
# Run performance-specific tests
npx vitest run client/src/__tests__/performance/
```

## Test Coverage Goals

- **Unit Tests**: 90%+ coverage for components and utilities
- **Integration Tests**: All major user workflows covered
- **Error Handling**: All error scenarios tested
- **Performance**: Edge cases and load testing

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Use Realistic Data**: Test with data that matches production scenarios
3. **Clean Up**: Ensure tests don't interfere with each other
4. **Be Specific**: Test names should clearly describe the expected behavior
5. **Mock External Dependencies**: Keep tests isolated and fast

## Continuous Integration

This testing suite is designed to:
- Run automatically on code changes
- Prevent regressions in hotfixes
- Validate new feature implementations
- Ensure accessibility standards
- Maintain performance benchmarks

## Common Test Patterns

### Component Testing
```typescript
describe('ComponentName', () => {
  it('should render with correct props', () => {
    render(<Component prop="value" />)
    expect(screen.getByText('value')).toBeInTheDocument()
  })
})
```

### Async Testing
```typescript
it('should handle async operations', async () => {
  render(<AsyncComponent />)
  await waitFor(() => {
    expect(screen.getByText('loaded')).toBeInTheDocument()
  })
})
```

### Error Testing
```typescript
it('should handle errors gracefully', async () => {
  vi.mocked(apiRequest).mockRejectedValue(new Error('API Error'))
  render(<Component />)
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

This comprehensive testing suite ensures the Code Explanation Application is robust, reliable, and ready for production use with full confidence in hotfixes and feature deployments.