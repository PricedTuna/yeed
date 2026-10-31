# Elegimos una imagen ligera de Node.js 22 para reducir el tamaño de la API.
# Ejecuta `docker build` desde la raíz del repositorio, junto a este archivo.
FROM node:22-alpine AS base
WORKDIR /app

# Instalamos las dependencias de la API con versiones exactas.
# El contexto de construcción es la raíz del repositorio.
FROM base AS dependencies
COPY services/api/package.json services/api/package-lock.json ./
RUN npm ci

# Compilamos TypeScript sin incluir estas herramientas en la imagen final.
FROM dependencies AS build
COPY services/api/ ./
RUN npm run build

# Creamos la imagen final con las dependencias necesarias para ejecutar la API.
FROM base AS production
ARG APP_VERSION=1.0.0
LABEL org.opencontainers.image.title="yeed-api" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.description="API de Yeed"

ENV NODE_ENV=production
COPY services/api/package.json services/api/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

# Ejecutamos el servidor con un usuario sin privilegios administrativos.
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]

# Los secretos se proporcionan al ejecutar el contenedor mediante variables de
# entorno o AWS Secrets Manager. El acceso a AWS debe utilizar roles IAM.
# El archivo .dockerignore excluye .env, credenciales y archivos locales.
