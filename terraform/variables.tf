variable "project_id" {
  description = "ID del proyecto de GCP"
  type        = string
}

variable "region" {
  description = "Región para desplegar los recursos"
  type        = string
}

variable "db_instance_name" {
  description = "Nombre de la instancia de Cloud SQL"
  type        = string
}

variable "db_user" {
  description = "Usuario para la base de datos"
  type        = string
}

variable "db_password" {
  description = "Contraseña para la base de datos"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nombre de la base de datos"
  type        = string
}
