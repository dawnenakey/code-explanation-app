# Debug Testing Guide

## Overview

Your testing framework now includes comprehensive debugging capabilities to help identify and fix issues quickly. This guide shows you how to use the debugging features effectively.

## 🔍 **Automated Debug Testing**

### **GitHub Actions Debug Workflows**

#### **1. Debug Testing Suite**
Runs automatically on push/PR with detailed debugging information:
- Environment debugging
- Test execution with verbose output
- Failure analysis
- Performance profiling
- Debug artifacts collection

#### **2. Manual Debug Trigger**
You can manually trigger debug tests with custom options:
1. Go to GitHub Actions tab
2. Click "Debug Testing Suite"
3. Click "Run workflow"
4. Choose debug level: `basic`, `verbose`, or `detailed`
5. Choose test type: `all`, `qa-only`, `integration-only`, or `e2e-only`

### **Debug Levels**

#### **Basic Debug**
- Standard test output
- Environment information
- Basic error logging

#### **Verbose Debug**
- Detailed test execution logs
- API call debugging
- Component rendering info
- User interaction tracking

#### **Detailed Debug**
- Performance profiling
- Memory usage analysis
- Network request logging
- State change tracking

## 🛠 **Local Debug Testing**

### **Enable Debug Mode**
```bash
# Enable debug output for tests
DEBUG_TESTS=true npm run test:qa

# Enable debug logging with specific level
DEBUG_TESTS=true DEBUG_LOG_LEVEL=verbose npm run test

# Save debug logs to file
DEBUG_TESTS=true DEBUG_SAVE_LOGS=true npm run test
```

### **Debug Specific Test Files**
```bash
# Debug QA tests only
DEBUG_TESTS=true npx vitest run client/src/__tests__/qa/DebugDataFlowTesting.test.tsx

# Debug with verbose output
DEBUG_TESTS=true npx vitest run client/src/__tests__/qa/ --reporter=verbose
```

### **Using Debug Utilities in Tests**

#### **1. Test Debugger**
```typescript
import { TestDebugger, initializeTestDebugging } from '../utils/debugUtils';

describe('My Test Suite', () => {
  let debugger: TestDebugger;

  beforeEach(() => {
    debugger = initializeTestDebugging('My Test Suite');
  });

  it('should debug test execution', () => {
    debugger.log('Starting test execution');
    // Your test code here
    debugger.log('Test completed');
  });
});
```

#### **2. Mock Debugging**
```typescript
import { createDebugMock } from '../utils/debugUtils';

const mockApiRequest = createDebugMock('apiRequest', mockResponse);
vi.mocked(apiRequest).mockImplementation(mockApiRequest);
```

#### **3. User Interaction Debugging**
```typescript
import { debugUserAction, debugDomState } from '../utils/debugUtils';

// Debug user actions
debugUserAction('click', 'submit button');
fireEvent.click(submitButton);

// Debug DOM state
debugDomState('Button after click', submitButton);
```

#### **4. Performance Debugging**
```typescript
import { TestTimer, debugMemoryUsage } from '../utils/debugUtils';

const timer = new TestTimer('Performance Test');
timer.checkpoint('After component render');
debugMemoryUsage('After API call');
timer.finish();
```

## 📊 **Debug Output Examples**

### **Successful Test Debug Output**
```
🔍 [2025-01-12T13:00:00.000Z] Initializing test suite: Debug Data Flow Testing
🔍 [2025-01-12T13:00:00.100Z] Test started: API response mapping test
🔍 [2025-01-12T13:00:00.200Z] Mock called: apiRequest
🔍 [2025-01-12T13:00:00.300Z] Rendering component: Home
🔍 [2025-01-12T13:00:00.400Z] User action: type on code input
🔍 [2025-01-12T13:00:00.500Z] DOM state: Submit button before click
🔍 [2025-01-12T13:00:00.600Z] User action: click on submit button
🔍 [2025-01-12T13:00:00.700Z] Checkpoint: API call completed (500ms)
🔍 [2025-01-12T13:00:00.800Z] Assertion: Explanation displayed
🔍 [2025-01-12T13:00:00.900Z] Test finished: API response mapping test (900ms)
```

### **Failed Test Debug Output**
```
🔍 [2025-01-12T13:00:00.000Z] Test started: API error handling test
🚨 [2025-01-12T13:00:00.100Z] ERROR: Mock error: apiRequest-error
🔍 [2025-01-12T13:00:00.200Z] DOM state: Error element - Element not found
🔍 [2025-01-12T13:00:00.300Z] Assertion: Error displayed - Expected: true, Actual: false
🚨 [2025-01-12T13:00:00.400Z] ERROR: Test assertion failed
```

## 🔧 **Debug Configuration**

### **Environment Variables**
```bash
# Enable/disable debugging
DEBUG_TESTS=true

# Set debug log level
DEBUG_LOG_LEVEL=verbose  # info, verbose, detailed

# Save logs to file
DEBUG_SAVE_LOGS=true

# Debug specific test types
DEBUG_QA_TESTS=true
DEBUG_INTEGRATION_TESTS=true
DEBUG_E2E_TESTS=true
```

### **Custom Debug Configuration**
```typescript
// In your test file
import { debugConfig } from '../utils/debugUtils';

// Override debug settings
debugConfig.enabled = true;
debugConfig.logLevel = 'detailed';
debugConfig.saveToFile = true;
```

## 🎯 **Common Debug Scenarios**

### **1. API Response Issues**
```typescript
// Debug API mocking
const mockApiRequest = createDebugMock('apiRequest', mockResponse);
// Shows: request parameters, response data, timing

// Debug API assertions
debugAssertion('API called with correct data', expectedData, actualData);
```

### **2. Component Rendering Issues**
```typescript
// Debug component rendering
debugRender('ComponentName', props);

// Debug DOM state
debugDomState('Element description', element);
```

### **3. User Interaction Issues**
```typescript
// Debug user actions
debugUserAction('click', 'button element');
debugUserAction('type', 'input field', 'test value');
```

### **4. Performance Issues**
```typescript
// Debug timing
const timer = new TestTimer('Performance Test');
timer.checkpoint('After slow operation');

// Debug memory usage
debugMemoryUsage('After large data processing');
```

### **5. State Management Issues**
```typescript
// Debug state changes
debugStateChange('componentState', oldState, newState);
```

## 📋 **Debug Checklist**

### **Before Running Debug Tests**
- [ ] Enable debug mode with `DEBUG_TESTS=true`
- [ ] Set appropriate debug level
- [ ] Clear previous logs if needed
- [ ] Ensure test environment is clean

### **During Test Execution**
- [ ] Monitor debug output in real-time
- [ ] Check for error messages and warnings
- [ ] Verify mock calls and responses
- [ ] Track performance metrics

### **After Test Execution**
- [ ] Review complete debug logs
- [ ] Analyze failure patterns
- [ ] Check performance bottlenecks
- [ ] Save logs for future reference

## 🚀 **Advanced Debug Features**

### **1. Memory Profiling**
```typescript
debugMemoryUsage('Before test');
// Run test operations
debugMemoryUsage('After test');
```

### **2. Network Request Debugging**
```typescript
debugNetworkRequest(url, options, response);
```

### **3. Error Boundary Debugging**
```typescript
debugError(error, componentStack);
```

### **4. Environment Debugging**
```typescript
debugEnvironment();
// Shows: user agent, viewport, timezone, language
```

## 🔄 **Continuous Debugging**

### **1. Debug on Every Commit**
GitHub Actions automatically runs debug tests on every push, providing:
- Detailed execution logs
- Performance metrics
- Failure analysis
- Debug artifacts

### **2. Debug Reports**
- Downloadable debug logs
- Performance reports
- Memory usage analysis
- Error summaries

### **3. Debug Notifications**
- PR comments with debug results
- Failure notifications with debug info
- Performance alerts for slow tests

This comprehensive debugging system helps you identify issues quickly, understand test behavior, and maintain high code quality with minimal manual effort.