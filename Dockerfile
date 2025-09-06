FROM node:22-bullseye AS installer
WORKDIR /app
COPY prisma ./
COPY package.json package-lock.json ./
RUN npm install

FROM node:22-bullseye AS builder
WORKDIR /app
COPY --from=installer /app/node_modules/ /app/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_SITE_ROOT
ENV NEXT_PUBLIC_SITE_ROOT=$NEXT_PUBLIC_SITE_ROOT

RUN --mount=type=secret,id=sec_database_url \
    export DATABASE_URL=$(cat /run/secrets/sec_database_url) && \
    npm run build

# Force node.js to use ipv4 first, over ipv6, by appending the following to server.js
RUN echo "const dns = require('node:dns');" >> ./.next/standalone/server.js \
    && echo "dns.setDefaultResultOrder('ipv4first');" >> ./.next/standalone/server.js

FROM node:22-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]