FROM node:20

# Crear el directorio de la app
WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto de la app
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar
CMD ["node", "index.js"]