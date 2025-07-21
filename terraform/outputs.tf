output "backend_url" {
  description = "URL pública del backend desplegado en Cloud Run"
  value       = google_cloud_run_service.backend.status[0].url
}