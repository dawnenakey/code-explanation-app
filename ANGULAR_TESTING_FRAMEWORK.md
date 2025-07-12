# Angular Testing Framework for QA

## Overview

This Angular testing framework covers comprehensive testing for Angular applications including components, templates, pipes, TypeScript logic, SCSS styling, and HTML rendering. It's designed to catch data flow issues, UI parity problems, and ensure code changes don't break functionality.

## Angular Testing Stack

### Core Testing Tools
- **Jasmine**: Testing framework for behavior-driven development
- **Karma**: Test runner for Angular applications
- **Angular Testing Utilities**: TestBed, ComponentFixture, async utilities
- **Protractor/Cypress**: End-to-end testing
- **ng-mocks**: Advanced mocking utilities for Angular

### Additional Testing Libraries
- **@angular/cdk/testing**: Component testing harnesses
- **@angular-devkit/build-angular**: Build and test configurations
- **jasmine-marbles**: Testing RxJS observables
- **spectator**: Simplified Angular testing

## Testing Structure

```
src/
├── app/
│   ├── components/
│   │   ├── code-explanation/
│   │   │   ├── code-explanation.component.ts
│   │   │   ├── code-explanation.component.html
│   │   │   ├── code-explanation.component.scss
│   │   │   └── code-explanation.component.spec.ts
│   │   └── shared/
│   │       ├── button/
│   │       │   ├── button.component.ts
│   │       │   ├── button.component.html
│   │       │   ├── button.component.scss
│   │       │   └── button.component.spec.ts
│   ├── pipes/
│   │   ├── code-highlighter.pipe.ts
│   │   └── code-highlighter.pipe.spec.ts
│   ├── services/
│   │   ├── code-explanation.service.ts
│   │   └── code-explanation.service.spec.ts
│   └── testing/
│       ├── mocks/
│       ├── fixtures/
│       └── test-utils.ts
├── e2e/
│   ├── src/
│   │   ├── app.e2e-spec.ts
│   │   ├── code-explanation.e2e-spec.ts
│   │   └── data-flow.e2e-spec.ts
└── karma.conf.js
```

## Component Testing Examples

### 1. Component with Template and SCSS Testing

```typescript
// code-explanation.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { CodeExplanationComponent } from './code-explanation.component';
import { CodeExplanationService } from '../../services/code-explanation.service';
import { LoadingService } from '../../services/loading.service';

describe('CodeExplanationComponent', () => {
  let component: CodeExplanationComponent;
  let fixture: ComponentFixture<CodeExplanationComponent>;
  let codeExplanationService: jasmine.SpyObj<CodeExplanationService>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  const mockExplanationResponse = {
    explanation: 'This code prints "Hello World" to the console.',
    detectedLanguage: 'javascript',
    keyPoints: ['Uses console.log function', 'Prints string literal'],
    stepByStep: [
      { step: 'Function Call', description: 'Calls console.log()', color: 'blue' }
    ],
    concepts: [
      { name: 'console.log', description: 'Built-in JavaScript function' }
    ],
    performanceNotes: 'Simple operation with minimal overhead',
    responseTime: 150
  };

  beforeEach(async () => {
    const codeExplanationServiceSpy = jasmine.createSpyObj('CodeExplanationService', 
      ['explainCode']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', 
      ['setLoading', 'getLoading']);

    await TestBed.configureTestingModule({
      declarations: [CodeExplanationComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: CodeExplanationService, useValue: codeExplanationServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CodeExplanationComponent);
    component = fixture.componentInstance;
    codeExplanationService = TestBed.inject(CodeExplanationService) as jasmine.SpyObj<CodeExplanationService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  describe('Template Rendering', () => {
    it('should render main heading', () => {
      fixture.detectChanges();
      const heading = fixture.debugElement.query(By.css('h1'));
      expect(heading.nativeElement.textContent).toContain('Code Explanation Tool');
    });

    it('should render code textarea with correct attributes', () => {
      fixture.detectChanges();
      const textarea = fixture.debugElement.query(By.css('textarea[data-testid="code-input"]'));
      
      expect(textarea).toBeTruthy();
      expect(textarea.nativeElement.placeholder).toBe('Paste your code here...');
      expect(textarea.nativeElement.rows).toBe(10);
    });

    it('should render language selector with options', () => {
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('select[data-testid="language-select"]'));
      const options = fixture.debugElement.queryAll(By.css('option'));
      
      expect(select).toBeTruthy();
      expect(options.length).toBeGreaterThan(1);
      expect(options[0].nativeElement.value).toBe('javascript');
    });

    it('should render submit button with correct text', () => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('button[data-testid="submit-btn"]'));
      
      expect(button.nativeElement.textContent.trim()).toBe('Explain Code');
    });
  });

  describe('SCSS Styling Tests', () => {
    it('should apply correct CSS classes to main container', () => {
      fixture.detectChanges();
      const container = fixture.debugElement.query(By.css('.code-explanation-container'));
      
      expect(container).toBeTruthy();
      expect(container.nativeElement.classList).toContain('code-explanation-container');
    });

    it('should apply loading styles when loading', () => {
      loadingService.getLoading.and.returnValue(of(true));
      component.ngOnInit();
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('button[data-testid="submit-btn"]'));
      expect(button.nativeElement.classList).toContain('loading');
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should apply error styles when error occurs', () => {
      component.errorMessage = 'Test error';
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.classList).toContain('error-message');
    });

    it('should apply success styles when explanation is shown', () => {
      component.explanation = mockExplanationResponse;
      fixture.detectChanges();
      
      const explanationElement = fixture.debugElement.query(By.css('.explanation-result'));
      expect(explanationElement).toBeTruthy();
      expect(explanationElement.nativeElement.classList).toContain('explanation-result');
    });
  });

  describe('Data Flow Testing', () => {
    it('should detect when API response data is not properly mapped to template', () => {
      codeExplanationService.explainCode.and.returnValue(of(mockExplanationResponse));
      
      component.codeForm.patchValue({
        code: 'console.log("Hello World");',
        language: 'javascript'
      });
      
      component.onSubmit();
      fixture.detectChanges();
      
      // Check if all response data is displayed in template
      expect(fixture.debugElement.query(By.css('[data-testid="explanation-text"]')).nativeElement.textContent)
        .toContain('This code prints "Hello World" to the console.');
      
      // Check key points
      const keyPoints = fixture.debugElement.queryAll(By.css('[data-testid="key-point"]'));
      expect(keyPoints.length).toBe(2);
      expect(keyPoints[0].nativeElement.textContent).toContain('Uses console.log function');
      
      // Check step-by-step
      const steps = fixture.debugElement.queryAll(By.css('[data-testid="step-item"]'));
      expect(steps.length).toBe(1);
      expect(steps[0].nativeElement.textContent).toContain('Function Call');
      
      // Check concepts
      const concepts = fixture.debugElement.queryAll(By.css('[data-testid="concept-item"]'));
      expect(concepts.length).toBe(1);
      expect(concepts[0].nativeElement.textContent).toContain('console.log');
      
      // Check performance notes
      expect(fixture.debugElement.query(By.css('[data-testid="performance-notes"]')).nativeElement.textContent)
        .toContain('Simple operation with minimal overhead');
    });

    it('should handle malformed API response gracefully', () => {
      const malformedResponse = {
        explanation: null,
        keyPoints: 'not an array',
        stepByStep: undefined,
        concepts: null
      };
      
      codeExplanationService.explainCode.and.returnValue(of(malformedResponse));
      
      component.codeForm.patchValue({
        code: 'console.log("test");',
        language: 'javascript'
      });
      
      component.onSubmit();
      fixture.detectChanges();
      
      // Should show error or handle gracefully
      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement || fixture.debugElement.query(By.css('[data-testid="no-data-message"]')))
        .toBeTruthy();
    });

    it('should validate data persistence between requests', () => {
      // First request
      codeExplanationService.explainCode.and.returnValue(of({
        ...mockExplanationResponse,
        explanation: 'First explanation'
      }));
      
      component.codeForm.patchValue({
        code: 'console.log("first");',
        language: 'javascript'
      });
      
      component.onSubmit();
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('[data-testid="explanation-text"]')).nativeElement.textContent)
        .toContain('First explanation');
      
      // Second request
      codeExplanationService.explainCode.and.returnValue(of({
        ...mockExplanationResponse,
        explanation: 'Second explanation'
      }));
      
      component.codeForm.patchValue({
        code: 'console.log("second");',
        language: 'javascript'
      });
      
      component.onSubmit();
      fixture.detectChanges();
      
      // Should show new data and not mix with old
      expect(fixture.debugElement.query(By.css('[data-testid="explanation-text"]')).nativeElement.textContent)
        .toContain('Second explanation');
      expect(fixture.debugElement.query(By.css('[data-testid="explanation-text"]')).nativeElement.textContent)
        .not.toContain('First explanation');
    });
  });

  describe('UI Parity Testing', () => {
    it('should maintain consistent UI states across loading/success/error', () => {
      // Initial state
      fixture.detectChanges();
      let button = fixture.debugElement.query(By.css('button[data-testid="submit-btn"]'));
      expect(button.nativeElement.disabled).toBe(false);
      expect(button.nativeElement.textContent.trim()).toBe('Explain Code');
      
      // Loading state
      loadingService.getLoading.and.returnValue(of(true));
      component.ngOnInit();
      fixture.detectChanges();
      
      button = fixture.debugElement.query(By.css('button[data-testid="submit-btn"]'));
      expect(button.nativeElement.disabled).toBe(true);
      expect(button.nativeElement.textContent.trim()).toBe('Explaining...');
      
      // Error state
      loadingService.getLoading.and.returnValue(of(false));
      component.errorMessage = 'Test error';
      fixture.detectChanges();
      
      button = fixture.debugElement.query(By.css('button[data-testid="submit-btn"]'));
      expect(button.nativeElement.disabled).toBe(false);
      expect(button.nativeElement.textContent.trim()).toBe('Explain Code');
      
      const errorElement = fixture.debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeTruthy();
    });

    it('should validate form behavior consistency', () => {
      fixture.detectChanges();
      
      // Empty form submission
      const button = fixture.debugElement.query(By.css('button[data-testid="submit-btn"]'));
      button.nativeElement.click();
      fixture.detectChanges();
      
      // Should show validation error
      const validationError = fixture.debugElement.query(By.css('.validation-error'));
      expect(validationError).toBeTruthy();
      expect(validationError.nativeElement.textContent).toContain('Code is required');
      
      // Valid form submission
      const textarea = fixture.debugElement.query(By.css('textarea[data-testid="code-input"]'));
      textarea.nativeElement.value = 'console.log("test");';
      textarea.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      // Validation error should be gone
      expect(fixture.debugElement.query(By.css('.validation-error'))).toBeFalsy();
    });
  });

  describe('TypeScript Logic Testing', () => {
    it('should validate form correctly', () => {
      // Test form validation logic
      expect(component.codeForm.get('code')?.hasError('required')).toBe(true);
      
      component.codeForm.patchValue({ code: 'console.log("test");' });
      expect(component.codeForm.get('code')?.hasError('required')).toBe(false);
      
      // Test max length validation
      const longCode = 'a'.repeat(10001);
      component.codeForm.patchValue({ code: longCode });
      expect(component.codeForm.get('code')?.hasError('maxlength')).toBe(true);
    });

    it('should handle service responses correctly', () => {
      codeExplanationService.explainCode.and.returnValue(of(mockExplanationResponse));
      
      component.codeForm.patchValue({
        code: 'console.log("test");',
        language: 'javascript'
      });
      
      component.onSubmit();
      
      expect(codeExplanationService.explainCode).toHaveBeenCalledWith({
        code: 'console.log("test");',
        language: 'javascript'
      });
      
      expect(component.explanation).toEqual(mockExplanationResponse);
      expect(component.errorMessage).toBe('');
    });

    it('should handle service errors correctly', () => {
      codeExplanationService.explainCode.and.returnValue(throwError('API Error'));
      
      component.codeForm.patchValue({
        code: 'console.log("test");',
        language: 'javascript'
      });
      
      component.onSubmit();
      
      expect(component.explanation).toBeNull();
      expect(component.errorMessage).toBeTruthy();
    });
  });
});
```

### 2. Pipe Testing

```typescript
// code-highlighter.pipe.spec.ts
import { CodeHighlighterPipe } from './code-highlighter.pipe';

describe('CodeHighlighterPipe', () => {
  let pipe: CodeHighlighterPipe;

  beforeEach(() => {
    pipe = new CodeHighlighterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should highlight JavaScript code correctly', () => {
    const code = 'console.log("Hello World");';
    const result = pipe.transform(code, 'javascript');
    
    expect(result).toContain('<span class="keyword">console</span>');
    expect(result).toContain('<span class="string">"Hello World"</span>');
  });

  it('should highlight Python code correctly', () => {
    const code = 'print("Hello World")';
    const result = pipe.transform(code, 'python');
    
    expect(result).toContain('<span class="keyword">print</span>');
    expect(result).toContain('<span class="string">"Hello World"</span>');
  });

  it('should handle empty code', () => {
    const result = pipe.transform('', 'javascript');
    expect(result).toBe('');
  });

  it('should handle unsupported languages', () => {
    const code = 'some code';
    const result = pipe.transform(code, 'unsupported');
    expect(result).toBe(code); // Should return original code
  });
});
```

### 3. Service Testing

```typescript
// code-explanation.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CodeExplanationService } from './code-explanation.service';

describe('CodeExplanationService', () => {
  let service: CodeExplanationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CodeExplanationService]
    });
    service = TestBed.inject(CodeExplanationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send correct HTTP request for code explanation', () => {
    const mockRequest = {
      code: 'console.log("Hello World");',
      language: 'javascript'
    };

    const mockResponse = {
      explanation: 'This code prints "Hello World" to the console.',
      detectedLanguage: 'javascript',
      keyPoints: ['Uses console.log function'],
      stepByStep: [],
      concepts: [],
      performanceNotes: 'Simple operation',
      responseTime: 150
    };

    service.explainCode(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/explain-code');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', () => {
    const mockRequest = {
      code: 'console.log("Hello World");',
      language: 'javascript'
    };

    service.explainCode(mockRequest).subscribe(
      () => fail('Should have failed'),
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('/api/explain-code');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

## E2E Testing with Cypress

### Data Flow E2E Tests

```typescript
// cypress/e2e/data-flow.cy.ts
describe('Data Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full code explanation workflow', () => {
    // Mock API response
    cy.intercept('POST', '/api/explain-code', {
      statusCode: 200,
      body: {
        explanation: 'This code prints "Hello World" to the console.',
        detectedLanguage: 'javascript',
        keyPoints: ['Uses console.log function', 'Prints string literal'],
        stepByStep: [
          { step: 'Function Call', description: 'Calls console.log()', color: 'blue' }
        ],
        concepts: [
          { name: 'console.log', description: 'Built-in JavaScript function' }
        ],
        performanceNotes: 'Simple operation with minimal overhead',
        responseTime: 150
      }
    }).as('explainCode');

    // Enter code
    cy.get('[data-testid="code-input"]').type('console.log("Hello World");');
    
    // Select language
    cy.get('[data-testid="language-select"]').select('javascript');
    
    // Submit form
    cy.get('[data-testid="submit-btn"]').click();
    
    // Wait for API call
    cy.wait('@explainCode');
    
    // Verify all data is displayed
    cy.get('[data-testid="explanation-text"]').should('contain', 'This code prints "Hello World" to the console.');
    cy.get('[data-testid="key-point"]').should('have.length', 2);
    cy.get('[data-testid="step-item"]').should('have.length', 1);
    cy.get('[data-testid="concept-item"]').should('have.length', 1);
    cy.get('[data-testid="performance-notes"]').should('contain', 'Simple operation with minimal overhead');
  });

  it('should handle API errors gracefully', () => {
    // Mock API error
    cy.intercept('POST', '/api/explain-code', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('explainCodeError');

    cy.get('[data-testid="code-input"]').type('console.log("Hello World");');
    cy.get('[data-testid="submit-btn"]').click();
    
    cy.wait('@explainCodeError');
    
    // Verify error handling
    cy.get('.error-message').should('be.visible');
    cy.get('[data-testid="submit-btn"]').should('not.be.disabled');
  });

  it('should validate form inputs', () => {
    // Test empty input
    cy.get('[data-testid="submit-btn"]').click();
    cy.get('.validation-error').should('contain', 'Code is required');
    
    // Test valid input
    cy.get('[data-testid="code-input"]').type('console.log("test");');
    cy.get('.validation-error').should('not.exist');
  });
});
```

## Running Angular Tests

### Unit Tests
```bash
# Run all unit tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run tests in watch mode
ng test --watch

# Run specific test file
ng test --include="**/code-explanation.component.spec.ts"
```

### E2E Tests
```bash
# Run E2E tests
ng e2e

# Run specific E2E test
npx cypress run --spec "cypress/e2e/data-flow.cy.ts"

# Open Cypress UI
npx cypress open
```

## Test Configuration

### karma.conf.js
```javascript
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-headless'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: true
      },
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

This comprehensive Angular testing framework provides:

1. **Component Testing**: Templates, styles, and TypeScript logic
2. **Pipe Testing**: Custom pipe functionality
3. **Service Testing**: HTTP calls and business logic
4. **E2E Testing**: Complete user workflows
5. **Data Flow Validation**: API response to UI mapping
6. **UI Parity Testing**: Consistent behavior across states
7. **SCSS/CSS Testing**: Styling and visual regression
8. **HTML Template Testing**: DOM structure and content

The framework catches the same types of issues as the React version but is specifically designed for Angular applications with TypeScript, HTML templates, and SCSS styling.