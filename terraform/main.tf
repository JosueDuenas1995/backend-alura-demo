provider "google" {
  project = var.project_id
  region  = var.region
  zone = var.zone
}

resource "google_sql_database_instance" "mysql_instance" {
  name             = var.db_instance_name
  database_version = "MYSQL_8_0"
  region           = var.region

  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_sql_user" "users" {
  name     = var.db_user
  instance = google_sql_database_instance.mysql_instance.name
  password = var.db_password
}

resource "google_sql_database" "my_db" {
  name     = var.db_name
  instance = google_sql_database_instance.mysql_instance.name
}
