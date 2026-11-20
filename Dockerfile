# syntax=docker/dockerfile:1

# ===== Tahap 1: install dependency =====
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ===== Tahap 2: build =====
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Semua nilai ini TERTANAM saat build, jadi wajib diberikan sebagai build arg:
#   BACKEND_URL                     : alamat backend dari sisi server Next (rewrite /api/*),
#                                     mis. http://backend:5000 di docker compose
#   NEXT_PUBLIC_API_URL             : alamat backend dari sisi BROWSER (gambar /uploads lama)
#   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY : client key Midtrans (publik)
#   NEXT_PUBLIC_MIDTRANS_SNAP_URL   : URL snap.js sandbox/production
ARG BACKEND_URL=http://backend:5000
ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ARG NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
ARG NEXT_PUBLIC_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
ENV BACKEND_URL=$BACKEND_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=$NEXT_PUBLIC_MIDTRANS_CLIENT_KEY \
    NEXT_PUBLIC_MIDTRANS_SNAP_URL=$NEXT_PUBLIC_MIDTRANS_SNAP_URL \
    NEXT_OUTPUT=standalone \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ===== Tahap 3: runtime minimal =====
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/login').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
