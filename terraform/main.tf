# main.tf

provider "google" {
  project = var.project_id
  region  = "us-central1"
}

# --- Nueva Cuenta de Servicio para Cloud Run ---
resource "google_service_account" "cloudrun_service_account" {
  account_id   = "alurabackend-run-sa"
  display_name = "Service Account for Alura Backend Cloud Run Service"
  project      = var.project_id
}

# Otorga el rol de Cliente de Cloud SQL a la nueva cuenta de servicio de Cloud Run
resource "google_project_iam_member" "cloudrun_sql_client_binding" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloudrun_service_account.email}"
}

# Define un recurso random_id para generar un sufijo único para Cloud SQL
resource "random_id" "sql_instance_suffix" {
  byte_length = 8
}

# --- Cloud SQL (Instancia de Base de Datos MySQL) ---
resource "google_sql_database_instance" "mysql_instance" {
  database_version = "MYSQL_5_7"
  name             = "aluradatabase-${random_id.sql_instance_suffix.hex}"
  region           = var.region
  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = true
    }
  }
}

# Base de datos específica dentro de la instancia de Cloud SQL
resource "google_sql_database" "database" {
  name     = "barberia_alura"
  instance = google_sql_database_instance.mysql_instance.name
  charset  = "UTF8MB4"
}

# Usuario root para la base de datos de Cloud SQL
resource "google_sql_user" "root_user" {
  name     = "root"
  instance = google_sql_database_instance.mysql_instance.name
  host     = "%"
  password = "amorbest*95" # ¡REEMPLAZA ESTO con una contraseña FUERTE y ÚNICA para GCP!
}

# --- Habilitación de APIs de Google Cloud ---
# Habilita la API de Cloud Run
resource "google_project_service" "run_api" {
  project = var.project_id
  service = "run.googleapis.com"
  disable_on_destroy = false
}

# Habilita la API de Cloud Build (para construir la imagen Docker)
resource "google_project_service" "cloudbuild_api" {
  project = var.project_id
  service = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

# Habilita la API de Artifact Registry (para almacenar la imagen Docker)
resource "google_project_service" "artifactregistry_api" {
  project = var.project_id
  service = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

# Habilita la API de Cloud SQL Admin (requerida por Cloud SQL)
resource "google_project_service" "sqladmin_api" {
  project = var.project_id
  service = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

# --- Nuevo recurso: Artifact Registry Repository (para almacenar imágenes Docker) ---
# Este recurso es necesario si no has creado el repositorio 'cloud-run-source-deploy' manualmente.
# Si ya existe, Terraform simplemente lo detectará.
resource "google_artifact_registry_repository" "my_repo" {
  location      = var.region
  repository_id = "cloud-run-source-deploy" # Debe coincidir con el path de tu imagen
  description   = "Docker repository for Cloud Run source deployments"
  format        = "DOCKER"
}


# --- Cloud Run Service (Despliegue del Backend) ---
# Obtiene el nombre de conexión de la instancia de Cloud SQL para el proxy
data "google_sql_database_instance" "instance_info" {
  name = google_sql_database_instance.mysql_instance.name
}

# Define el servicio de Cloud Run para tu backend
resource "google_cloud_run_v2_service" "backend_service" {
  name     = var.backend_name
  location = var.region

  template {
    containers {
      # IMAGEN INICIAL: Aquí volvemos a poner la imagen.
      # Cloud Run la necesita para la creación inicial. El Cloud Build Trigger la actualizará.
      image = "gcr.io/cloudrun/hello" # Or any other simple public image like "hello-world"
      #image = "us-central1-docker.pkg.dev/${var.project_id}/cloud-run-source-deploy/alurabackend:latest"

      ports {
        container_port = 3000
      }

      env {
        name  = "DB_HOST"
        value = "/cloudsql/${data.google_sql_database_instance.instance_info.connection_name}"
      }
      env {
        name  = "DB_USER"
        value = google_sql_user.root_user.name
      }
      env {
        name  = "DB_PASSWORD"
        value = google_sql_user.root_user.password
      }
      env {
        name  = "DB_NAME"
        value = google_sql_database.database.name
      }
    }

    scaling {
      max_instance_count = 1
    }
    service_account = google_service_account.cloudrun_service_account.email
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Permite que el servicio de Cloud Run sea invocado públicamente (no autenticado)
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.backend_service.location
  project  = google_cloud_run_v2_service.backend_service.project
  service  = google_cloud_run_v2_service.backend_service.name
  role     = "roles/run.invoker"
  member   = "allUsers" # ¡CUIDADO! Esto lo hace accesible a cualquiera en Internet.
}

# --- Permisos adicionales para la Cuenta de Servicio de Cloud Build ---
# Estos permisos son cruciales para que Cloud Build pueda subir imágenes y desplegar a Cloud Run
resource "google_project_iam_member" "cb_ar_writer_binding" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:254211792049-compute@developer.gserviceaccount.com"
}

resource "google_project_iam_member" "cb_run_admin_binding" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:254211792049-compute@developer.gserviceaccount.com"
}

resource "google_service_account_iam_member" "cb_sa_user_binding" {
  service_account_id = google_service_account.cloudrun_service_account.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:254211792049-compute@developer.gserviceaccount.com"
}

resource "google_project_iam_member" "cb_editor_binding" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.editor"
  member  = "serviceAccount:254211792049-compute@developer.gserviceaccount.com"
}