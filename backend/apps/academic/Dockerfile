FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Forzamos el build y listamos para depurar si falla
RUN npm run build academic

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
# Usamos un comodín o verificamos la ruta exacta de salida de tu nest-cli.json
COPY --from=builder /app/dist/apps/academic ./dist
EXPOSE 3008
CMD ["node", "dist/main"]