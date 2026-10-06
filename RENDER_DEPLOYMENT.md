# Render Deployment Guide for BudgetByte

## Quick Start

### Option 1: Deploy via Render Blueprint (Easiest)

1. **Create a Render account** at https://render.com
2. **Connect your GitHub repo** to Render
3. **Click "New +"** → **"Blueprint"**
4. **Select your GitHub repo** and click **"Connect"**
5. **Render will auto-detect `render.yaml`** and deploy all services

### Option 2: Manual Web Service Deployment

#### Step 1: Deploy PostgreSQL Database
1. Go to Render Dashboard → **"New +"** → **"PostgreSQL"**
2. **Name:** `budgetbyte-db`
3. **Database Name:** `budgetbyte`
4. **User:** `budgetuser`
5. **Region:** Oregon (or your preference)
6. **Plan:** Free tier (for development)
7. Click **"Create Database"**
8. Copy the **External Database URL** (you'll need this)

#### Step 2: Deploy Backend Service
1. **"New +"** → **"Web Service"**
2. **Connect your GitHub repo**
3. **Name:** `budgetbyte-backend`
4. **Runtime:** Docker
5. **Build Command:** `docker build -t backend ./Backend/BudgetByte/BudgetByte`
6. **Start Command:** `java -jar app.jar`
7. **Port:** `8080`
8. **Environment Variables:**
   ```
   SPRING_DATASOURCE_URL=postgresql://[user]:[REDACTED]@[host]:[port]/budgetbyte
   SPRING_DATASOURCE_USERNAME=budgetuser
   SPRING_DATASOURCE_PASSWORD=[your_password]
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```
9. **Health Check Path:** `/actuator/health`
10. **Plan:** Free
11. Click **"Create Web Service"**

#### Step 3: Deploy Frontend Service
1. **"New +"** → **"Web Service"**
2. **Connect your GitHub repo**
3. **Name:** `budgetbyte-frontend`
4. **Runtime:** Docker
5. **Build Command:** `docker build -t frontend "./Frontend/Budget Tracking APP UI"`
6. **Port:** `80`
7. **Environment Variables:**
   ```
   BACKEND_URL=https://budgetbyte.onrender.com
   VITE_API_URL=https://budgetbyte.onrender.com/api
   ```
8. **Health Check Path:** `/`
9. **Plan:** Free
10. Click **"Create Web Service"**

## Important Notes

### Environment Variables
- **Never commit secrets** (passwords, API keys) to GitHub
- Use Render's **Environment** tab to add sensitive variables
- Mark them as **"Secret"** so they're not exposed in logs

### Database Connection
- Use the **External Database URL** from the PostgreSQL service details
- Format: `postgresql://user:[REDACTED]@hostname:5432/database`
- Frontend and backend communicate via **internal service names** (e.g., `budgetbyte-db:5432`)

### Networking
- Services on the same Render deployment communicate via internal DNS
- From **frontend** to **backend:** `http://budgetbyte-backend:8080` (internal)
- From **external clients:** `https://budgetbyte.onrender.com` (public)

### CORS Configuration
- Update your Spring Boot `application.properties` if needed:
  ```properties
  server.servlet.context-path=/
  cors.allowed-origins=https://budgetbyte-frontend.onrender.com
  ```

### Health Checks
- Backend: `/actuator/health` (Spring Boot actuator endpoint)
- Frontend: `/` (default nginx root)
- Render restarts services that fail health checks

### Auto-Deploy
- Enable **"Auto-Deploy"** on GitHub push to auto-update services
- Push to main/master branch to trigger deployment

## Troubleshooting

### Service won't start
1. Check **Logs** tab in Render Dashboard
2. Verify **environment variables** are set correctly
3. Ensure Docker images are publicly available on Docker Hub

### Backend can't connect to database
1. Verify **External Database URL** in environment variables
2. Check PostgreSQL service is **"Available"** status
3. Test connection locally: `psql postgresql://user:[REDACTED]@host:5432/db`

### Frontend can't reach backend
1. Use the **public URL** of backend service: `https://budgetbyte.onrender.com`
2. Check **CORS settings** in Spring Boot
3. Verify **Nginx proxy config** forwards to correct backend URL

### Free tier limitations
- Services go to sleep after 15 mins of inactivity (cold start delay)
- Limited to 0.5 GB RAM per service
- Upgrade to **"Paid"** plan for always-on services

## Deployment URLs
Once deployed, your services will be available at:
- **Frontend:** `https://budgetbyte-frontend.onrender.com`
- **Backend API:** `https://budgetbyte.onrender.com`
- **Database:** Internal only (use External URL connection string)

## Next Steps
1. Test API endpoints: `curl https://budgetbyte.onrender.com/api/health`
2. Visit frontend: `https://budgetbyte-frontend.onrender.com`
3. Monitor logs in Render Dashboard → **Logs** tab
4. Set up custom domain (optional): Render Dashboard → **Settings** → **Custom Domains**
