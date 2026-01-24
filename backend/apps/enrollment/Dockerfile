# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

RUN npm install
COPY backend/ .

RUN npm run build enrollment

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# --- CORRECCIÓN AQUÍ ---
# Copia TODA la carpeta dist. Esto asegura que se incluyan las 'libs' 
# y la estructura que NestJS espera para arrancar.
COPY --from=builder /app/dist ./dist

EXPOSE 3006

# Es vital usar la ruta completa desde la raíz de dist.
CMD ["node", "dist/apps/enrollment/main.js"]