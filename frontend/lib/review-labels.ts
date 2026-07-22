import type { ReviewType } from "@/types/review";

export const reviewTypeLabels: Record<ReviewType, string> = {
  full: "Full Compliance Review",
  specification: "Specification Only",
  drawing: "Drawing Only",
};
