# syntax=docker/dockerfile:1

# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-slim AS base
WORKDIR /app

# better-sqlite3 needs native build tools
RUN apt-get update && apt-get install -y python3 make g++ --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# ── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# ── Builder ──────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Rebuild better-sqlite3 for this architecture
RUN pnpm rebuild better-sqlite3

RUN pnpm build

# ── Runner ───────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy SQLite database
COPY --from=builder /app/data ./data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]