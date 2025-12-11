# i-eSchool Admin Panel

A modern, responsive admin dashboard for online school management. This is a frontend-only prototype designed for technical interview exercises where candidates will implement backend functionality.

![i-eSchool Admin Panel](https://img.shields.io/badge/Next.js-16.0.7-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8)

## Overview

i-eSchool Admin Panel is a clean, professional education management system built with Next.js, React, TypeScript, and Tailwind CSS. It provides a complete UI for managing classes, students, attendance, AI-powered summaries, and Microsoft Teams integration.

**This is a frontend prototype.** All data is currently stored in component state using mock data. Candidates in technical interviews will implement the backend functionality.

## Features

### Implemented Pages

- **Dashboard** - Overview with statistics, recent activity, and quick actions
- **Classes Management** - CRUD operations for classes with modals
- **Students Management** - Manage students with class assignments
- **Attendance System** - Mark attendance by class and date
- **AI Summary** - Placeholder UI for AI-powered attendance insights
- **Teams Integration** - UI for Microsoft Teams webhook integration

### Key Characteristics

- Fully responsive design (mobile, tablet, desktop)
- Clean sidebar navigation with active states
- Modern UI components using shadcn/ui
- TypeScript interfaces for all data models
- Mock data stored in component state
- Ready for backend integration

## Tech Stack

- **Framework**: Next.js 16.0.7 (App Router)
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

**Candidates should complete a minimum of 1 of the following 3 tasks:**

### Task 1: Database Integration

Replace mock data with a real database:

- **Options**: PostgreSQL, MongoDB, MySQL, Supabase, etc.
- **What to implement**:
  - Database schema for classes, students, and attendance
  - Database connection setup
  - Replace component state with database queries
  - Implement proper error handling

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

### Task 3: Build REST/GraphQL APIs

Create a complete API layer for the application:

- **What to implement**:
  - RESTful or GraphQL API endpoints
  - Request validation using Zod or similar
  - Error handling and status codes
  - API documentation (optional)
  - Authentication/authorization (optional)

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

1. **No Real Backend**: All data is currently stored in React state. Database calls and API integrations need to be implemented.

2. **Mock Data**: Mock data is in `lib/mock-data.ts` - use this as a reference for data structure.

3. **Type Safety**: All data models have TypeScript interfaces - use these when implementing backend.

4. **Component State**: Currently using `useState` for data management - replace with API calls or state management library.

5. **Authentication**: No authentication is implemented - add if required for your interview.

6. **Environment Variables**: Create a `.env.local` file for any API keys or database URLs:
\`\`\`env
DATABASE_URL=your_database_url
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
