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

- This repository ships both the installable PWA and a Capacitor-based Android wrapper project.
- The included GitHub Actions workflow builds a downloadable debug APK artifact.
- Publishing a production Play Store build still requires release signing, final store assets, and Play Console setup.

## Android App Packaging

- This repo now includes Capacitor with a committed `android/` project so the web app can be packaged as a real Android application.
- The Android app uses the built frontend from `client/dist` and loads it inside the native Capacitor WebView.
- Camera scanning in the Android app is enabled with the native `CAMERA` permission in `AndroidManifest.xml`.

### Android Prerequisites

- A deployed backend API reachable over HTTPS, because packaged Android builds cannot use the web-only relative `/api` fallback.
- Android Studio with the bundled JDK and Android SDK for local APK builds.

### Configure the Android API URL

Use a deployed backend URL before syncing or building Android:

```bash
cp client/.env.android.example client/.env
```

Then set:

```bash
VITE_API_BASE_URL=https://your-api-domain.example.com/api
```

### Local Android Workflow

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Build and sync the Android project:

```bash
npm run android:sync
```

3. Open the native project:

```bash
npm run android:open
```

4. In Android Studio, build the debug APK or create a signed release build.

### Manual CLI Checks

- `npm run android:doctor` validates the Capacitor Android setup.
- `npm run android:sync` rebuilds the web assets and copies them into the Android project.

### GitHub Actions APK Build

- A manual workflow is included at `.github/workflows/android-apk.yml`.
- Run `Build Android APK` from the GitHub Actions tab and pass your deployed HTTPS API base URL.
- The workflow builds a debug APK and uploads it as a downloadable artifact named `scannerhub-debug-apk`.

## Useful Scripts

- `npm run dev` - run client and server together
- `npm run build` - build the frontend bundle
- `npm run build:web` - build the frontend bundle for web and Capacitor
- `npm start` - start the backend in production mode
- `npm run dev --prefix client` - frontend only
- `npm run dev --prefix server` - backend only
- `npm run android:copy` - build the web app and copy it into Android
- `npm run android:sync` - build the web app and sync Android dependencies/assets
- `npm run android:doctor` - validate the local Capacitor Android setup
- `npm run android:open` - open the Android Studio project
