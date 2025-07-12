# Code Explanation Application

## Overview

This is a modern full-stack web application built with React, Express.js, and TypeScript that allows users to submit code snippets and receive AI-powered explanations. The application uses OpenAI's GPT-4 model to analyze code and provide educational explanations including step-by-step breakdowns, key concepts, and performance considerations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Integration**: OpenAI API for code analysis
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot reloading with Vite integration

## Key Components

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Two main tables:
  - `users`: Basic user management with username/password
  - `code_explanations`: Stores code analysis results with metadata
- **Migrations**: Database schema versioning through Drizzle Kit

### API Layer
- **REST Endpoints**: Single `/api/explain-code` endpoint for code analysis
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **Logging**: Custom request logging with response time tracking

### Frontend Features
- **Code Input**: Multi-language code editor with syntax highlighting support
- **Language Detection**: Auto-detection with manual override options
- **Real-time Analysis**: Streaming responses from OpenAI API
- **Rich Display**: Formatted explanations with step-by-step breakdowns
- **Toast Notifications**: User feedback for success/error states
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### AI Integration
- **Model**: OpenAI GPT-4 for comprehensive code analysis
- **Structured Output**: JSON responses with explanations, concepts, and performance notes
- **Educational Focus**: Beginner-friendly explanations with programming concepts
- **Error Handling**: Graceful fallbacks for API failures

## Data Flow

1. **User Input**: Code snippet entered with optional language specification
2. **Frontend Validation**: Zod schema validation on client-side
3. **API Request**: POST to `/api/explain-code` with validated payload
4. **AI Processing**: OpenAI API call with structured prompt
5. **Response Processing**: Parse and validate AI response
6. **Database Storage**: Optional storage of analysis results
7. **Frontend Display**: Render formatted explanation with UI components

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL (serverless)
- **AI Service**: OpenAI API (GPT-4 model)
- **UI Components**: Radix UI ecosystem
- **Styling**: Tailwind CSS with custom design system

### Development Tools
- **Build System**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Database Tools**: Drizzle Kit for migrations
- **Development Server**: Express with Vite middleware integration

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Static Assets**: Served from built frontend directory

### Environment Configuration
- **Development**: Hot reloading with Vite dev server
- **Production**: Optimized builds with static file serving
- **Database**: Environment-based connection strings
- **API Keys**: Secure environment variable management

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database access
- OpenAI API key configuration
- Static file serving capabilities

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- July 12, 2025: Created comprehensive debugging and code analysis system
- Added automated debug testing with GitHub Actions integration
- Implemented multi-level debugging (basic, verbose, detailed)
- Created debug utilities for component state, API calls, and performance monitoring
- Added code analysis features including static analysis, coverage, and complexity metrics
- Built cost-effective testing solution running entirely on GitHub's free tier
- July 12, 2025: Created Backbase Angular testing framework for enterprise QA
- Built comprehensive testing for Backbase journeys, widgets, and services
- Added Angular-specific testing with component templates, pipes, TypeScript, and SCSS
- Implemented Backbase Design System component testing and authentication flows
- Created custom Cypress commands for Backbase API mocking and user permissions
- July 12, 2025: Added comprehensive automated testing framework
- Implemented unit tests, integration tests, and end-to-end testing
- Created test utilities for consistent testing patterns
- Added performance testing and error handling test coverage
- Testing framework includes Vitest, React Testing Library, and Jest-DOM
- July 12, 2025: Migrated from in-memory storage to PostgreSQL database
- Added DatabaseStorage class implementing IStorage interface
- Successfully created database tables (users, code_explanations) with proper schema
- Updated storage layer to use Drizzle ORM with Neon PostgreSQL
- July 08, 2025: Added Backbase integration demo page for Blue Federal Credit Union
- Enhanced language options to include financial services tech stack (Angular, Spring Boot, etc.)
- Created enterprise-focused demo with real Backbase code examples
- Added customization documentation for white-label integration options

## Changelog

Changelog:
- July 12, 2025. Created comprehensive debugging and code analysis system with GitHub Actions
- July 12, 2025. Created Backbase Angular testing framework for enterprise development
- July 12, 2025. Added comprehensive automated testing framework
- July 12, 2025. Migrated to PostgreSQL database with Drizzle ORM
- July 08, 2025. Initial setup
- July 08, 2025. Added Blue FCU Backbase integration demo