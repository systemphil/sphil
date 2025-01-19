FROM node:20-bullseye as installer
WORKDIR /app
COPY prisma ./
COPY package.json package-lock.json ./
RUN npm install

FROM node:20-bullseye as builder
WORKDIR /app
COPY --from=installer /app/node_modules/ /app/node_modules
COPY . .
COPY .git ./.git 
ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_SITE_ROOT
ENV NEXT_PUBLIC_SITE_ROOT=$NEXT_PUBLIC_SITE_ROOT

RUN npm run build

# Force node.js to use ipv4 first, over ipv6, by appending the following to server.js
RUN echo "const dns = require('node:dns');" >> ./.next/standalone/server.js \
    && echo "dns.setDefaultResultOrder('ipv4first');" >> ./.next/standalone/server.js

FROM node:20-bullseye as runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD node server.js