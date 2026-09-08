import type { CustomServiceInstance, InstanceCheckResult } from "@/types";

const REQUEST_TIMEOUT_MS = 8_000;

export function normalizeInstanceUrl(rawUrl: string, allowBareHost = false): string {
  const value = rawUrl.trim().replace(/\/+$/, "");
  if (!value) throw new Error("Base URL is required");
  if (allowBareHost && !/^https?:\/\//i.test(value)) return `http://${value}`;
  const parsed = new URL(value);
  if (!/^https?:$/.test(parsed.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported");
  // Credentials must never be sent through or rendered from an instance URL.
  parsed.username = "";
  parsed.password = "";
  return parsed.toString().replace(/\/$/, "");
}

function result(status: InstanceCheckResult["status"], message: string, httpStatus?: number): InstanceCheckResult {
  return { status, message, checkedAt: new Date().toISOString(), ...(httpStatus ? { httpStatus } : {}) };
}

export async function checkHttpInstance(
  instance: CustomServiceInstance,
  options: {
    path: string;
    headers?: Record<string, string>;
    method?: "GET" | "POST";
    body?: string;
    capabilities: string[];
    missingCredential?: string;
    allowBareHost?: boolean;
    validateResponse?: (response: Response) => boolean;
  },
): Promise<InstanceCheckResult> {
  if (options.missingCredential && !instance.apiKey) {
    return result("missing_credential", options.missingCredential);
  }

  let baseUrl: string;
  try {
    baseUrl = normalizeInstanceUrl(instance.baseUrl, options.allowBareHost);
  } catch {
    return result("unreachable", "The instance URL is invalid. Check the address and try again.");
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl}${options.path}`, {
      method: options.method ?? "GET",
      headers: options.headers,
      body: options.body,
      signal: controller.signal,
    });
    if (response.status === 401) return result("authentication_required", "Authentication is required. Check the credentials.", 401);
    if (response.status === 403) return result("unauthorized", "The credentials were rejected or lack permission.", 403);
    if (!response.ok) return result("unreachable", `The instance returned HTTP ${response.status}.`, response.status);
    if (options.validateResponse && !options.validateResponse(response)) {
      return result("unreachable", "The response was not recognized as a supported service.", response.status);
    }
    return { ...result("healthy", "Connection verified."), capabilities: options.capabilities, httpStatus: response.status };
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "The connection timed out. Check that the server is online."
      : "The instance could not be reached. Check the URL, network, and server status.";
    return result("unreachable", message);
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export function unsupportedInstanceCheck(): Promise<InstanceCheckResult> {
  return Promise.resolve({
    status: "unsupported",
    message: "This service does not provide a meaningful connection check.",
    checkedAt: new Date().toISOString(),
  });
}
