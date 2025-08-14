resource "google_compute_instance" "backend_instance" {
  name         = "backend-instance"
  machine_type = "e2-micro"
  zone         = var.zone

  tags = ["http-server"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  service_account {
    scopes = ["cloud-platform"]
  }

  metadata_startup_script = <<-EOT
  #!/bin/bash
  apt-get update
  apt-get install -y docker.io curl gnupg ca-certificates lsb-release

  # Iniciar Docker
  systemctl start docker
  systemctl enable docker

  # Instalar Google Cloud CLI
  echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
  curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
  apt-get update && apt-get install -y google-cloud-sdk

  # Autenticar Docker con Artifact Registry
  gcloud auth configure-docker us-central1-docker.pkg.dev --quiet

  # Descargar e iniciar el contenedor (puerto 80 -> 3000)
  docker run -d -p 80:3000 us-central1-docker.pkg.dev/dark-throne-464103-h1/alura/backend-nodejs:latest
EOT
}

resource "google_compute_firewall" "default_allow_http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  direction     = "INGRESS"
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

