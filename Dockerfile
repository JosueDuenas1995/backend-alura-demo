# Dockerfile
FROM node:18

# Crear carpeta en el contenedor
WORKDIR /app

# Copiar archivos del proyecto al contenedor
COPY package*.json ./
RUN npm install

COPY . .

# Exponer el puerto donde corre Express
EXPOSE 3000

# Comando para ejecutar el servidor
CMD ["node", "index.js"]
