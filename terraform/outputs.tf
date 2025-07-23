# outputs.tf
output "backend_url" {
  description = "The URL of the deployed backend service"
  value       = google_cloud_run_v2_service.backend_service.uri
}