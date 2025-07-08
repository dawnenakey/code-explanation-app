import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Building2, 
  Shield, 
  Settings, 
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const backbaseCodeExamples = [
  {
    title: "Angular Service Integration",
    description: "Backbase Angular service for account management",
    language: "typescript",
    code: `import { Injectable } from '@angular/core';
import { AccountsService } from '@backbase/accounts-http-ang';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private accountsService: AccountsService) {}

  getUserAccounts(): Observable<any[]> {
    return this.accountsService.getAccounts({
      businessFunction: 'Account Information',
      resourceName: 'Account'
    });
  }

  getAccountBalance(accountId: string): Observable<number> {
    return this.accountsService.getAccountBalance(accountId);
  }
}`,
    explanation: "This service handles account data retrieval using Backbase's Angular SDK with proper dependency injection and observable patterns."
  },
  {
    title: "Payment Processing Logic",
    description: "Credit union payment validation and processing",
    language: "java",
    code: `@Service
public class PaymentProcessor {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private ComplianceService complianceService;
    
    public PaymentResponse processPayment(PaymentRequest request) {
        // Validate account balance
        if (!hasValidBalance(request.getFromAccount(), request.getAmount())) {
            return PaymentResponse.failed("Insufficient funds");
        }
        
        // Check compliance rules
        if (!complianceService.validateTransaction(request)) {
            return PaymentResponse.failed("Compliance check failed");
        }
        
        // Process payment
        return executePayment(request);
    }
    
    private boolean hasValidBalance(String accountId, BigDecimal amount) {
        BigDecimal balance = accountService.getBalance(accountId);
        return balance.compareTo(amount) >= 0;
    }
}`,
    explanation: "Financial transaction processing with compliance validation, typical for credit union payment systems."
  },
  {
    title: "REST API Configuration",
    description: "Backbase API configuration for credit union services",
    language: "json",
    code: `{
  "backbase": {
    "api": {
      "baseUrl": "https://api.bluefcu.org",
      "services": {
        "accounts": {
          "path": "/api/accounts-service/v2",
          "timeout": 30000,
          "retries": 3
        },
        "payments": {
          "path": "/api/payment-service/v1",
          "timeout": 45000,
          "retries": 2
        }
      }
    },
    "security": {
      "oauth2": {
        "clientId": "blue-fcu-client",
        "scope": "accounts:read payments:write"
      }
    },
    "features": {
      "enableAccountAggregation": true,
      "enableP2P": true,
      "enableBillPay": true
    }
  }
}`,
    explanation: "Configuration for Backbase services specific to Blue Federal Credit Union's digital banking platform."
  }
];

const integrationOptions = [
  {
    title: "Backbase Widget Integration",
    description: "Embed code explanation directly into Backbase development portal",
    status: "Available",
    features: ["Widget SDK", "SSO Integration", "Custom Branding"]
  },
  {
    title: "Developer Portal Extension",
    description: "Add as a tool in your existing developer workflow",
    status: "Configurable",
    features: ["API Documentation", "Code Review Assistant", "Training Module"]
  },
  {
    title: "CI/CD Pipeline Integration",
    description: "Automatic code documentation generation during deployments",
    status: "Custom",
    features: ["Webhook Integration", "Automated Reports", "Quality Gates"]
  }
];

export default function Demo() {
  const [selectedExample, setSelectedExample] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="text-blue-600 text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Blue Federal Credit Union</h1>
              <Badge variant="secondary" className="ml-3">Demo Environment</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Backbase Integration</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI Code Analysis for Financial Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Demonstrate how AI-powered code explanation can transform your Backbase development workflow, 
            improve code documentation, and accelerate developer onboarding at Blue Federal Credit Union.
          </p>
        </div>

        {/* Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Code Examples */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="text-blue-600 mr-2" />
                Backbase Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {backbaseCodeExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedExample(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedExample === index 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{example.title}</h4>
                        <p className="text-sm text-gray-600">{example.description}</p>
                      </div>
                      <Badge variant="outline">{example.language}</Badge>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                  {backbaseCodeExamples[selectedExample].code}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="text-green-600 mr-2" />
                AI Analysis Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 Code Purpose</h4>
                  <p className="text-sm text-green-800">
                    {backbaseCodeExamples[selectedExample].explanation}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Key Benefits</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Follows Backbase architectural patterns</li>
                    <li>• Implements financial services best practices</li>
                    <li>• Includes proper error handling and validation</li>
                    <li>• Compliant with banking security standards</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">🔧 Integration Notes</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Compatible with Backbase 2023.x</li>
                    <li>• Uses standard Angular/Spring Boot patterns</li>
                    <li>• Follows credit union compliance requirements</li>
                    <li>• Ready for production deployment</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Analyze Your Own Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Options */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Integration Options for Blue Federal Credit Union
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrationOptions.map((option, index) => (
              <Card key={index} className="shadow-sm border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <Badge variant={option.status === 'Available' ? 'default' : 'secondary'}>
                      {option.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="text-purple-600 mr-2" />
              Customization & White-Label Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">What You Can Customize</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Branding & UI</p>
                      <p className="text-sm text-gray-600">Blue FCU colors, logos, and styling</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">AI Model Training</p>
                      <p className="text-sm text-gray-600">Train on your specific codebase patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">API Integration</p>
                      <p className="text-sm text-gray-600">Connect with existing dev tools</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Security & Compliance</p>
                      <p className="text-sm text-gray-600">Meet financial services requirements</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">What's "Black Box" vs Customizable</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Core AI Processing</p>
                      <p className="text-sm text-gray-600">OpenAI model - but can be replaced with custom models</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Prompt Engineering</p>
                      <p className="text-sm text-gray-600">Fully customizable for financial domain</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Output Formatting</p>
                      <p className="text-sm text-gray-600">Complete control over explanation structure</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Data Storage & Analytics</p>
                      <p className="text-sm text-gray-600">Your data stays on your infrastructure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}