# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Ajuste de rutas: buscamos dentro de /backend desde la raíz del proyecto
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

RUN npm install

# 2. Copiamos todo el código fuente del backend
COPY backend/ .

# 3. Construimos específicamente el microservicio session-manager
RUN npm run build session-manager

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# 4. Ajuste de ruta de salida para que coincida con la estructura de NestJS
COPY --from=builder /app/dist/apps/session-manager ./dist/apps/session-manager

EXPOSE 3005

# 5. Comando de inicio apuntando a la ruta real del archivo compilado
CMD ["node", "dist/apps/session-manager/main"]