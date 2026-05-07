# Team Task Manager (Full-Stack) Implementation Plan

We will build a comprehensive full-stack Team Task Manager to meet all of your requirements. 

## Project Architecture

We will structure the project into two main directories inside the workspace (`c:\Users\bhavy\OneDrive\Desktop\Web app`):
1. **`backend/`**: A Node.js + Express REST API.
2. **`frontend/`**: A React application built with Vite.

### Tech Stack
*   **Frontend**: React, React Router, Vanilla CSS (prioritizing modern, premium aesthetics with glassmorphism and animations).
*   **Backend**: Node.js, Express.js.
*   **Database**: PostgreSQL managed via Prisma ORM (provides excellent relational data handling and validations).
*   **Authentication**: JSON Web Tokens (JWT) for secure session management.
*   **Deployment**: Railway.

---

## User Review Required

> [!IMPORTANT]
> Please review the tech stack and database choice. I've selected **PostgreSQL with Prisma** as it provides robust relational capabilities which are perfect for Project -> Tasks -> Users relationships. Does this sound good to you?

> [!WARNING]
> **Deployment Strategy on Railway**: Railway allows deploying frontend and backend as separate services, or we can configure the backend to statically serve the frontend build from a single service (which uses fewer resources). 
> For the simplest Railway deployment, I recommend the **monorepo / single-service approach** (Backend serves the built Frontend). Let me know if you prefer separate frontend/backend services.

---

## Proposed Changes

### Database Schema (Prisma / PostgreSQL)
*   **User**: `id`, `name`, `email`, `password`, `role` (ADMIN, MEMBER)
*   **Project**: `id`, `name`, `description`, `ownerId` (Admin)
*   **Task**: `id`, `title`, `description`, `status` (PENDING, IN_PROGRESS, COMPLETED), `dueDate`, `projectId`, `assigneeId`

---

### Backend Components (`c:\Users\bhavy\OneDrive\Desktop\Web app\backend`)

#### [NEW] `server.js`
The main entry point for the Express server.

#### [NEW] `prisma/schema.prisma`
Database schema definition.

#### [NEW] `routes/auth.routes.js`
Endpoints: `POST /register`, `POST /login`.

#### [NEW] `routes/projects.routes.js`
Endpoints: 
* `GET /` (All projects)
* `POST /` (Create project - Admin only)
* `GET /:id` (Project details & its tasks)

#### [NEW] `routes/tasks.routes.js`
Endpoints:
* `GET /` (User's tasks or all for Admin)
* `POST /` (Create task - Admin only)
* `PUT /:id/status` (Update status - Member/Admin)
* `PUT /:id` (Edit task - Admin only)

#### [NEW] `middlewares/auth.middleware.js`
JWT verification and Role checking (`isAdmin`).

---

### Frontend Components (`c:\Users\bhavy\OneDrive\Desktop\Web app\frontend`)

#### [NEW] `index.html` & `src/main.jsx`
Vite React entry points.

#### [NEW] `src/index.css`
Core design system, defining modern variables (colors, typography, spacing), glassmorphism utility classes, and global resets.

#### [NEW] `src/App.jsx`
Routing setup using `react-router-dom` (Login, Signup, Dashboard, Project Details).

#### [NEW] `src/pages/Dashboard.jsx`
Main view showing overview of projects and tasks, filtering overdue tasks, etc.

#### [NEW] `src/pages/Login.jsx` & `Signup.jsx`
Authentication views with validation.

#### [NEW] `src/components/`
Reusable UI components: `Button`, `Input`, `Modal`, `TaskCard`, `ProjectCard`.

---

## Verification Plan

### Automated/Manual Testing
1. **Local API Testing**: We will test the REST APIs using cURL or browser requests to ensure validations and RBAC (Role-Based Access Control) work correctly.
2. **Frontend UI/UX**: Verify that the Vanilla CSS provides a premium, responsive experience. Ensure role checks block members from creating projects/tasks.
3. **Database Integration**: Ensure cascading deletes work (e.g., deleting a project deletes its tasks).

### Deployment
1. Initialize a Git repository.
2. Provide you with the exact Railway setup steps (e.g., creating a PostgreSQL instance on Railway, linking the repo, setting environment variables).
3. Verify live application functionality.
