# Yearbook App

A full-stack digital yearbook application with user authentication, protected routes, PDF yearbook uploads, and a React-based reader interface.

This repository contains:

- A Node.js + Express + MongoDB backend API
- A React frontend powered by Vite
- Local development setup for MongoDB, frontend, and backend services

## Tech Stack

**Frontend**

- React 19
- Vite
- Material UI
- Redux Toolkit
- React Router
- Axios

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Multer for PDF uploads

## Project Structure

```text
yearbook app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Features

- User registration and login
- JWT-based protected API access
- Role-aware backend middleware
- Yearbook listing and detail routes
- Bookmark and comment support
- PDF upload workflow for yearbooks
- Frontend routing for login, register, home, and yearbook views

## Local Development Setup

### 1. Prerequisites

Make sure these are installed on your machine:

- Node.js
- npm
- MongoDB Community Edition
- Homebrew on macOS if you are installing MongoDB locally

### 2. Clone the Repository

```bash
git clone https://github.com/Ireshrangana/yearbook-app.git
cd yearbook-app
```

### 3. Configure Environment Variables

Copy the example file and create a real local environment file:

```bash
cp backend/.env.example backend/.env
```

Example:

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/yearbook-app?authSource=admin
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://127.0.0.1:3001
```

Notes:

- `backend/.env` is intentionally ignored and should never be committed.
- `backend/.env.example` is safe to commit and documents the required keys.
- If you prefer a different frontend port, update `CLIENT_URL` to match.

### 4. Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the App

You need MongoDB, the backend API, and the frontend dev server running.

### 1. Start MongoDB

If installed with Homebrew:

```bash
brew services start mongodb/brew/mongodb-community
```

Verify MongoDB is running:

```bash
brew services list | grep mongo
mongosh --eval "db.runCommand({ ping: 1 })"
```

### 2. Start the Backend

From the `backend` folder:

```bash
cd "/Users/iresh/Documents/Documents/Codes/Webapp Projects/yearbook app/backend"
PORT=5001 npm start
```

Expected output:

```text
MongoDB connected
Backend listening on http://localhost:5001
```

Health check:

```text
http://localhost:5001/api/health
```

### 3. Start the Frontend

From the `frontend` folder:

```bash
cd "/Users/iresh/Documents/Documents/Codes/Webapp Projects/yearbook app/frontend"
npm start -- --host 127.0.0.1 --port 3000
```

If port `3000` is already in use, Vite will automatically move to another available port such as `3001`.

Open the app in your browser:

```text
http://127.0.0.1:3000
```

or, if Vite switches ports:

```text
http://127.0.0.1:3001
```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Yearbooks

- `GET /api/yearbooks`
- `GET /api/yearbooks/:id`
- `POST /api/yearbooks`
- `POST /api/yearbooks/:id/bookmarks`
- `POST /api/yearbooks/:id/comments`

## Authentication

The backend expects a token through:

- `x-auth-token`

The frontend automatically attaches the token through the Axios interceptor in:

- `frontend/src/utils/api.js`

## Uploads

Yearbook file uploads are stored in:

- `backend/uploads/`

Only PDF uploads are accepted by the current backend implementation.

## Important Security Notes

- Do not commit `.env` files
- Do not commit database credentials, JWT secrets, or API keys
- Review uploaded sample files before publishing the repository publicly
- Rotate any real secrets that may have existed in local-only files before sharing production deployments

## Current Development Notes

- The frontend uses Vite for local development
- The backend defaults to Express on port `5001` in the current local setup
- The frontend API base URL is configured to call `http://localhost:5001`
- MongoDB must be running locally for registration, login, and yearbook routes to work

## Troubleshooting

### Backend says MongoDB connection failed

Make sure MongoDB is installed and running:

```bash
brew services start mongodb/brew/mongodb-community
mongosh --eval "db.runCommand({ ping: 1 })"
```

### Frontend port already in use

Vite will automatically try another port. Check the terminal output for the final local URL.

### Backend root URL shows `Cannot GET /`

That is expected. The backend is an API server.

Use:

- `/api/health` for a quick API check
- the frontend URL for the full application UI

## License

This project is currently provided without a custom license. Add one before using it for broader distribution.
