# Usa una imagen de Node.js que tenga npm disponible
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto al contenedor
COPY . .

# Moverse a la carpeta back antes de instalar dependencias (si es necesario)
WORKDIR /app/back

# Instalar dependencias
RUN npm install

# Construir el proyecto
RUN npm run build

# Exponer el puerto (ajústalo según tu configuración)
EXPOSE 3000

# Especificar el comando de inicio
CMD ["npm", "start"]
