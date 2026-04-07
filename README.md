# QR Share Hub

QR Share Hub is a production-minded MERN + PWA application for scanning QR codes, extracting their content, and turning each result into a shareable, re-generated QR experience.

## What You Get

- Camera-based QR scanning for mobile and desktop browsers
- Image upload QR detection for screenshots, flyers, and saved codes
- Smart result rendering for URLs and plain text
- Shareable result pages backed by MongoDB
- Re-generated QR codes with one-tap download
- Installable PWA with manifest, service worker, and offline shell
- Mobile-first UI, dark mode toggle, local history, and lightweight usage stats

## Monorepo Structure

```
/client
  /public
  /src
    /components
    /context
    /pages
    /services
    /utils
/server
  /config
  /controllers
  /models
  /routes
```

## Local Setup

### 1. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

Or install each app separately:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Copy the example env files and update the values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Required values:

- `server/.env`
  - `PORT=5000`
  - `MONGODB_URI=mongodb://127.0.0.1:27017/qr-share-hub`
  - `CLIENT_URL=http://localhost:5173`
  - `APP_BASE_URL=http://localhost:5000`
- `client/.env`
  - `VITE_API_BASE_URL=http://localhost:5000/api`

### 3. Start MongoDB

Make sure a MongoDB instance is running locally or provide a hosted MongoDB URI.

### 4. Run the app in development

In the project root:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## API

### `POST /api/qr/save`

Request body:

```json
{
  "content": "https://example.com"
}
```

Response:

```json
{
  "message": "QR content saved successfully.",
  "data": {
    "id": "66111234abcd1234abcd1234",
    "content": "https://example.com",
    "type": "url",
    "createdAt": "2026-04-06T10:00:00.000Z"
  }
}
```

### `GET /api/qr/:id`

Returns the stored QR payload for the provided share id.

## Production Build

### Build the client

```bash
npm run build --prefix client
```

### Run the server

```bash
npm start --prefix server
```

In production, the Express server will automatically serve `client/dist` if it exists.

## Deployment Notes

### Option 1: Single-service deployment

1. Build the client: `npm run build --prefix client`
2. Deploy the entire repo to a Node host such as Render, Railway, Fly.io, or a VPS
3. Set environment variables on the server
4. Start command: `npm start --prefix server`

### Option 2: Split deployment

1. Deploy `client` to Vercel, Netlify, or Cloudflare Pages
2. Deploy `server` to Render, Railway, Fly.io, or your Node host
3. Set `VITE_API_BASE_URL` to your deployed backend API base URL
4. Set `CLIENT_URL` on the server to the deployed frontend origin

## Render + Netlify Deployment

This repo is already prepared for a split deployment:

- `render.yaml` deploys the Express API from `server/`
- `netlify.toml` deploys the Vite frontend from `client/`
- `client/public/_redirects` keeps React Router routes such as `/share/:id` working on Netlify

### 1. Deploy the backend to Render

1. Push this repo to GitHub.
2. In Render, create a new Web Service from the repo or use the included `render.yaml`.
3. Render service settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
4. Add these environment variables in the Render dashboard:
   - `MONGODB_URI=<your MongoDB Atlas connection string>`
   - `CLIENT_URL=<your Netlify site URL>`
   - `APP_BASE_URL=<your Render backend URL>`

Example once deployed:

- `CLIENT_URL=https://qr-share-hub.netlify.app`
- `APP_BASE_URL=https://qr-share-hub-api.onrender.com`

### 2. Deploy the frontend to Netlify

1. In Netlify, import the same GitHub repo.
2. Netlify will pick up `netlify.toml` automatically.
3. Confirm the build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add this environment variable in Netlify:
   - `VITE_API_BASE_URL=https://your-render-service.onrender.com/api`

### 3. Wire the two deployments together

After both sites are live:

1. Copy the Netlify production URL into Render as `CLIENT_URL`
2. Copy the Render production URL into Netlify as `VITE_API_BASE_URL`
3. Redeploy both services so the final URLs are picked up cleanly

### 4. MongoDB Atlas

Use your Atlas connection string only in Render environment variables, not in committed files.

If you already exposed credentials in a shared place, rotate that database password in MongoDB Atlas before going live.

## PWA Checklist

- `manifest.webmanifest` with app name, colors, and icons
- Service worker with app-shell + runtime caching
- Standalone install support
- Offline fallback page

## Mobile Install Notes

- Android browsers may show a native install sheet through `beforeinstallprompt`, or a manual browser-menu action such as `Install app` or `Add to Home screen`.
- iPhone and iPad do not expose the same install event in Safari, so installation should be done with `Share > Add to Home Screen`.
- If the site is opened in Chrome or another iOS browser, the app should guide the user to reopen it in Safari for installation.

## APK Note

- This repository ships an installable PWA, not a signed native Android APK.
- A real downloadable APK or Play Store package would require a native wrapper workflow such as Capacitor or Trusted Web Activity plus Android build/signing setup.

## Useful Scripts

- `npm run dev` - run client and server together
- `npm run build` - build the frontend bundle
- `npm start` - start the backend in production mode
- `npm run dev --prefix client` - frontend only
- `npm run dev --prefix server` - backend only
