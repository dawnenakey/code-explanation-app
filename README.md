# Code Explanation Application

A modern full-stack web application that provides AI-powered explanations of code snippets in plain English using OpenAI's GPT-4 model. Built with React, Express.js, TypeScript, and PostgreSQL.

## Features

- **AI-Powered Code Analysis**: Uses OpenAI GPT-4 to analyze and explain code
- **Multi-Language Support**: Supports JavaScript, Python, Java, C++, and more
- **Step-by-Step Explanations**: Breaks down code into digestible steps
- **Key Concepts**: Explains programming concepts used in the code
- **Performance Notes**: Provides optimization suggestions
- **Real-time Processing**: Fast analysis with streaming responses

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS with shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- Vite for build tooling

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL with Drizzle ORM
- OpenAI API integration
- Session management

### Testing
- Comprehensive testing framework for both React and Angular
- Specialized Backbase Angular testing for enterprise applications
- Unit tests, integration tests, and E2E testing
- QA-focused data flow and UI parity testing

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dawnenakey/code-explanation-app.git
cd code-explanation-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Add your OpenAI API key
export OPENAI_API_KEY="your-api-key-here"

# Database connection (if using external database)
export DATABASE_URL="your-database-url"
```

4. Start the application:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5000`

## Usage

1. **Enter Code**: Paste your code snippet into the text area
2. **Select Language**: Choose the programming language (auto-detection available)
3. **Get Explanation**: Click "Explain Code" to receive AI-powered analysis
4. **Review Results**: View the explanation, key points, step-by-step breakdown, and concepts

## API Endpoints

### POST /api/explain-code
Analyzes and explains code snippets.

**Request:**
```json
{
  "code": "console.log('Hello World');",
  "language": "javascript"
}
```

**Response:**
```json
{
  "explanation": "This JavaScript code uses console.log to output text.",
  "detectedLanguage": "javascript",
  "keyPoints": ["Uses console.log function", "Outputs string to console"],
  "stepByStep": [
    {
      "step": "Function Call",
      "description": "Calls console.log()",
      "color": "blue"
    }
  ],
  "concepts": [
    {
      "name": "console.log",
      "description": "Built-in output function"
    }
  ],
  "performanceNotes": "Simple operation with minimal overhead",
  "responseTime": 150
}
```

## Testing

### React Testing (Current Implementation)
```bash
# Run all tests
npm test

# Run QA-specific tests
npx vitest run client/src/__tests__/qa/

# Run tests with coverage
npm run test:coverage
```

### Angular Testing (For Backbase Development)
```bash
# Run Angular unit tests
ng test

# Run E2E tests
npx cypress run

# Run Backbase-specific tests
ng test --include="**/journeys/**/*.spec.ts"
```

## Deployment

### Replit Deployment
1. Click the "Deploy" button in Replit
2. The app will be available at your `.replit.app` domain

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)

### Database
The app uses PostgreSQL with Drizzle ORM. Database schema is managed through migrations:

```bash
# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate
```

## Development

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── __tests__/
├── server/           # Express backend
│   ├── services/
│   ├── routes.ts
│   └── index.ts
├── shared/           # Shared types and schemas
└── docs/             # Testing frameworks and guides
```

### Adding New Features
1. Update the schema in `shared/schema.ts`
2. Add API routes in `server/routes.ts`
3. Create React components in `client/src/`
4. Add tests in `client/src/__tests__/`

## Testing Frameworks

### QA Testing
- **Data Flow Testing**: Validates API responses map correctly to UI
- **UI Parity Testing**: Ensures consistent behavior across states
- **Regression Testing**: Catches breaking changes

### Backbase Angular Testing
- **Journey Testing**: Complete user flows through Backbase journeys
- **Widget Testing**: Individual component functionality
- **Service Testing**: API integration and data transformation
- **Permission Testing**: Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the testing guides in the `docs/` directory
- Review the QA testing examples for common scenarios

## Architecture

Built with modern web development best practices:
- **Type Safety**: Full TypeScript coverage
- **Database**: PostgreSQL with type-safe ORM
- **API Design**: RESTful endpoints with validation
- **Testing**: Comprehensive test coverage
- **Performance**: Optimized builds and caching
- **Security**: Input validation and secure API handling

Perfect for educational use, code review assistance, and developer onboarding.