# Overview

TallySync is an Excel Data Platform that provides a comprehensive solution for uploading, processing, and analyzing Excel and CSV files. The application features a modern web interface for file management, data table visualization, and report generation with real-time processing capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **File Uploads**: React Dropzone for drag-and-drop file upload functionality

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for multipart/form-data handling with memory storage
- **Excel/CSV Processing**: XLSX library for parsing spreadsheet files
- **API Design**: RESTful endpoints with JSON responses and structured error handling
- **Development**: Hot module replacement via Vite middleware integration

## Data Storage Solutions
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM with schema-first approach and type safety
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **File Storage**: In-memory processing with metadata persistence to database

## Database Schema Design
The application uses a relational schema with four main entities:
- **Users**: Authentication and user management
- **DataFiles**: File upload metadata and processing status tracking
- **DataTables**: Processed spreadsheet data with JSON storage for flexibility
- **Reports**: Generated analytics and insights with configurable parameters

## Authentication and Authorization
- **Current Implementation**: Default user system for development
- **Session Management**: Express sessions with PostgreSQL backend
- **Future Considerations**: Ready for user authentication integration

## File Processing Pipeline
- **Upload Flow**: Multipart form upload → validation → memory processing → database storage
- **Supported Formats**: Excel (.xlsx, .xls) and CSV files with 10MB size limit
- **Processing**: XLSX library parses files into structured JSON data
- **Status Tracking**: Real-time processing status updates (pending → processing → completed/error)
- **Error Handling**: Comprehensive error capture and user feedback

## Real-time Features
- **Activity Monitoring**: 5-second polling for recent file processing updates
- **Status Updates**: Live processing status indicators in the UI
- **Metrics Dashboard**: Real-time analytics and performance indicators

## Development and Build
- **Development**: Vite dev server with Express API proxy and HMR
- **Build Process**: Vite for frontend bundling, ESBuild for backend compilation
- **TypeScript**: Shared types between frontend and backend via workspace paths
- **Code Quality**: Strict TypeScript configuration with path mapping

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database via `@neondatabase/serverless`
- **Development Platform**: Replit integration with custom Vite plugins and dev banner

## UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling Framework**: Tailwind CSS with PostCSS processing
- **Design System**: shadcn/ui component library with customizable themes

## Data Processing
- **File Parsing**: XLSX library for Excel and CSV file processing
- **Form Validation**: Zod schema validation with React Hook Form integration
- **Date Utilities**: date-fns for date formatting and manipulation

## Development Tools
- **Build Tools**: Vite for frontend, ESBuild for backend compilation
- **Type Safety**: TypeScript with strict configuration across the stack
- **Development Experience**: Runtime error overlay and cartographer for enhanced debugging