import { vi } from 'vitest';

/**
 * Debug utilities for testing
 */
export class TestDebugger {
  private static instance: TestDebugger;
  private debugMode: boolean = false;
  private logs: string[] = [];

  static getInstance(): TestDebugger {
    if (!TestDebugger.instance) {
      TestDebugger.instance = new TestDebugger();
    }
    return TestDebugger.instance;
  }

  enableDebug(enabled: boolean = true) {
    this.debugMode = enabled;
    if (enabled) {
      console.log('🔍 Test debugging enabled');
    }
  }

  log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    this.logs.push(logEntry);
    
    if (this.debugMode) {
      console.log(`🔍 ${logEntry}`, data || '');
    }
  }

  error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message}`;
    
    this.logs.push(logEntry);
    
    if (this.debugMode) {
      console.error(`🚨 ${logEntry}`, error || '');
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  dumpLogs() {
    console.log('=== Test Debug Logs ===');
    this.logs.forEach(log => console.log(log));
    console.log('=== End Debug Logs ===');
  }
}

/**
 * Mock API response debugger
 */
export function createDebugMock(mockName: string, response: any) {
  const debugger = TestDebugger.getInstance();
  
  return vi.fn().mockImplementation((...args) => {
    debugger.log(`Mock called: ${mockName}`, { args, response });
    
    if (response instanceof Error) {
      debugger.error(`Mock error: ${mockName}`, response);
      throw response;
    }
    
    return Promise.resolve(response);
  });
}

/**
 * Component render debugger
 */
export function debugRender(componentName: string, props?: any) {
  const debugger = TestDebugger.getInstance();
  debugger.log(`Rendering component: ${componentName}`, props);
}

/**
 * User interaction debugger
 */
export function debugUserAction(action: string, element: string, value?: any) {
  const debugger = TestDebugger.getInstance();
  debugger.log(`User action: ${action} on ${element}`, { value });
}

/**
 * API call debugger
 */
export function debugApiCall(endpoint: string, method: string, data?: any) {
  const debugger = TestDebugger.getInstance();
  debugger.log(`API call: ${method} ${endpoint}`, data);
}

/**
 * Test assertion debugger
 */
export function debugAssertion(description: string, expected: any, actual: any) {
  const debugger = TestDebugger.getInstance();
  debugger.log(`Assertion: ${description}`, { expected, actual });
}

/**
 * DOM state debugger
 */
export function debugDomState(description: string, element?: HTMLElement) {
  const debugger = TestDebugger.getInstance();
  
  if (element) {
    debugger.log(`DOM state: ${description}`, {
      tagName: element.tagName,
      className: element.className,
      textContent: element.textContent?.substring(0, 100),
      innerHTML: element.innerHTML?.substring(0, 200)
    });
  } else {
    debugger.log(`DOM state: ${description} - Element not found`);
  }
}

/**
 * Test timing debugger
 */
export class TestTimer {
  private startTime: number;
  private debugger: TestDebugger;

  constructor(private testName: string) {
    this.debugger = TestDebugger.getInstance();
    this.startTime = Date.now();
    this.debugger.log(`Test started: ${testName}`);
  }

  checkpoint(description: string) {
    const elapsed = Date.now() - this.startTime;
    this.debugger.log(`Checkpoint: ${description} (${elapsed}ms)`);
  }

  finish() {
    const elapsed = Date.now() - this.startTime;
    this.debugger.log(`Test finished: ${this.testName} (${elapsed}ms)`);
  }
}

/**
 * Network request debugger
 */
export function debugNetworkRequest(url: string, options: any, response: any) {
  const debugger = TestDebugger.getInstance();
  debugger.log(`Network request: ${url}`, {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body,
    responseStatus: response.status,
    responseData: response.data
  });
}

/**
 * State change debugger
 */
export function debugStateChange(stateName: string, oldValue: any, newValue: any) {
  const debugger = TestDebugger.getInstance();
  debugger.log(`State change: ${stateName}`, {
    from: oldValue,
    to: newValue
  });
}

/**
 * Error boundary debugger
 */
export function debugError(error: Error, componentStack?: string) {
  const debugger = TestDebugger.getInstance();
  debugger.error('Component error caught', {
    message: error.message,
    stack: error.stack,
    componentStack
  });
}

/**
 * Test environment debugger
 */
export function debugEnvironment() {
  const debugger = TestDebugger.getInstance();
  debugger.log('Test environment info', {
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language
  });
}

/**
 * Memory usage debugger
 */
export function debugMemoryUsage(description: string) {
  const debugger = TestDebugger.getInstance();
  
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    debugger.log(`Memory usage: ${description}`, {
      usedJSHeapSize: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      totalJSHeapSize: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      jsHeapSizeLimit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
    });
  } else {
    debugger.log(`Memory usage: ${description} - Not available in this environment`);
  }
}

/**
 * Debug configuration
 */
export const debugConfig = {
  enabled: process.env.NODE_ENV === 'test' && process.env.DEBUG_TESTS === 'true',
  logLevel: process.env.DEBUG_LOG_LEVEL || 'info',
  saveToFile: process.env.DEBUG_SAVE_LOGS === 'true'
};

/**
 * Initialize debugging for a test suite
 */
export function initializeTestDebugging(suiteName: string) {
  const debugger = TestDebugger.getInstance();
  
  if (debugConfig.enabled) {
    debugger.enableDebug(true);
    debugger.log(`Initializing test suite: ${suiteName}`);
    debugEnvironment();
    debugMemoryUsage('Initial');
  }
  
  return debugger;
}

/**
 * Cleanup debugging after test suite
 */
export function cleanupTestDebugging() {
  const debugger = TestDebugger.getInstance();
  
  if (debugConfig.enabled) {
    debugMemoryUsage('Final');
    debugger.log('Test suite cleanup completed');
    
    if (debugConfig.saveToFile) {
      debugger.dumpLogs();
    }
    
    debugger.clearLogs();
  }
}