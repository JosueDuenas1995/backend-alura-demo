# 💈 Backend + Frontend de Barbería Alura en Google Cloud (Free Tier)

Este proyecto demuestra cómo desplegar una aplicación web funcional —compuesta por un **frontend en Vanilla JS** y un **backend en Node.js con Express y MySQL**— completamente en la nube usando **Google Cloud Platform (GCP)**, limitándose al **Free Tier**.

Incluye el uso de **Terraform como herramienta de infraestructura como código (IaC)** para automatizar la creación de recursos en GCP, y emplea servicios como **Cloud SQL**, **App Engine**, y **Cloud Storage**.

---

## 🧩 Arquitectura

- **Frontend:** HTML, CSS y JS Vanilla. Desplegado en un bucket público de Cloud Storage.
- **Backend:** Node.js + Express. Desplegado en App Engine (Standard).
- **Base de datos:** MySQL en Cloud SQL.
- **Infraestructura:** Aprovisionada con Terraform.

---

## ⚠️ Consideraciones importantes

- Este entorno está **diseñado exclusivamente para pruebas dentro del Free Tier de GCP**.
- No se utilizan herramientas como Cloud Functions, Cloud Operations o Secret Manager, pero la arquitectura es extensible.
- Se evita la implementación continua (CI/CD) para mantener la simplicidad del entorno de pruebas.

---

## ✅ Servicios de GCP utilizados

| Servicio           | Descripción                                      | Free Tier       |
|--------------------|--------------------------------------------------|------------------|
| Cloud SQL (MySQL)  | Base de datos relacional                         | ✅ (f1-micro / 1GB almacenamiento) |
| App Engine         | Despliegue del backend                           | ✅ (F1 instance / 28h diarias aprox.) |
| Cloud Storage      | Hosting del frontend estático                    | ✅ 5GB de almacenamiento |
| IAM                | Control de permisos                              | ✅ Incluido       |

---

## 🔧 Requisitos previos

- Cuenta de GCP con el Free Tier habilitado.
- Terraform instalado.
- Node.js y npm instalados.
- SDK de Google Cloud (`gcloud`) instalado y autenticado.
- VSCode o tu editor favorito.

---

## 📁 Estructura del repositorio

![Imagen de infraestructura(solo Front-End por el momento)](https://i.imgur.com/CTypKC5.png)

## 🚀 Pasos para levantar el proyecto

### 1. 🔐 Configurar el entorno local

Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/barberia-cloud
cd barberia-cloud
```
Instala las dependencias del backend:

```bash
npm install
```
# 2. ☁️ Crear la infraestructura con Terraform

Para desplegar la infraestructura necesaria, sigue estos pasos:

---

## Ve al directorio `/terraform`

Primero, navega al directorio donde se encuentran tus archivos de Terraform:

```bash
cd terraform
```

Inicializa Terraform:

```bash
terraform init
```
Aplica el plan:

```bash
terraform apply
```

🔸 Esto creará: instancia de Cloud SQL + red de conexión.

Una vez finalizado, anota la IP pública de la base de datos (terraform output la mostrará).

# 3. 🛠️ Configurar la base de datos

Una vez que la instancia de Cloud SQL esté provisionada, deberás configurarla para que tu aplicación pueda usarla.

---

## Desde Cloud SQL en la consola:

1.  **Conéctate a tu instancia** de Cloud SQL. Puedes hacerlo usando el cliente `gcloud sql connect` o a través de la interfaz web de la consola de Google Cloud.

2.  **Crea la base de datos `contactos_db`**. Esto se puede hacer desde la sección "Bases de datos" de tu instancia en la consola.

3.  **Ejecuta el siguiente SQL** para crear la tabla `contactos` que tu aplicación utilizará para almacenar la información:

    ```sql
    CREATE TABLE contactos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre_completo VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      telefono VARCHAR(20) NOT NULL,
      metodo_contacto VARCHAR(20),
      horario_preferido VARCHAR(20),
      recibir_novedades BOOLEAN
    );
    ```

# 4. 🔧 Configurar variables de entorno

Para que tu aplicación se conecte correctamente a la base de datos, necesitas configurar las variables de entorno tanto para el desarrollo local como para el despliegue en App Engine.

---

## En desarrollo local:

Crea un archivo llamado **`.env`** en el directorio `/backend` de tu proyecto. Este archivo contendrá las credenciales de tu base de datos y otras configuraciones.

```env
DB_HOST=TU_IP_PUBLICA  # Reemplaza con la IP pública de tu instancia de Cloud SQL
DB_USER=alura
DB_PASSWORD=amorbest*95
DB_NAME=contactos_db
PORT=8080
```
Para App Engine:
Cuando despliegues en Google App Engine, configurarás las variables de entorno directamente en tu archivo app.yaml. Puedes usar el archivo app.yaml.example que se encuentra en el repositorio como referencia.

Aquí tienes un ejemplo de cómo debería verse tu app.yaml:

```env
runtime: nodejs20
instance_class: F1
env_variables:
  DB_HOST: 'TU_IP_PUBLICA' # Reemplaza con la IP pública de tu instancia de Cloud SQL
  DB_USER: 'alura'
  DB_PASSWORD: 'CONTRASEÑA-SEGURA'
  DB_NAME: 'contactos_db'
```
# 5. 🚀 Desplegar el backend a App Engine

Ya casi llegamos. Es hora de desplegar tu backend en Google App Engine.

Desde el directorio `/backend`, ejecuta este comando:

```bash
gcloud app deploy
```

Cuando te lo pida, elige la región us-central. Esta región es ideal porque entra dentro del Nivel Gratuito (Free Tier) de Google Cloud. El despliegue podría tardar algunos minutos. Una vez que termine, anota la URL que se genere; se verá algo como esto:

```bash
https://[your-project-id].uc.r.appspot.com
```

# 6. 🌐 Conectar el frontend
En /frontend/contacto.html, modifica esta línea:

```bash
const apiUrl = 'https://[your-app-engine-url]/api/contactos';
```
Por ejemplo:

```bash
const apiUrl = 'https://gcpp-project-464103-h1.uc.r.appspot.com/api/contactos';
```
Ahora tienes una API Rest corriendo en App engine y conectada a tu Backedn incluyendo 

# 7. 🧾 Subir el frontend a Cloud Storage

Para mantener un enfoque de microservicios, hemos separado el proyecto en dos repositorios distintos: uno para el backend (este repositorio) y otro para el frontend.

Si deseas subir el frontend diseñado para este proyecto a Cloud Storage y obtener más detalles sobre el proceso, por favor, visita el siguiente enlace al repositorio de infraestructura de Barberia Alura:

https://github.com/JosueDuenas1995/Barberia-Alura-Infra

---

# 🧹 Apagar o destruir la infraestructura

Si necesitas detener o eliminar los recursos que has desplegado,debes seguir los siguientes pasos.

## 🔻 Para detener temporalmente el backend:
Si solo quieres pausar tu aplicación de App Engine sin eliminarla, puedes detener la versión específica que está en ejecución. Primero, necesitas obtener el [VERSION_ID] de tu aplicación. Puedes encontrarlo en la consola de Google Cloud, en la sección de App Engine, bajo "Versiones".

Una vez que tengas el [VERSION_ID], ejecuta el siguiente comando:

```bash
gcloud app versions stop [VERSION_ID]
```

Alternativamente, simplemente puedes dejar de enviar tráfico a esa versión específica de tu aplicación.

## 🔐 Seguridad (Para producción)

Al ser un modelo de prueba se implemento un modelo de seguridada basico, en caso de levantar la infraestructura en produccion se deberia agregas: 

- Usar Secret Manager para variables de entorno.

- Usar VPCs privadas para Cloud SQL.

- Configurar permisos mínimos con IAM.

- Implementar HTTPS y autenticación de usuarios.

# 📌 Créditos
Este proyecto fue desarrollado como parte de una práctica de infraestructura en la nube utilizando servicios gratuitos de GCP. Es un entorno de pruebas y aprendizaje, pero representa una arquitectura realista y extensible.

# 🧭 Licencia
MIT — Para uso educativoy personal.