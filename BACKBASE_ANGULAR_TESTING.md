# Backbase Angular Testing Framework

## Overview

This testing framework is specifically designed for Backbase Angular applications, covering Backbase Design System components, services, data providers, and the Journey architecture. It ensures QA teams can validate data flow, UI parity, and functionality across Backbase widgets and journeys.

## Backbase-Specific Testing Stack

### Core Dependencies
```json
{
  "devDependencies": {
    "@angular/testing": "^15.0.0",
    "@backbase/foundation-ang": "^6.0.0",
    "@backbase/ui-ang": "^6.0.0", 
    "@backbase/data-ang": "^6.0.0",
    "karma": "^6.0.0",
    "jasmine": "^4.0.0",
    "cypress": "^12.0.0",
    "ng-mocks": "^14.0.0",
    "@cypress/schematic": "^2.0.0"
  }
}
```

### Testing Structure for Backbase Projects
```
src/
├── app/
│   ├── journeys/
│   │   ├── retail-banking/
│   │   │   ├── account-overview/
│   │   │   │   ├── account-overview.component.ts
│   │   │   │   ├── account-overview.component.html
│   │   │   │   ├── account-overview.component.scss
│   │   │   │   └── account-overview.component.spec.ts
│   │   │   └── transaction-list/
│   │   │       ├── transaction-list.component.ts
│   │   │       ├── transaction-list.component.html
│   │   │       ├── transaction-list.component.scss
│   │   │       └── transaction-list.component.spec.ts
│   │   └── wealth-management/
│   ├── widgets/
│   │   ├── account-balance/
│   │   │   ├── account-balance.widget.ts
│   │   │   ├── account-balance.widget.html
│   │   │   ├── account-balance.widget.scss
│   │   │   └── account-balance.widget.spec.ts
│   │   └── portfolio-performance/
│   ├── services/
│   │   ├── data-providers/
│   │   │   ├── accounts.service.ts
│   │   │   ├── accounts.service.spec.ts
│   │   │   ├── transactions.service.ts
│   │   │   └── transactions.service.spec.ts
│   │   └── business-logic/
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   └── models/
│   └── testing/
│       ├── mocks/
│       │   ├── bb-mock-data.ts
│       │   └── bb-test-providers.ts
│       ├── fixtures/
│       │   ├── account-fixtures.ts
│       │   └── transaction-fixtures.ts
│       └── test-utils/
│           ├── bb-test-bed.util.ts
│           └── bb-component-harnesses.ts
├── e2e/
│   ├── journeys/
│   │   ├── retail-banking.e2e-spec.ts
│   │   └── wealth-management.e2e-spec.ts
│   └── widgets/
│       ├── account-balance.e2e-spec.ts
│       └── portfolio-performance.e2e-spec.ts
└── cypress/
    ├── e2e/
    │   ├── backbase-journeys/
    │   └── backbase-widgets/
    └── support/
        ├── bb-commands.ts
        └── bb-mocks.ts
```

## Backbase Component Testing

### 1. Account Overview Journey Component Testing

```typescript
// account-overview.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

// Backbase imports
import { DataModule } from '@backbase/data-ang';
import { UiModule } from '@backbase/ui-ang';
import { FoundationModule } from '@backbase/foundation-ang';

// Component imports
import { AccountOverviewComponent } from './account-overview.component';
import { AccountsDataService } from '../../services/data-providers/accounts.service';
import { NotificationService } from '@backbase/ui-ang/notification';

// Test utilities
import { createBackbaseTestBed } from '../../testing/test-utils/bb-test-bed.util';
import { mockAccountsData, mockAccountSummary } from '../../testing/fixtures/account-fixtures';

describe('AccountOverviewComponent - Backbase Journey', () => {
  let component: AccountOverviewComponent;
  let fixture: ComponentFixture<AccountOverviewComponent>;
  let accountsService: jasmine.SpyObj<AccountsDataService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const accountsServiceSpy = jasmine.createSpyObj('AccountsDataService', 
      ['getAccountSummary', 'getAccountsList', 'getAccountBalance']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', 
      ['showNotification', 'showError']);

    await createBackbaseTestBed({
      declarations: [AccountOverviewComponent],
      imports: [
        NoopAnimationsModule,
        DataModule.forRoot(),
        UiModule,
        FoundationModule
      ],
      providers: [
        { provide: AccountsDataService, useValue: accountsServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(AccountOverviewComponent);
    component = fixture.componentInstance;
    accountsService = TestBed.inject(AccountsDataService) as jasmine.SpyObj<AccountsDataService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  describe('Backbase Data Flow Integration', () => {
    it('should load and display account summary from Backbase API', () => {
      accountsService.getAccountSummary.and.returnValue(of(mockAccountSummary));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      // Verify Backbase service call
      expect(accountsService.getAccountSummary).toHaveBeenCalled();
      
      // Verify UI displays Backbase data correctly
      const totalBalanceElement = fixture.debugElement.query(By.css('[data-testid="total-balance"]'));
      expect(totalBalanceElement.nativeElement.textContent).toContain('$125,430.50');
      
      const accountCountElement = fixture.debugElement.query(By.css('[data-testid="account-count"]'));
      expect(accountCountElement.nativeElement.textContent).toContain('5 accounts');
    });

    it('should handle Backbase API data format changes', () => {
      // Test with new API response format
      const newFormatResponse = {
        summary: {
          totalBalance: { amount: 125430.50, currency: 'USD' },
          accountsCount: 5,
          lastUpdated: '2025-01-12T13:00:00Z'
        },
        accounts: mockAccountsData
      };
      
      accountsService.getAccountSummary.and.returnValue(of(newFormatResponse));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      // Verify component handles new format correctly
      expect(component.accountSummary).toEqual(newFormatResponse);
      
      // Verify UI still displays correctly
      const balanceElement = fixture.debugElement.query(By.css('[data-testid="total-balance"]'));
      expect(balanceElement.nativeElement.textContent).toContain('$125,430.50');
    });

    it('should validate account list data mapping', () => {
      accountsService.getAccountsList.and.returnValue(of(mockAccountsData));
      
      component.loadAccountsList();
      fixture.detectChanges();
      
      // Verify all account data is properly mapped
      const accountItems = fixture.debugElement.queryAll(By.css('[data-testid="account-item"]'));
      expect(accountItems.length).toBe(mockAccountsData.length);
      
      // Check first account details
      const firstAccount = accountItems[0];
      expect(firstAccount.query(By.css('.account-name')).nativeElement.textContent)
        .toBe(mockAccountsData[0].displayName);
      expect(firstAccount.query(By.css('.account-balance')).nativeElement.textContent)
        .toContain(mockAccountsData[0].bookedBalance.amount.toString());
      expect(firstAccount.query(By.css('.account-number')).nativeElement.textContent)
        .toContain(mockAccountsData[0].BBAN);
    });
  });

  describe('Backbase UI Component Integration', () => {
    it('should use Backbase Design System components correctly', () => {
      fixture.detectChanges();
      
      // Verify Backbase UI components are used
      expect(fixture.debugElement.query(By.css('bb-card'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('bb-loading-indicator'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('bb-amount'))).toBeTruthy();
    });

    it('should apply Backbase theme and styling', () => {
      fixture.detectChanges();
      
      const mainContainer = fixture.debugElement.query(By.css('.bb-journey-container'));
      expect(mainContainer).toBeTruthy();
      expect(mainContainer.nativeElement.classList).toContain('bb-theme-retail');
    });

    it('should handle Backbase responsive breakpoints', () => {
      // Test mobile breakpoint
      component.screenSize = 'mobile';
      fixture.detectChanges();
      
      const mobileLayout = fixture.debugElement.query(By.css('.bb-layout-mobile'));
      expect(mobileLayout).toBeTruthy();
      
      // Test desktop breakpoint
      component.screenSize = 'desktop';
      fixture.detectChanges();
      
      const desktopLayout = fixture.debugElement.query(By.css('.bb-layout-desktop'));
      expect(desktopLayout).toBeTruthy();
    });
  });

  describe('Error Handling with Backbase Notifications', () => {
    it('should display Backbase error notifications for API failures', () => {
      accountsService.getAccountSummary.and.returnValue(throwError({ 
        error: { message: 'Account service unavailable' },
        status: 503 
      }));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      expect(notificationService.showError).toHaveBeenCalledWith({
        message: 'Unable to load account information. Please try again later.',
        type: 'error'
      });
    });

    it('should handle Backbase authentication errors', () => {
      accountsService.getAccountSummary.and.returnValue(throwError({ 
        error: { message: 'Unauthorized' },
        status: 401 
      }));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      expect(notificationService.showError).toHaveBeenCalledWith({
        message: 'Session expired. Please log in again.',
        type: 'error'
      });
    });
  });

  describe('Backbase Permission and Entitlements Testing', () => {
    it('should show/hide features based on user permissions', () => {
      // Mock user with limited permissions
      component.userPermissions = ['view-accounts'];
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('[data-testid="view-statements-btn"]'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('[data-testid="transfer-money-btn"]'))).toBeFalsy();
      
      // Mock user with full permissions
      component.userPermissions = ['view-accounts', 'view-statements', 'transfer-money'];
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('[data-testid="view-statements-btn"]'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('[data-testid="transfer-money-btn"]'))).toBeTruthy();
    });
  });
});
```

### 2. Backbase Widget Testing

```typescript
// account-balance.widget.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { AccountBalanceWidget } from './account-balance.widget';
import { WidgetModule } from '@backbase/ui-ang/widget';
import { AmountModule } from '@backbase/ui-ang/amount';

describe('AccountBalanceWidget - Backbase Widget', () => {
  let component: AccountBalanceWidget;
  let fixture: ComponentFixture<AccountBalanceWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountBalanceWidget],
      imports: [WidgetModule, AmountModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountBalanceWidget);
    component = fixture.componentInstance;
  });

  describe('Widget Configuration Testing', () => {
    it('should render widget with Backbase widget chrome', () => {
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('bb-widget'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.bb-widget-header'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.bb-widget-body'))).toBeTruthy();
    });

    it('should handle widget preferences', () => {
      component.widgetPreferences = {
        showAccountNumbers: false,
        defaultCurrency: 'EUR',
        refreshInterval: 300000
      };
      
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('[data-testid="account-number"]'))).toBeFalsy();
      expect(component.displayCurrency).toBe('EUR');
    });

    it('should validate widget size configurations', () => {
      // Test small widget size
      component.widgetSize = 'small';
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('.bb-widget-small'))).toBeTruthy();
      
      // Test large widget size
      component.widgetSize = 'large';
      fixture.detectChanges();
      
      expect(fixture.debugElement.query(By.css('.bb-widget-large'))).toBeTruthy();
    });
  });

  describe('Data Refresh and Real-time Updates', () => {
    it('should handle real-time balance updates', () => {
      const initialBalance = { amount: 1000, currency: 'USD' };
      const updatedBalance = { amount: 1250, currency: 'USD' };
      
      component.accountBalance = initialBalance;
      fixture.detectChanges();
      
      let balanceElement = fixture.debugElement.query(By.css('bb-amount'));
      expect(balanceElement.nativeElement.textContent).toContain('$1,000.00');
      
      // Simulate real-time update
      component.accountBalance = updatedBalance;
      fixture.detectChanges();
      
      balanceElement = fixture.debugElement.query(By.css('bb-amount'));
      expect(balanceElement.nativeElement.textContent).toContain('$1,250.00');
    });

    it('should handle widget auto-refresh', () => {
      spyOn(component, 'refreshData');
      component.autoRefresh = true;
      component.refreshInterval = 1000; // 1 second for testing
      
      component.ngOnInit();
      
      setTimeout(() => {
        expect(component.refreshData).toHaveBeenCalled();
      }, 1100);
    });
  });
});
```

### 3. Backbase Service Testing

```typescript
// accounts.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountsDataService } from './accounts.service';
import { BackbaseHttpService } from '@backbase/data-ang';

describe('AccountsDataService - Backbase Data Service', () => {
  let service: AccountsDataService;
  let httpMock: HttpTestingController;
  let backbaseHttpService: jasmine.SpyObj<BackbaseHttpService>;

  beforeEach(() => {
    const backbaseHttpServiceSpy = jasmine.createSpyObj('BackbaseHttpService', ['get', 'post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AccountsDataService,
        { provide: BackbaseHttpService, useValue: backbaseHttpServiceSpy }
      ]
    });

    service = TestBed.inject(AccountsDataService);
    httpMock = TestBed.inject(HttpTestingController);
    backbaseHttpService = TestBed.inject(BackbaseHttpService) as jasmine.SpyObj<BackbaseHttpService>;
  });

  describe('Backbase API Integration', () => {
    it('should call correct Backbase API endpoints', () => {
      const mockAccounts = [
        {
          id: 'acc-001',
          displayName: 'Checking Account',
          BBAN: '1234567890',
          currency: 'USD',
          bookedBalance: { amount: 5000.00, currency: 'USD' }
        }
      ];

      backbaseHttpService.get.and.returnValue(of(mockAccounts));

      service.getAccountsList().subscribe(accounts => {
        expect(accounts).toEqual(mockAccounts);
      });

      expect(backbaseHttpService.get).toHaveBeenCalledWith('/api/arrangement-manager/client-api/v2/productsummary/context/arrangements');
    });

    it('should handle Backbase API versioning', () => {
      service.apiVersion = 'v3';
      
      service.getAccountsList().subscribe();

      expect(backbaseHttpService.get).toHaveBeenCalledWith('/api/arrangement-manager/client-api/v3/productsummary/context/arrangements');
    });

    it('should handle Backbase authentication headers', () => {
      const expectedHeaders = {
        'Authorization': 'Bearer token123',
        'X-XSRF-TOKEN': 'xsrf123'
      };

      service.getAccountsList().subscribe();

      const req = httpMock.expectOne(req => req.url.includes('/api/arrangement-manager'));
      expect(req.request.headers.get('Authorization')).toBe('Bearer token123');
    });
  });

  describe('Data Transformation for Backbase Models', () => {
    it('should transform API response to Backbase account model', () => {
      const apiResponse = {
        arrangementItems: [
          {
            id: 'acc-001',
            name: 'Primary Checking',
            accountNumber: '1234567890',
            currency: 'USD',
            currentBalance: 5000.00
          }
        ]
      };

      const expectedTransformed = [
        {
          id: 'acc-001',
          displayName: 'Primary Checking',
          BBAN: '1234567890',
          currency: 'USD',
          bookedBalance: { amount: 5000.00, currency: 'USD' }
        }
      ];

      backbaseHttpService.get.and.returnValue(of(apiResponse));

      service.getAccountsList().subscribe(accounts => {
        expect(accounts).toEqual(expectedTransformed);
      });
    });
  });
});
```

## Backbase E2E Testing with Cypress

### Journey E2E Testing

```typescript
// cypress/e2e/backbase-journeys/retail-banking.cy.ts
describe('Retail Banking Journey - Backbase E2E', () => {
  beforeEach(() => {
    // Mock Backbase authentication
    cy.mockBackbaseAuth();
    
    // Mock Backbase API responses
    cy.intercept('GET', '/api/arrangement-manager/client-api/v2/**', {
      fixture: 'backbase/accounts-response.json'
    }).as('getAccounts');

    cy.visit('/retail-banking/account-overview');
  });

  it('should complete full account overview journey', () => {
    // Wait for Backbase APIs to load
    cy.wait('@getAccounts');

    // Verify Backbase journey layout
    cy.get('[data-bb-journey="retail-banking"]').should('be.visible');
    cy.get('.bb-layout-container').should('exist');

    // Verify account summary loads
    cy.get('[data-testid="total-balance"]').should('contain', '$125,430.50');
    cy.get('[data-testid="account-count"]').should('contain', '5 accounts');

    // Verify account list displays
    cy.get('[data-testid="account-item"]').should('have.length', 5);
    
    // Test account selection
    cy.get('[data-testid="account-item"]').first().click();
    cy.url().should('include', '/account-details/');

    // Verify account details load with Backbase data
    cy.get('[data-testid="account-transactions"]').should('be.visible');
    cy.get('[data-testid="account-balance"]').should('be.visible');
  });

  it('should handle Backbase permission-based features', () => {
    // Mock user with limited permissions
    cy.mockBackbaseUser({ permissions: ['view-accounts'] });
    
    cy.visit('/retail-banking/account-overview');
    cy.wait('@getAccounts');

    // Verify restricted features are hidden
    cy.get('[data-testid="transfer-money-btn"]').should('not.exist');
    cy.get('[data-testid="view-statements-btn"]').should('not.exist');

    // Mock user with full permissions
    cy.mockBackbaseUser({ permissions: ['view-accounts', 'transfer-money', 'view-statements'] });
    
    cy.reload();
    cy.wait('@getAccounts');

    // Verify all features are visible
    cy.get('[data-testid="transfer-money-btn"]').should('be.visible');
    cy.get('[data-testid="view-statements-btn"]').should('be.visible');
  });

  it('should handle Backbase API errors gracefully', () => {
    // Mock API error
    cy.intercept('GET', '/api/arrangement-manager/client-api/v2/**', {
      statusCode: 503,
      body: { error: 'Service unavailable' }
    }).as('getAccountsError');

    cy.visit('/retail-banking/account-overview');
    cy.wait('@getAccountsError');

    // Verify Backbase error handling
    cy.get('.bb-notification-error').should('be.visible');
    cy.get('.bb-notification-error').should('contain', 'Unable to load account information');
    
    // Verify retry functionality
    cy.get('[data-testid="retry-btn"]').click();
    // Should retry the API call
  });
});
```

### Widget E2E Testing

```typescript
// cypress/e2e/backbase-widgets/account-balance.cy.ts
describe('Account Balance Widget - Backbase E2E', () => {
  beforeEach(() => {
    cy.mockBackbaseAuth();
    
    // Mock widget configuration
    cy.intercept('GET', '/api/widget-configuration/**', {
      body: {
        widgetId: 'account-balance-widget',
        preferences: {
          showAccountNumbers: true,
          refreshInterval: 300000,
          defaultCurrency: 'USD'
        }
      }
    }).as('getWidgetConfig');

    cy.visit('/widgets/account-balance');
  });

  it('should render widget with Backbase chrome', () => {
    cy.wait('@getWidgetConfig');

    // Verify Backbase widget structure
    cy.get('.bb-widget').should('be.visible');
    cy.get('.bb-widget-header').should('contain', 'Account Balance');
    cy.get('.bb-widget-body').should('be.visible');
    
    // Verify widget controls
    cy.get('.bb-widget-settings').should('be.visible');
    cy.get('.bb-widget-refresh').should('be.visible');
  });

  it('should handle widget configuration changes', () => {
    cy.wait('@getWidgetConfig');

    // Test widget settings
    cy.get('.bb-widget-settings').click();
    cy.get('[data-testid="show-account-numbers"]').uncheck();
    cy.get('[data-testid="save-settings"]').click();

    // Verify account numbers are hidden
    cy.get('[data-testid="account-number"]').should('not.exist');
  });

  it('should handle real-time data updates', () => {
    cy.wait('@getWidgetConfig');

    // Mock real-time balance update
    cy.intercept('GET', '/api/arrangement-manager/client-api/v2/balance/**', {
      body: { amount: 5250.00, currency: 'USD' }
    }).as('getUpdatedBalance');

    // Initial balance
    cy.get('[data-testid="account-balance"]').should('contain', '$5,000.00');

    // Simulate refresh
    cy.get('.bb-widget-refresh').click();
    cy.wait('@getUpdatedBalance');

    // Verify updated balance
    cy.get('[data-testid="account-balance"]').should('contain', '$5,250.00');
  });
});
```

## Custom Cypress Commands for Backbase

```typescript
// cypress/support/bb-commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      mockBackbaseAuth(): Chainable<void>;
      mockBackbaseUser(options: { permissions: string[] }): Chainable<void>;
      mockBackbaseAPI(endpoint: string, response: any): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockBackbaseAuth', () => {
  cy.intercept('GET', '/api/auth/oauth/token', {
    statusCode: 200,
    body: {
      access_token: 'mock-token-123',
      token_type: 'Bearer',
      expires_in: 3600
    }
  }).as('auth');
  
  cy.intercept('GET', '/api/auth/userinfo', {
    statusCode: 200,
    body: {
      sub: 'user123',
      name: 'Test User',
      preferred_username: 'testuser'
    }
  }).as('userinfo');
});

Cypress.Commands.add('mockBackbaseUser', (options) => {
  cy.intercept('GET', '/api/access-control/client-api/v2/users/me/permissions', {
    statusCode: 200,
    body: options.permissions
  }).as('permissions');
});

Cypress.Commands.add('mockBackbaseAPI', (endpoint, response) => {
  cy.intercept('GET', `/api/**/${endpoint}`, {
    statusCode: 200,
    body: response
  }).as(`api-${endpoint}`);
});
```

## Running Backbase Tests

### Development Commands
```bash
# Run unit tests for Backbase components
ng test --include="**/journeys/**/*.spec.ts"

# Run widget tests
ng test --include="**/widgets/**/*.spec.ts"

# Run service tests
ng test --include="**/services/**/*.spec.ts"

# Run E2E tests for journeys
npx cypress run --spec "cypress/e2e/backbase-journeys/**"

# Run E2E tests for widgets
npx cypress run --spec "cypress/e2e/backbase-widgets/**"
```

### CI/CD Integration
```yaml
# .github/workflows/backbase-testing.yml
name: Backbase Angular Testing

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Backbase unit tests
        run: ng test --watch=false --browsers=ChromeHeadless
      
      - name: Run Backbase E2E tests
        run: npx cypress run --headless
      
      - name: Generate test reports
        run: npm run test:coverage
```

This comprehensive Backbase Angular testing framework provides:

1. **Journey Testing**: Complete user flows through Backbase journeys
2. **Widget Testing**: Individual widget functionality and configuration
3. **Service Testing**: Backbase API integration and data transformation
4. **Permission Testing**: Role-based feature access
5. **Real-time Testing**: Live data updates and refresh functionality
6. **Error Handling**: Backbase-specific error scenarios
7. **E2E Testing**: Full user workflows with Backbase authentication
8. **Custom Commands**: Backbase-specific testing utilities

This ensures your QA team can thoroughly test Backbase applications and catch issues with data flow, UI parity, and Backbase-specific functionality.