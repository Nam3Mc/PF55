# Usa la última versión de Node.js
FROM node:18

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos necesarios primero (para aprovechar la caché de Docker)
COPY package*.json ./

# Instala las dependencias antes de copiar el resto del código
RUN npm install

# Ahora copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto en el que corre la app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
