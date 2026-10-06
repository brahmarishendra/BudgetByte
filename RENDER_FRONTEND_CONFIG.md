# Render Frontend Deployment Configuration

## Quick Setup for Budget Byte Frontend

### 1. Root Directory
```
Frontend/Budget Tracking APP UI
```
This ensures auto-deploys only trigger on frontend changes and builds run from the correct directory.

---

### 2. Build Command
```bash
npm ci && npm run build
```

**Explanation:**
- `npm ci` — installs exact versions from `package-lock.json` (safer than `npm install` for CI/CD)
- `npm run build` — runs Vite build script, outputs to `dist/`

**⚠️ Common Error:** The original `npm run && npm update` is invalid syntax. Use the command above.

---

### 3. Publish Directory
```
dist
```

**Why:** Vite outputs built assets to `./dist/`. Nginx serves these static files.

---

### 4. Environment Variables

Add these to **Render Dashboard → Environment** (not as secrets unless marked):

| Key | Value | Scope | Notes |
|-----|-------|-------|-------|
| `VITE_API_URL` | `https://budgetbyte.onrender.com/api` | Public | Backend API endpoint |
| `VITE_API_BASE_URL` | `https://budgetbyte.onrender.com` | Public | Base URL for requests |
| `VITE_API_TIMEOUT` | `30000` | Public | Timeout in milliseconds |
| `VITE_DEBUG` | `false` | Public | Disable debug in production |
| `VITE_LOG_LEVEL` | `info` | Public | Logging level |
| `VITE_APP_TITLE` | `Budget Byte` | Public | App display name |
| `VITE_ENABLE_ANALYTICS` | `true` | Public | Enable analytics (optional) |
| `VITE_ENABLE_ERROR_REPORTING` | `true` | Public | Error tracking (optional) |
| `NODE_ENV` | `production` | Public | Node environment |
| `NPM_FLAGS` | `--legacy-peer-deps` | Public | *(Only if npm install fails)* |

---

### 5. Service Configuration in Render Dashboard

**Name:** `budgetbyte-frontend`  
**Plan:** Free or Starter  
**Region:** Oregon (or your preference)  
**Runtime:** Docker *(already using multi-stage Dockerfile)*  

**Port:** 80 (Nginx default)

**Health Check:**
- Path: `/`
- Initial Delay: 10s
- Interval: 10s
- Timeout: 5s
- Max Failed Checks: 3

---

### 6. Auto-Deploy Settings

✅ Enable **Auto-Deploy** → builds & deploys on every push to your repo branch  
✅ Set **Build Filter** path to `Frontend/Budget Tracking APP UI/**`  
  *(Prevents redeployment when only Backend changes)*

---

### 7. Build Hooks (Optional)

If you need pre-build or post-build actions:

**Pre-Build:**
```bash
npm ci
```

**Post-Deploy Notification:**
- Send webhook to your monitoring service (if applicable)

---

### 8. Dockerfile Verification

Your multi-stage Dockerfile is production-ready:
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

✅ **Stage 1:** Builds app, outputs to `dist/`  
✅ **Stage 2:** Serves static files via Nginx  
✅ **Result:** ~50–100MB final image (lightweight)

---

### 9. Nginx Configuration

Verify your `nginx.conf` includes:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://budgetbyte.onrender.com/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Key:** `try_files` ensures Vue Router works correctly (SPA routing).

---

### 10. SPA Routing & 404 on Page Refresh (CRITICAL)

Because Vue Router uses HTML5 history mode (`createWebHistory()`), refreshing any page like `/login` or `/home` or visiting direct URLs will cause Render to return a **404 Not Found** error unless a Rewrite rule is added.

#### If deployed as a Render Static Site (Dashboard):
1. Open the [Render Dashboard](https://dashboard.render.com).
2. Select your frontend static site (`budgetbyte-1` or `budgetbyte-frontend`).
3. In the left navigation, click **Redirects / Rewrites**.
4. Click **Add Rule** and enter:
   - **Type / Action:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
5. Click **Save Changes**. (Changes take effect immediately without needing a rebuild).

#### If configured in `render.yaml`:
```yaml
  - type: static
    name: budgetbyte-frontend
    rootDir: Frontend/Budget Tracking APP UI
    buildCommand: npm ci && npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

### 11. Troubleshooting

| Issue | Solution |
|-------|----------|
| **404 Not Found on `/login`, `/home`, or page refresh** | Add Rewrite rule in Render: Source `/*` -> Destination `/index.html` (Action: `Rewrite`). |
| Build fails: `npm ci not found` | Use `npm install` instead; Render may not have npm ci |
| Static files 404 | Verify Publish Directory = `dist` |
| API calls fail from frontend | Check `VITE_API_BASE_URL` or `VITE_API_URL` matches backend domain |
| Nginx shows 502 | Backend service may be unavailable; check backend logs |
| Slow builds | Free tier has limited CPU; consider Starter plan |

---

### 11. Render YAML Alternative

If using `render.yaml` in repo root, update the frontend service:

```yaml
- type: webservice
  name: budgetbyte-frontend
  plan: free
  region: oregon
  runtime: docker
  rootDir: Frontend/Budget Tracking APP UI
  dockerfilePath: Dockerfile
  dockerBuildContext: .
  buildCommand: npm ci && npm run build
  publishCommand: "" # Not needed for Docker deployments
  staticPublishPath: dist  # Render will serve this directory
  port: 80
  envVars:
    - key: VITE_API_URL
      value: https://budgetbyte.onrender.com/api
    - key: NODE_ENV
      value: production
  healthCheck:
    path: /
    initialDelaySeconds: 10
    intervalSeconds: 10
    timeoutSeconds: 5
    maxFailedHealthChecks: 3
  autoDeploy: true
  buildFilter:
    paths:
      - "Frontend/Budget Tracking APP UI/**"
```

---

### 12. Summary

| Setting | Value |
|---------|-------|
| Root Directory | `Frontend/Budget Tracking APP UI` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Environment | See table in Section 4 |
| Health Check Path | `/` |
| Auto-Deploy | Enabled |

Once configured, push to your repo branch and Render auto-deploys. Monitor the **Build Logs** tab in Render Dashboard.
