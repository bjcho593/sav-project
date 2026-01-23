# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Ajuste de rutas: buscamos los archivos de NestJS dentro de /backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

RUN npm install

# 2. Copiamos todo el contenido de la carpeta backend
COPY backend/ .

# 3. Compilamos específicamente el microservicio de scheduling
RUN npm run build scheduling

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# 4. Ajustamos la ruta de los archivos compilados
COPY --from=builder /app/dist/apps/scheduling ./dist/apps/scheduling

EXPOSE 3007

# 5. Comando de inicio con la ruta real del archivo generado por NestJS
CMD ["node", "dist/apps/scheduling/main"]