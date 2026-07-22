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

const reviewTypeOptions = [
  { value: "full", label: "Full Compliance Review" },
  { value: "specification", label: "Specification Only" },
  { value: "drawing", label: "Drawing Only" },
] as const;

const createReviewSchema = z.object({
  name: z.string().trim().min(1, "Review name is required"),
  vendor: z.string().trim().min(1, "Vendor is required"),
  specification: z.string().trim().optional(),
  drawing: z.string().trim().optional(),
  vendorSubmittal: z.string().trim().optional(),
  reviewType: z.enum(["full", "specification", "drawing"]),
});

type CreateReviewValues = z.infer<typeof createReviewSchema>;

const defaultValues: CreateReviewValues = {
  name: "",
  vendor: "",
  specification: "",
  drawing: "",
  vendorSubmittal: "",
  reviewType: "full",
};

/**
 * UI only — no persistence. A valid submit just closes the dialog; nothing is
 * stored anywhere. This is the seam where the AI pipeline later wires a
 * `useMutation` call that enqueues the review and redirects to its detail page.
 */
export function ReviewDialog({ trigger }: { trigger: ReactElement }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReviewValues>({
    resolver: zodResolver(createReviewSchema),
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
            <DialogTitle>New Review</DialogTitle>
            <DialogDescription>
              Start a review session comparing a vendor submittal against
              project specifications and drawings.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="review-name"
                className="text-sm font-medium text-foreground"
              >
                Review name
              </label>
              <Input
                id="review-name"
                placeholder="Fire Door Submittal"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="review-vendor"
                className="text-sm font-medium text-foreground"
              >
                Vendor
              </label>
              <Input
                id="review-vendor"
                placeholder="ABC Fire Systems"
                aria-invalid={!!errors.vendor}
                {...register("vendor")}
              />
              {errors.vendor ? (
                <p className="text-xs text-destructive">
                  {errors.vendor.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="review-specification"
                  className="text-sm font-medium text-foreground"
                >
                  Specification
                </label>
                <Input
                  id="review-specification"
                  placeholder="Division 08"
                  {...register("specification")}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="review-drawing"
                  className="text-sm font-medium text-foreground"
                >
                  Drawing
                </label>
                <Input
                  id="review-drawing"
                  placeholder="A201"
                  {...register("drawing")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="review-vendor-submittal"
                className="text-sm font-medium text-foreground"
              >
                Vendor submittal
              </label>
              <Input
                id="review-vendor-submittal"
                placeholder="Fire Door Hardware Submittal"
                {...register("vendorSubmittal")}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="review-type"
                className="text-sm font-medium text-foreground"
              >
                Review type
              </label>
              <select
                id="review-type"
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                {...register("reviewType")}
              >
                {reviewTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
            <Button type="submit">Create Review</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
