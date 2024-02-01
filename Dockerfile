FROM node:20-alpine AS installer
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=installer /app/node_modules/ /app/node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/build/ /app
RUN npm install -g serve
CMD ["serve", "-L"]