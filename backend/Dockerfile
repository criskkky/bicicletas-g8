# Archivo de configuración para crear la imagen de Docker del PostgreSQL, solo para desarrollo y pruebas.

# Usa la imagen oficial de PostgreSQL
FROM postgres:latest

# OJO: .ENV
# Variables de entorno para configurar la base de datos (editar según sea necesario).
ENV POSTGRES_DB=mydb
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin

# Exponer el puerto 5432 para acceder a PostgreSQL
EXPOSE 5432

# Iniciar el contenedor con el comando por defecto de la imagen oficial de PostgreSQL
CMD ["postgres"]

# DOCUMENTACIÓN:
# CREAR UNA IMAGEN DE DOCKER PARA EL POSTGRES ->    docker build -t postgres .
# EJECUTAR UN CONTENEDOR CON LA IMAGEN CREADA ->    docker run -d --name postgres -p 5432:5432 postgres
# DETENER EL CONTENEDOR ->                          docker stop postgres
# ELIMINAR EL CONTENEDOR ->                         docker rm postgres
# ELIMINAR LA IMAGEN ->                             docker rmi postgres
# VER LOS CONTENEDORES EN EJECUCIÓN ->              docker ps
# VER TODOS LOS CONTENEDORES ->                     docker ps -a
# VER LAS IMÁGENES DE DOCKER ->                     docker images

# OPCIONAL:
# rm: Elimina el contenedor al detenerlo.
# EJECUTAR UN CONTENEDOR CON PARAMETRO RM ->        docker run -d --name postgres -p 5432:5432 --rm postgres
