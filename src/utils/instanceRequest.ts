import { Capacitor, CapacitorHttp } from "@capacitor/core";

const REQUEST_TIMEOUT_MS = 8_000;

export async function requestInstance(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {},
): Promise<Response> {
  const parsed = new URL(url);
  if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error("Use an HTTP or HTTPS instance URL without embedded credentials");
  }

  if (Capacitor.getPlatform() !== "android") {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  // Use the native transport for instance APIs without relaxing WebView security.
  const { status, headers, data } = await CapacitorHttp.request({
    url,
    method: options.method,
    headers: options.headers,
    data: options.body,
    connectTimeout: REQUEST_TIMEOUT_MS,
    readTimeout: REQUEST_TIMEOUT_MS,
    disableRedirects: true,
    responseType: "text",
  });
  const body = [204, 205, 304].includes(status) || data == null
    ? null
    : typeof data === "string" ? data : JSON.stringify(data);
  return new Response(body, { status, headers });
}
