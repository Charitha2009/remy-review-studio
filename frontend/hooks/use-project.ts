"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { fetchProject } from "@/lib/projects-api";

export function projectQueryKey(projectId: string) {
  return ["projects", projectId] as const;
}

/** `projectId` may be absent for a beat during route transitions or if the route param is malformed — the query simply stays disabled rather than requesting `/projects/undefined`. */
export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: projectQueryKey(projectId ?? ""),
    queryFn: () => fetchProject(projectId as string),
    enabled: Boolean(projectId),
    // A 404 is deterministic (the project doesn't exist) — retrying it a few times with
    // backoff just delays the not-found UI. Other failures still get a couple of retries.
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}
