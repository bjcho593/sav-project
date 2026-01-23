# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Ajuste de rutas: buscamos los archivos de configuración en /backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

RUN npm install

# 2. Copiamos todo el código fuente del backend
COPY backend/ .

# 3. Compilamos el microservicio específico de enrollment
RUN npm run build enrollment

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# 4. Ajustamos la ruta de los archivos compilados según la estructura de NestJS
COPY --from=builder /app/dist/apps/enrollment ./dist/apps/enrollment

EXPOSE 3006

# 5. Comando de inicio con la ruta real al main.js del microservicio
CMD ["node", "dist/apps/enrollment/main"]