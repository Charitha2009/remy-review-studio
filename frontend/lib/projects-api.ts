import { apiClient } from "@/lib/api-client";
import type { Project } from "@/types/project";

export async function fetchProjects(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>("/api/v1/projects");
  return response.data;
}

export async function fetchProject(projectId: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/api/v1/projects/${projectId}`);
  return response.data;
}
