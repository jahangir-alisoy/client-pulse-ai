# Client Pulse Console

Admin console for the Client Pulse backend, built with React, TypeScript and Vite.

## Run locally

1. Start the backend on `http://localhost:8080`.
2. `npm install`
3. `npm run dev` and open `http://localhost:5173`.

During development every `/api` request is proxied to `http://localhost:8080`.

## Build

`npm run build` writes the static site to `dist/`.

The API base URL defaults to `/api/v1`. When the API is served from another origin, set it at build time:

```
VITE_API_BASE_URL=https://api.example.com/api/v1 npm run build
```

## Structure

| Folder | Contents |
| --- | --- |
| `src/api` | HTTP client with automatic token refresh, endpoints, response types |
| `src/auth` | Token storage, auth context, route guard |
| `src/theme` | System, light and dark theme preference |
| `src/charts` | SVG column and line charts with tooltips and table view |
| `src/components` | Shared UI: app shell, buttons, drawer, status badge, score meter |
| `src/features` | Pages: login, overview, simulation, requests |
| `src/styles` | Design tokens for light and dark mode, base styles |
