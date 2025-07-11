# Alura Backend

Este proyecto es una API backend desarrollada con Node.js y Express que permite gestionar contactos en una base de datos MySQL. Forma parte de un proyecto de **Infraestructura como Código (IaC)** utilizando **Terraform** para la configuración y despliegue de los recursos necesarios.

## Características

- **Gestión de contactos**: Permite obtener y crear contactos en la base de datos.
- **Base de datos MySQL**: Conexión configurada mediante variables de entorno.
- **Configuración de entorno**: Utiliza un archivo `.env` para almacenar credenciales sensibles.
- **Despliegue automatizado**: Integración con Terraform para la creación de infraestructura en la nube.

## Estructura del proyecto

```
.env
.gitignore
db.js
index.js
package.json
routes/
    contactos.js
```

- `index.js`: Archivo principal que inicia el servidor y configura las rutas.
- `db.js`: Configuración de la conexión a la base de datos MySQL.
- `routes/contactos.js`: Define las rutas para gestionar contactos.
- `.env`: Archivo de configuración de entorno (ignorado por Git).
- `.gitignore`: Lista de archivos y carpetas que no se deben incluir en el control de versiones.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno en el archivo `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=barberia_alura
   PORT=3000
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

## Infraestructura como Código (IaC)

Este proyecto utiliza **Terraform** para definir y desplegar la infraestructura necesaria, como:

- Base de datos MySQL en la nube.
- Configuración de redes y seguridad.
- Servidor para alojar la API.

Consulta la documentación de Terraform para más detalles sobre cómo aplicar la configuración.

## Licencia

Este proyecto está bajo la licencia ISC.