# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

RUN npm install

COPY backend/ .

RUN npm run build identity

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# --- CORRECCIÓN AQUÍ ---
# Copiamos toda la carpeta dist que generó el builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Usamos la ruta completa y agregamos la extensión .js por seguridad
CMD ["node", "dist/apps/identity/main.js"]