# Team Task Manager

Full-stack app scaffolding has been created according to the implementation plan.

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. copy `.env.example` to `.env`
4. update `DATABASE_URL` and `JWT_SECRET`
5. `npx prisma generate`
6. `npx prisma migrate dev --name init`
7. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Single-service deployment
1. `cd frontend`
2. `npm run build`
3. Serve the static `frontend/dist` files from the backend by running `npm run dev` in `backend`

## Notes
- Backend runs on port `4000` by default.
- Frontend API base is configured in `frontend/.env`.
- Authentication uses JWT via `Authorization: Bearer <token>`.
