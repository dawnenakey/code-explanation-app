# Testing Guide for Code Explanation Application

## Overview

This project includes comprehensive automated testing for the frontend using Vitest, React Testing Library, and Jest-DOM. The testing suite covers unit tests, integration tests, and end-to-end user flow tests.

## Test Structure

```
client/src/
├── __tests__/
│   ├── integration/         # Integration tests
│   ├── e2e/                # End-to-end user flow tests
│   ├── performance/        # Performance tests
│   ├── utils/              # Test utilities and helpers
│   ├── App.test.tsx        # Main app tests
│   └── simple.test.tsx     # Basic component tests
├── components/
│   └── __tests__/          # Component-specific tests
├── lib/
│   └── __tests__/          # Library/utility tests
└── pages/
    └── __tests__/          # Page-specific tests
```

## Test Categories

### Unit Tests
- **Components**: Testing individual UI components (Button, Toast, etc.)
- **Utilities**: Testing helper functions and utilities
- **API Layer**: Testing API request functions and error handling

### Integration Tests
- **Code Explanation Flow**: Testing the complete code explanation workflow
- **Form Validation**: Testing form input validation and error states
- **API Integration**: Testing API calls with mocked responses

### End-to-End Tests
- **User Journey**: Testing complete user workflows from input to output
- **Error Scenarios**: Testing how the app handles various error conditions
- **Performance**: Testing app performance under different conditions

### Performance Tests
- **Load Testing**: Testing app behavior with large code inputs
- **Response Time**: Testing UI responsiveness during API calls
- **Memory Usage**: Testing for memory leaks and resource cleanup

## Running Tests

### Run All Tests
```bash
npx vitest run
```

### Run Tests in Watch Mode
```bash
npx vitest
```

### Run Specific Test File
```bash
npx vitest run client/src/__tests__/simple.test.tsx
```

### Run Tests with UI
```bash
npx vitest --ui
```

### Run Tests with Coverage
```bash
npx vitest run --coverage
```

## Test Scenarios Covered

### Happy Path Scenarios
- ✅ User enters valid code and gets explanation
- ✅ User selects different programming languages
- ✅ User receives structured explanations with key points
- ✅ User sees step-by-step breakdowns
- ✅ User views programming concepts and performance notes

### Error Handling Scenarios
- ✅ Network connection errors
- ✅ Server timeout errors
- ✅ API rate limiting
- ✅ Invalid code input
- ✅ Form validation errors
- ✅ Empty input handling

### Edge Cases
- ✅ Very large code inputs
- ✅ Malformed code snippets
- ✅ Complex nested code structures
- ✅ Rapid successive requests
- ✅ Component unmounting during API calls

### Accessibility & UX
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Loading states and feedback
- ✅ Error message clarity
- ✅ Responsive design testing

## Test Utilities

### Custom Render Function
```typescript
import { renderWithProviders } from '../utils/testUtils'

// Renders components with React Query provider
renderWithProviders(<MyComponent />)
```

### Mock Data
```typescript
import { mockCodeExplanationResult, testScenarios } from '../utils/testUtils'

// Use predefined mock data for consistent testing
vi.mocked(apiRequest).mockResolvedValue(mockCodeExplanationResult)
```

### Common Assertions
```typescript
import { commonAssertions } from '../utils/testUtils'

// Use predefined assertions for consistency
commonAssertions.shouldDisplayExplanation('This code prints...')
```

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Keep tests focused on single behaviors
- Use `beforeEach` for common setup

### Mocking Strategy
- Mock external API calls using `vi.mock()`
- Mock only what's necessary for the test
- Use realistic mock data that matches actual API responses
- Clean up mocks with `vi.clearAllMocks()` in `beforeEach`

### Async Testing
- Use `waitFor` for async operations
- Test loading states explicitly
- Handle promise rejections properly
- Test cleanup for unmounted components

### Error Testing
- Test both happy path and error scenarios
- Verify error messages are user-friendly
- Test error recovery mechanisms
- Ensure errors don't crash the application

## Continuous Integration

### Test Automation
- Tests run automatically on code changes
- Pre-commit hooks ensure tests pass before commits
- CI/CD pipeline includes test execution
- Test coverage reports are generated

### Test Data Management
- Use consistent test data across all tests
- Keep test data separate from application data
- Clean up test data after each test
- Use factories for creating test objects

## Debugging Tests

### Common Issues
- **Component not rendering**: Check if providers are properly wrapped
- **Async operations not working**: Ensure proper use of `waitFor`
- **Mock not being called**: Verify mock setup and function signatures
- **Tests timing out**: Increase timeout or optimize test setup

### Debug Tools
- Use `screen.debug()` to see rendered HTML
- Add `console.log` statements for debugging
- Use Vitest UI for interactive debugging
- Check browser dev tools for detailed errors

## Adding New Tests

### Component Tests
1. Create test file in `components/__tests__/`
2. Import component and testing utilities
3. Test rendering, props, and user interactions
4. Test accessibility features

### Integration Tests
1. Create test file in `__tests__/integration/`
2. Mock external dependencies
3. Test complete workflows
4. Verify data flow between components

### Performance Tests
1. Create test file in `__tests__/performance/`
2. Test with large data sets
3. Measure render times
4. Test memory usage patterns

## Test Coverage Goals

- **Unit Tests**: 90%+ coverage for components and utilities
- **Integration Tests**: Cover all major user workflows
- **E2E Tests**: Cover critical business paths
- **Performance Tests**: Test scalability limits

## Maintenance

### Regular Tasks
- Update test data when API changes
- Refactor tests when components change
- Add tests for new features
- Remove obsolete tests

### Test Review
- Review test failures immediately
- Update tests with feature changes
- Ensure tests remain fast and reliable
- Keep test documentation up to date

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

This testing framework ensures the code explanation application is robust, reliable, and ready for production deployment with comprehensive test coverage for all features and edge cases.