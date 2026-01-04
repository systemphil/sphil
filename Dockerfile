FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

FROM base AS installer
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm run db:regen

FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_SITE_ROOT
ENV NEXT_PUBLIC_SITE_ROOT=$NEXT_PUBLIC_SITE_ROOT

RUN --mount=type=secret,id=sec_database_url \
    export DATABASE_URL=$(cat /run/secrets/sec_database_url) && \
    pnpm run build

# Inject IPv4 preference into the standalone server.js
RUN echo "const dns = require('node:dns');" >> ./.next/standalone/server.js \
    && echo "dns.setDefaultResultOrder('ipv4first');" >> ./.next/standalone/server.js

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]