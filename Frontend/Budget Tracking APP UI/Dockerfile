# Multi-stage build for Vue.js frontend
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build arguments for environment variables (passed from Render)
ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_DEBUG=false
ARG NODE_ENV=production
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_DEBUG=${VITE_DEBUG}
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
