# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# FitBuddy — single-image build.
#
# The Express server serves BOTH the JSON API and the built React SPA on one
# port in production (see server/src/app.js). So we build the client, install
# the server's production dependencies, and ship them together in a slim image.
# ---------------------------------------------------------------------------

# 1. Build the React client -> client/dist
FROM node:22-alpine AS client-build
WORKDIR /app/client
# Install deps first so this layer is cached unless the lockfile changes.
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# 2. Install the server's PRODUCTION dependencies only
FROM node:22-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# 3. Final runtime image
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
# dumb-init gives us proper PID 1 signal handling for graceful shutdown.
RUN apk add --no-cache dumb-init
WORKDIR /app/server

# Server code + its production node_modules
COPY --chown=node:node server/package.json ./
COPY --chown=node:node --from=server-deps /app/server/node_modules ./node_modules
COPY --chown=node:node server/src ./src

# Built client assets. CLIENT_DIST (below) points the server here, and the
# default resolve path (../../client/dist) also lands here.
COPY --chown=node:node --from=client-build /app/client/dist /app/client/dist
ENV CLIENT_DIST=/app/client/dist

# Run as the unprivileged built-in `node` user.
USER node

EXPOSE 4000

# Liveness check against the server's own health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
