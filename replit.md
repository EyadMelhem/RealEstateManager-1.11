# Replit Property Management System

## Overview

This is a comprehensive property management system built with modern web technologies, designed to help property managers track properties, tenants, rental contracts, and payments. The application features a clean Arabic RTL interface with full CRUD operations for all entities.

## System Architecture

The system follows a full-stack architecture pattern with clear separation between frontend and backend concerns:

- **Frontend**: React-based SPA with TypeScript
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: Vite for development and production builds
- **UI Framework**: shadcn/ui components with Tailwind CSS

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS with Arabic font support (Noto Sans Arabic)
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: RTL support for Arabic interface

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Design**: RESTful API with proper HTTP status codes
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error handling middleware

### Database Schema
The system manages four main entities:
- **Properties**: Real estate units with details like type, area, rent, and owner information
- **Tenants**: Renter information including contact details and emergency contacts
- **Contracts**: Rental agreements linking properties to tenants with terms and conditions
- **Payments**: Payment records with due dates, amounts, and payment methods

### Authentication and Authorization
Currently, the system does not implement authentication mechanisms. This is intentionally kept simple for the initial version.

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle requests and validate input using Zod schemas
3. **Business Logic**: Storage layer implements business operations
4. **Database**: Drizzle ORM executes type-safe SQL queries against PostgreSQL
5. **Response**: Data flows back through the same layers with proper error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Modern TypeScript ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **zod**: Schema validation library

### UI Dependencies
- **@radix-ui/***: Accessible primitive components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for conditional classes

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety across the application
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Mode
- **Command**: `npm run dev`
- **Port**: 5000 (mapped to external port 80)
- **Features**: Hot reload, Vite dev server, Express API

### Production Build
- **Build Command**: `npm run build`
- **Start Command**: `npm run start` 
- **Assets**: Client builds to `dist/public`, server builds to `dist/index.js`

### Database Configuration
- **Provider**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Managed through Drizzle Kit
- **Connection**: Environment variable `DATABASE_URL`

### Environment Setup
The application expects:
- PostgreSQL database URL in `DATABASE_URL` environment variable
- Node.js 20+ runtime environment
- Replit modules: nodejs-20, web, postgresql-16

## Changelog
- June 18, 2025: Initial setup of comprehensive Arabic property management system
- June 18, 2025: Currency changed from Israeli Shekel (ILS) to Jordanian Dinar (JOD) across all forms and displays
- June 19, 2025: Complete Flutter application architecture created with cross-platform support
- June 19, 2025: Implemented Flutter BLoC pattern for state management across all features
- June 19, 2025: Created comprehensive UI with Arabic RTL support and Material Design 3
- June 19, 2025: Added SQLite database integration with complete schema for all entities

## Flutter Application Architecture

### Cross-Platform Support
The Flutter version provides native performance across:
- **Mobile**: Android and iOS applications
- **Desktop**: Windows, macOS, and Linux applications  
- **Web**: Progressive Web App with full functionality

### State Management Pattern
- **BLoC Pattern**: Implemented for all features (Properties, Tenants, Contracts, Payments, Expenses)
- **Event-Driven Architecture**: Clean separation of UI and business logic
- **Reactive Programming**: Stream-based state updates for responsive UI

### Database Integration
- **SQLite**: Local database for offline-first functionality
- **Schema Migration**: Automatic database setup and versioning
- **Data Persistence**: Full CRUD operations for all entities

### UI/UX Features
- **Arabic RTL Support**: Complete right-to-left layout support
- **Material Design 3**: Modern Android design system
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Dark/Light Theme**: System-aware theming (planned)

## User Preferences

Preferred communication style: Simple, everyday language.
Currency: Jordanian Dinar (د.أ - JOD)
Platform Preference: Flutter for cross-platform compatibility (mobile, desktop, web)
UI Language: Arabic with RTL support