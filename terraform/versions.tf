terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0" # Tu versión del proveedor de Google
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0" # Una versión compatible para random_id
    }
  }
}