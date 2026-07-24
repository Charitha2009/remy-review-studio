"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchProjects } from "@/lib/projects-api";

export const projectsQueryKey = ["projects"] as const;

export function useProjects() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: fetchProjects,
  });
}
