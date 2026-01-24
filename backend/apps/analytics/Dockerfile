FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./
RUN npm install
COPY backend/ .
RUN npm run build analytics

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/apps/analytics/main.js"]