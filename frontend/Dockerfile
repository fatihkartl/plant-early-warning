# frontend/Dockerfile

# === Build stage ===
FROM node:22-alpine AS builder
WORKDIR /app

# TR: Build-time arg ile API base geçir (compose args)
# EN: Pass API base via build arg (from compose)
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN npm ci || npm i

COPY . .
# TR: Production build
# EN: Production build
RUN npm run build

# === Serve stage (nginx) ===
FROM nginx:alpine
# TR: Nginx default 80 → compose'ta 5173:80 map'liyoruz
# EN: Nginx default 80 → mapped to 5173 on host
COPY --from=builder /app/dist /usr/share/nginx/html

# TR: Basit gzip/headers için minimal nginx conf (opsiyonel iyileştirme)
# EN: Minimal nginx conf for gzip/headers (optional)
RUN printf 'server { \
  listen 80; \
  server_name _; \
  root /usr/share/nginx/html; \
  location / { try_files $uri $uri/ /index.html; } \
  gzip on; gzip_types text/plain application/javascript text/css image/svg+xml; \
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
