// Shared lookup helper for *arr services. Each service file below calls
// lookupArrItem() with its own endpoints.
import { CustomServiceInstance } from "../../types/index";

const SLUG_FALLBACK = "unknown";

function baseUrl(instance: CustomServiceInstance): string {
  return instance.baseUrl?.replace(/\/$/, "") || "";
}

export function arrHeaders(instance: CustomServiceInstance): Record<string, string> {
  return {
    "X-Api-Key": instance.apiKey || "",
    "Content-Type": "application/json",
  };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || SLUG_FALLBACK
  );
}

export function arrItemUrl(
  instance: CustomServiceInstance,
  kind: "series" | "movie",
  item: { id: number; title: string; titleSlug?: string }
): string {
  const slug = item.titleSlug || slugify(item.title);
  return `${baseUrl(instance)}/${kind}/${slug}`;
}

export function arrSearchUrl(
  instance: CustomServiceInstance,
  term: string
): string {
  return `${baseUrl(instance)}/add/search?term=${encodeURIComponent(term)}`;
}
