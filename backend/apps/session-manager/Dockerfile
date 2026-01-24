FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./
RUN npm install
COPY backend/ .
RUN npm run build session-manager

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3005
CMD ["node", "dist/apps/session-manager/main.js"]