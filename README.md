# StudyBuddy Docker Project

This repository contains a simple MERN-style study collaboration app scaffold (frontend + backend) with Docker Compose.

What I added in this change:
- Backend: new models and routes for Rooms, Flashcards, and Resources. JWT auth middleware included.
- Frontend: new pages (Dashboard, Rooms, Flashcards, Resources, Pomodoro, Profile) and a top navigation with attractive styles.

Quick start (using Docker Compose)

1. Make sure Docker Desktop is running and WSL integration is enabled (if using WSL).
2. From the project root:

```powershell
# in PowerShell
cd E:\Projects\Sem5\react_doker
docker compose up --build
```

If you hit "permission denied" errors from WSL when accessing the docker socket, follow these steps:

1. Ensure Docker Desktop is running.
2. Add your WSL user to the docker group (in WSL):

```bash
sudo groupadd -f docker
sudo usermod -aG docker $USER
newgrp docker
```

or restart WSL from PowerShell:

```powershell
wsl --shutdown
```

Running locally without Docker
- Start a local MongoDB (or run `docker run -d -p 27017:27017 --name mongo-local mongo`).
- In `backend` folder, install dependencies and start server:

```powershell
cd backend
npm install
node server.js
```

Frontend
- `frontend` is a Vite React app. In development you can run:

```powershell
cd frontend
npm install
npm run dev
```

Notes & next steps
- The new backend routes are minimal CRUD examples meant as a starting point.
- Frontend pages fetch from `/api/*` endpoints; for authenticated requests you'll need to wire login to store the JWT and include it in `Authorization: Bearer <token>` headers.
- I can continue by adding full auth state on the frontend, file uploads, real-time collaboration (Socket.IO), and more polished UI/UX.
