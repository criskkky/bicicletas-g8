# Archivo de configuración para crear la imagen de Docker del backend, solo para desarrollo y pruebas.

# Usa la imagen oficial de PostgreSQL
FROM postgres:latest

# Variables de entorno para configurar la base de datos (editar según sea necesario).
ENV POSTGRES_DB=mydb
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin

# Exponer el puerto 5432 para acceder a PostgreSQL
EXPOSE 5432

# Iniciar el contenedor con el comando por defecto de la imagen oficial de PostgreSQL
CMD ["postgres"]

# DOCUMENTACIÓN:
# CREAR UNA IMAGEN DE DOCKER PARA EL BACKEND ->     docker build -t backend .
# EJECUTAR UN CONTENEDOR CON LA IMAGEN CREADA ->    docker run -d --name backend -p 5432:5432 backend
# DETENER EL CONTENEDOR ->                          docker stop backend
# ELIMINAR EL CONTENEDOR ->                         docker rm backend
# ELIMINAR LA IMAGEN ->                             docker rmi backend
# VER LOS CONTENEDORES EN EJECUCIÓN ->              docker ps
# VER TODOS LOS CONTENEDORES ->                     docker ps -a
# VER LAS IMÁGENES DE DOCKER ->                     docker images
