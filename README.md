# Link Shrinker

A full-stack URL shortener built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

## Preview

![Link Shrinker UI](./preview.png)

## Project Structure

- `React-URL/` - Frontend app
- `Node-URL/` - Backend API and redirect service

## Features

- Shorten long URLs with a single click
- Reuse existing short links for the same original URL
- Redirect from short code to original URL
- Track click count in MongoDB
- Copy shortened link from the UI

## Tech Stack

- Frontend: React, Vite, Axios, ShaderGradient
- Backend: Express, Mongoose, NanoID, CORS, Dotenv
- Database: MongoDB

## Run Locally

### 1. Start backend

```bash
cd Node-URL
npm install
```

Create `.env` in `Node-URL/`:

```env
MONGO_URI=mongodb://localhost:27017/urlshortener
```

Run server (port `5000`):

```bash
node index.js
```

### 2. Start frontend

```bash
cd React-URL
npm install
npm run dev
```

Frontend will call backend at `http://localhost:5000`.

## API

### `POST /api/shorten`

Request body:

```json
{
  "originalUrl": "https://example.com/some/long/path"
}
```

Response (example):

```json
{
  "_id": "...",
  "shortId": "abc123",
  "originalUrl": "https://example.com/some/long/path",
  "clicks": 0
}
```

### `GET /:code`

Redirects to the original URL for that short code.
