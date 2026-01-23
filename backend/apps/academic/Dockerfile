# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Ajuste de rutas para encontrar los archivos dentro de /backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

RUN npm install

# 2. Copiamos todo el código fuente del backend
COPY backend/ .

# 3. Construimos específicamente el microservicio academic
RUN npm run build academic

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# 4. Ajuste de ruta de salida (dist/apps/academic)
COPY --from=builder /app/dist/apps/academic ./dist/apps/academic

EXPOSE 3008

# 5. Comando de inicio apuntando a la ruta real de NestJS
CMD ["node", "dist/apps/academic/main"]