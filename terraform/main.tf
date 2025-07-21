provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_run_service" "backend" {
  name     = var.backend_name
  location = var.region

  template {
    spec {
      containers {
        image = var.image_url
        env {
          name  = "DB_HOST"
          value = var.db_host
        }
        env {
          name  = "DB_USER"
          value = var.db_user
        }
        env {
          name  = "DB_PASSWORD"
          value = var.db_password
        }
        env {
          name  = "DB_NAME"
          value = var.db_name
        }

        ports {
          container_port = 3000
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

resource "google_cloud_run_service_iam_binding" "public_access" {
  location = var.region
  service  = google_cloud_run_service.backend.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

