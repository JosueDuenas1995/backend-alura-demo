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
  default     = "backend-alura"
  description = "Nombre del servicio Cloud Run"
}

variable "image_url" {
  type        = string
  description = "URL completa de la imagen Docker en Artifact Registry"
}

variable "db_host" {
  type        = string
  description = "Host de la base de datos MySQL"
}

variable "db_user" {
  type        = string
  description = "Usuario de la base de datos"
}

variable "db_password" {
  type        = string
  description = "Contraseña de la base de datos"
  sensitive   = true
}

variable "db_name" {
  type        = string
  description = "Nombre de la base de datos"
}