# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos los archivos de configuración desde la carpeta backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

# Instalamos todas las dependencias
RUN npm install

# Copiamos todo el código fuente del backend para que NestJS pueda compilar
COPY backend/ .

# Construimos específicamente el microservicio de identidad
RUN npm run build identity

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copiamos solo lo necesario para ejecutar en producción
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copiamos los archivos compilados del microservici
# COPY --from=builder /app/dist/apps/identity ./dist/apps/identity
# COPY --from=builder /app/dist/libs ./dist/libs 

EXPOSE 3000

# Ajustamos el comando de inicio a la ruta real del main compilado
CMD ["node", "dist/apps/identity/main"]