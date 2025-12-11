# i-eSchool Admin Panel

A modern, responsive admin dashboard for online school management. This project now integrates a MongoDB backend via Next.js API Routes, transitioning from a frontend-only prototype to a functional application with data persistence.

![i-eSchool Admin Panel](https://img.shields.io/badge/Next.js-16.0.7-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8)

## Overview

i-eSchool Admin Panel is a clean, professional education management system built with Next.js, React, TypeScript, and Tailwind CSS. It provides a complete UI for managing classes, students, attendance, AI-powered summaries, and Microsoft Teams integration. The backend functionality for `Classes` and `Students` management is implemented using MongoDB and Next.js API Routes, providing data persistence. This serves as a foundation, and candidates can expand upon it.

## Features

### Implemented Pages

- **Dashboard** - Overview with statistics, recent activity, and quick actions
- **Classes Management** - CRUD operations for classes with modals (with data persistence)
- **Students Management** - Manage students with class assignments (with data persistence)
- **Attendance System** - Mark attendance by class and date
- **AI Summary** - Placeholder UI for AI-powered attendance insights
- **Teams Integration** - UI for Microsoft Teams webhook integration

### Key Characteristics

- Fully responsive design (mobile, tablet, desktop)
- Clean sidebar navigation with active states
- Modern UI components using shadcn/ui
- TypeScript interfaces for all data models
- Data persistence with MongoDB and Next.js API routes
- Ready for further backend integration

## Tech Stack

- **Framework**: Next.js 16.0.7 (App Router)
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks (useState)

## Getting Started

### Prerequisites

- Node.js 18+ or later
- npm, yarn, or pnpm package manager

### Installation

1. **Clone or download this repository**

\`\`\`bash
git clone <repository-url>
cd i-eschool-admin-panel
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. **Run the development server**

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

\`\`\`
i-eschool-admin-panel/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with sidebar
│   ├── page.tsx                 # Dashboard page
│   ├── classes/page.tsx         # Classes management
│   ├── students/page.tsx        # Students management
│   ├── attendance/page.tsx      # Attendance tracking
│   ├── ai-summary/page.tsx      # AI summary placeholder
│   └── teams-integration/page.tsx # Teams webhook UI
├── components/                   # Reusable components
│   ├── app-sidebar.tsx          # Navigation sidebar
│   ├── app-header.tsx           # Top header bar
│   ├── stat-card.tsx            # Dashboard stat cards
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utilities and shared code
│   ├── types.ts                 # TypeScript interfaces
│   ├── mock-data.ts             # Mock data for development
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
└── package.json                 # Dependencies
\`\`\`

## Data Models

All TypeScript interfaces are defined in `lib/types.ts`:

\`\`\`typescript
interface Class {
  id: string
  name: string
  teacher: string
  numberOfStudents: number
  description?: string
}

interface Student {
  id: string
  name: string
  className: string
  email?: string
  status: "Active" | "Inactive"
}

interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  className: string
  date: string
  status: "Present" | "Absent"
}
\`\`\`

## Interview Task Guidelines

**This project now includes partial implementations of Task 1 (Database Integration for Students and Classes) and Task 3 (REST APIs for Students and Classes). Candidates are encouraged to build upon this foundation.**

### Task 1: Database Integration (Partially Implemented)

The database integration for `Students` and `Classes` is now partially implemented using **MongoDB** and **Mongoose**.

- **What has been implemented**:
  - MongoDB database connection (`lib/db.ts`)
  - Mongoose schemas/models for `Student`, `Class`, and `Attendance`
  - RESTful API endpoints for `Students` (`/api/students`, `/api/students/:id`) and `Classes` (`/api/classes`, `/api/classes/:id`) to handle CRUD operations.
  - Data fetching for `Students` and `Classes` pages from the database.
  - Loading states on `Students` and `Classes` pages for better UX.

- **Further expansion for candidates**:
  - Implement database integration for the `Attendance` system.
  - Implement real-time updates (e.g., using WebSockets).
  - Add more robust error handling and validation.

**Suggested API endpoints**:
\`\`\`
GET    /api/classes
POST   /api/classes
DELETE /api/classes/:id

GET    /api/students
POST   /api/students
DELETE /api/students/:id

GET    /api/attendance?classId=&date=
POST   /api/attendance
\`\`\`

### Task 2: Microsoft Teams Integration

Implement the Teams webhook functionality:

- **What to implement**:
  - Backend API endpoint: `POST /api/teams/send-message`
  - Validate webhook URL format
  - Send formatted messages to Teams using the webhook
  - Handle success/error responses
  - Add proper authentication/security

**Example implementation**:
\`\`\`typescript
// app/api/teams/send-message/route.ts
export async function POST(request: Request) {
  const { webhookUrl, message } = await request.json()
  
  // Validate webhook URL
  // Send message to Teams
  // Return success/error response
}
\`\`\`

### Task 3: Build REST/GraphQL APIs (Partially Implemented for Students and Classes)

REST APIs for `Students` and `Classes` have been implemented using **Next.js API Routes**.

- **What has been implemented**:
  - RESTful API endpoints for `Students` and `Classes` for CRUD operations.
  - Request validation for `Students` (using Zod in `lib/validations.ts`).
  - Error handling and appropriate status codes for API responses.

- **Further expansion for candidates**:
  - Implement full API layer for `Attendance`.
  - Explore GraphQL as an alternative or additional API layer.
  - Add API documentation (e.g., Swagger/OpenAPI).
  - Implement authentication/authorization for API endpoints.
  - Add more comprehensive request validation for `Classes`.

**Technologies you can use**:
- Next.js API Routes
- Express.js
- GraphQL with Apollo Server
- tRPC
- Prisma ORM / Drizzle ORM

## Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
\`\`\`

## Design System

The application uses a professional purple/indigo color scheme with:

- **Primary**: Indigo/Purple tones
- **Background**: Neutral grays
- **Accent**: Complementary colors for actions
- **Typography**: Clean, modern fonts
- **Spacing**: Consistent 4px grid system

All design tokens are defined in `app/globals.css` using CSS variables.

## Notes for Developers

1. **Partial Backend Implemented**: A backend using MongoDB and Next.js API Routes is now partially implemented for Students and Classes management. The Attendance system still requires backend integration.

2. **Mock Data**: `lib/mock-data.ts` is still present but data for Students and Classes is fetched from the database. It can be used as a reference or for other parts of the application.

3. **Type Safety**: All data models have TypeScript interfaces - use these when implementing backend.

4. **Data Management**: Data for Students and Classes is now managed through API calls to the MongoDB backend. `useState` is still used for local UI state.

5. **Authentication**: No authentication is implemented - add if required for your interview.

6. **Environment Variables**: Create a `.env.local` file for any API keys or database URLs:
\`\`\`env
DATABASE_URL=your_mongodb_connection_string
TEAMS_WEBHOOK_URL=your_webhook_url
\`\`\`

## Deployment

This project can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any hosting platform supporting Next.js**

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

Or connect your GitHub repository to Vercel for automatic deployments.

## Contributing

This is a technical interview exercise template. Feel free to:

- Add new features
- Improve the UI/UX
- Implement additional pages
- Add testing
- Improve TypeScript types

## License

This project is open source and available for educational purposes.

## Support

For questions or issues during your interview, please reach out to your interview coordinator.

---

**Built with ❤️ for technical interviews**
