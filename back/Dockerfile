# Usa la última versión estable de Node.js
FROM node:18

# Define el directorio de trabajo
WORKDIR /back

# Copia solo los archivos necesarios primero (para aprovechar la caché)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación (si es necesario)
RUN npm run build

# Expone el puerto en el que corre la app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
