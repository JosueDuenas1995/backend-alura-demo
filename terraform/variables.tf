# variables.tf
variable "project_id" {
  type        = string
  description = "ID del proyecto en Google Cloud"
}

variable "region" {
  type        = string
  default     = "us-central1"
  description = "Región de despliegue"
}

variable "backend_name" {
  type        = string
  default     = "alurabackend"
  description = "Nombre del servicio Cloud Run"
}