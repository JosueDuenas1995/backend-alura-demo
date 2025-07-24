terraform {
  required_version = ">= 1.6.0" # o la versión de Terraform 

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0" # Proveedor para recursos de Google Cloud
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0" # Proveedor para recursos aleatorios (random_id, etc.)
    }
  }
}