# Overview

This is a full-stack loan management application built for Rupeek, a gold loan company. The system provides a web interface for loan officers to review and process loan applications, including detailed customer information, loan details, branch information, and manual approval capabilities. The application displays comprehensive loan data and allows authorized users to override automated decisions through a manual approval process.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses a modern React-based architecture with TypeScript:
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The server follows a REST API design with Express.js:
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for loan data retrieval and approval actions
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Request Handling**: Middleware for logging, JSON parsing, and error handling
- **Development Setup**: Vite integration for seamless full-stack development

## Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Schema**: Well-defined TypeScript types for Users, Customers, Loans, and Branches
- **Validation**: Zod schemas for runtime validation and type inference
- **Storage Interface**: Abstracted storage layer allowing for easy swapping between memory and database implementations

## Authentication & Authorization
- Basic session-based authentication structure (not fully implemented)
- User context for tracking approval actions
- Manual approval workflow with comment requirements and user attribution

## Key Design Patterns
- **Repository Pattern**: Storage interface abstracts data access logic
- **Component Composition**: Modular React components for different sections (customer info, loan details, etc.)
- **Custom Hooks**: Reusable logic for toast notifications and mobile detection
- **Type Safety**: End-to-end TypeScript coverage from database schema to UI components

## API Structure
- `GET /api/loans/:rupeekLoanId` - Retrieve comprehensive loan details
- `POST /api/loans/:rupeekLoanId/approve` - Manual approval with validation

# External Dependencies

## Core Framework Dependencies
- **React & React DOM**: Frontend framework and rendering
- **Express**: Backend web server framework
- **Drizzle ORM**: Database ORM with PostgreSQL dialect
- **TanStack React Query**: Server state management and caching

## UI & Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Utility for creating component variants
- **Lucide React**: Icon library for consistent iconography

## Development & Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **Wouter**: Lightweight routing library
- **ESBuild**: Fast JavaScript bundler for production builds

## Database & Validation
- **Neon Database Serverless**: PostgreSQL database provider
- **Zod**: Runtime type validation and schema inference
- **Drizzle Zod**: Integration between Drizzle ORM and Zod validation

## Additional Libraries
- **Date-fns**: Date manipulation utilities
- **React Hook Form**: Form handling with validation
- **Embla Carousel**: Carousel component functionality
- **nanoid**: Unique ID generation for client-side operations

The application is designed to be easily deployable and scalable, with clear separation of concerns between the presentation layer, business logic, and data access patterns.