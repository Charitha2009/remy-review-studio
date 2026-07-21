"use client";

import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  projectNumber: z.string().trim().optional(),
  client: z.string().trim().optional(),
  location: z.string().trim().optional(),
  buildingType: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

type CreateProjectValues = z.infer<typeof createProjectSchema>;

const defaultValues: CreateProjectValues = {
  name: "",
  projectNumber: "",
  client: "",
  location: "",
  buildingType: "",
  description: "",
};

/**
 * UI only — no persistence. A valid submit just closes the dialog; nothing is
 * stored anywhere. This is the seam where Sprint 2 wires a `useMutation` call
 * and redirects to the new project's workspace.
 */
export function CreateProjectDialog({ trigger }: { trigger: ReactElement }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset(defaultValues);
    }
  }

  function onSubmit() {
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Set up a workspace for a construction project&apos;s
              specifications, drawings, and vendor submittals.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="project-name"
                className="text-sm font-medium text-foreground"
              >
                Project name
              </label>
              <Input
                id="project-name"
                placeholder="Hospital Expansion"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="project-number"
                  className="text-sm font-medium text-foreground"
                >
                  Project number
                </label>
                <Input
                  id="project-number"
                  placeholder="24-0142"
                  {...register("projectNumber")}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="project-building-type"
                  className="text-sm font-medium text-foreground"
                >
                  Building type
                </label>
                <Input
                  id="project-building-type"
                  placeholder="Hospital"
                  {...register("buildingType")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="project-client"
                  className="text-sm font-medium text-foreground"
                >
                  Client
                </label>
                <Input
                  id="project-client"
                  placeholder="City Health System"
                  {...register("client")}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="project-location"
                  className="text-sm font-medium text-foreground"
                >
                  Location
                </label>
                <Input
                  id="project-location"
                  placeholder="Austin, TX"
                  {...register("location")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="project-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="project-description"
                rows={3}
                placeholder="Brief scope summary…"
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                {...register("description")}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
