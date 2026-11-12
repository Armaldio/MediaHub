import { ref } from "vue";
import type { CustomServiceInstance } from "@/types";
import type { FormattedDetails } from "@/models/models";

export type RequestStatus = "pending" | "available" | "declined" | "unknown";

const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  available: "Available",
  declined: "Declined",
  unknown: "Request",
};

const STATUS_COLORS: Record<RequestStatus, string> = {
  pending: "#F59E0B",
  available: "#10B981",
  declined: "#EF4444",
  unknown: "#00A8E8",
};

export function useSeerr() {
  const requestStatus = ref<Record<string, RequestStatus>>({});
  const requestLoading = ref<Record<string, boolean>>({});
  const submitLoading = ref<Record<string, boolean>>({});
  let generation = 0;

  function reset() {
    generation += 1;
    requestStatus.value = {};
    requestLoading.value = {};
    submitLoading.value = {};
  }

  function statusKey(serviceId: string): string {
    return serviceId;
  }

  async function fetchStatus(
    serviceId: string,
    instance: CustomServiceInstance,
    data: FormattedDetails
  ) {
    const currentGeneration = generation;
    const key = statusKey(serviceId);
    if (requestLoading.value[key]) return;
    requestLoading.value[key] = true;
    try {
      const status = await getStatusFromApi(instance, data);
      if (generation === currentGeneration) requestStatus.value[key] = status;
    } finally {
      if (generation === currentGeneration) requestLoading.value[key] = false;
    }
  }

  async function submitRequest(
    serviceId: string,
    instance: CustomServiceInstance,
    data: FormattedDetails
  ): Promise<RequestStatus> {
    const currentGeneration = generation;
    const key = statusKey(serviceId);
    submitLoading.value[key] = true;
    try {
      const result = await postRequest(instance, data);
      if (generation === currentGeneration) requestStatus.value[key] = result;
      return result;
    } finally {
      if (generation === currentGeneration) submitLoading.value[key] = false;
    }
  }

  function getStatus(serviceId: string): RequestStatus {
    return requestStatus.value[statusKey(serviceId)] ?? "unknown";
  }

  function getStatusLabel(serviceId: string): string {
    return STATUS_LABELS[getStatus(serviceId)];
  }

  function getStatusColor(serviceId: string): string {
    return STATUS_COLORS[getStatus(serviceId)];
  }

  function isSubmitLoading(serviceId: string): boolean {
    return submitLoading.value[statusKey(serviceId)] ?? false;
  }

  function isStatusLoading(serviceId: string): boolean {
    return requestLoading.value[statusKey(serviceId)] ?? false;
  }

  return {
    reset,
    requestStatus,
    requestLoading,
    submitLoading,
    fetchStatus,
    submitRequest,
    getStatus,
    getStatusLabel,
    getStatusColor,
    isSubmitLoading,
    isStatusLoading,
    STATUS_LABELS,
    STATUS_COLORS,
  };
}

type SeerrRequest = {
  status: number;
  type: "movie" | "tv";
  seasons?: { seasonNumber: number; status: number }[];
};

type SeerrMediaInfo = {
  status?: number;
  requests?: SeerrRequest[];
  seasons?: { seasonNumber: number; status: number }[];
};

export function buildSeerrRequestPayload(data: FormattedDetails) {
  return {
    mediaType: data.type === "movie" ? "movie" : "tv",
    mediaId: Number(data.tmdbId),
    ...(data.type === "tv" && data.tvdbId ? { tvdbId: Number(data.tvdbId) } : {}),
    ...(data.type === "tv"
      ? { seasons: data.seasonNumber === undefined ? "all" as const : [data.seasonNumber] }
      : {}),
  };
}

export function hasSeerrRequest(
  requests: SeerrRequest[],
  data: FormattedDetails
): SeerrRequest | undefined {
  if (data.type === "tv" && data.seasonNumber !== undefined) {
    return requests.find((request) =>
      request.type === "tv" && request.seasons?.some(
        (season) => season.seasonNumber === data.seasonNumber
      )
    );
  }

  // The caller reads requests from this title's mediaInfo response, so only
  // the type needs to distinguish movie requests from TV requests.
  return requests.find((request) => request.type === (data.type === "movie" ? "movie" : "tv"));
}

const REQUEST_STATUS: Record<number, RequestStatus> = {
  1: "pending",
  2: "pending",
  3: "declined",
};

const MEDIA_AVAILABLE = 5;

function baseUrl(instance: CustomServiceInstance): string {
  return instance.baseUrl?.replace(/\/$/, "") || "";
}

function headers(instance: CustomServiceInstance): Record<string, string> {
  return {
    "X-Api-Key": instance.apiKey || "",
    "Content-Type": "application/json",
  };
}

async function getStatusFromApi(
  instance: CustomServiceInstance,
  data: FormattedDetails
): Promise<RequestStatus> {
  if (!instance.apiKey) return "unknown";

  try {
    const mediaType = data.type === "movie" ? "movie" : "tv";
    const res = await fetch(`${baseUrl(instance)}/api/v1/${mediaType}/${data.tmdbId}`, {
      headers: headers(instance),
    });
    if (!res.ok) return "unknown";
    const body = await res.json();
    const mediaInfo: SeerrMediaInfo | undefined = body.mediaInfo;
    if (!mediaInfo) return "unknown";
    const scopedSeason = data.type === "tv" && data.seasonNumber !== undefined
      ? mediaInfo.seasons?.find((season) => season.seasonNumber === data.seasonNumber)
      : undefined;
    if (scopedSeason?.status === MEDIA_AVAILABLE) return "available";
    if (!scopedSeason && data.seasonNumber === undefined && mediaInfo.status === MEDIA_AVAILABLE) {
      return "available";
    }

    const match = hasSeerrRequest(mediaInfo.requests ?? [], data);
    return match ? (REQUEST_STATUS[match.status] ?? "unknown") : "unknown";
  } catch {
    return "unknown";
  }
}

async function postRequest(
  instance: CustomServiceInstance,
  data: FormattedDetails
): Promise<RequestStatus> {
  if (!instance.apiKey) return "unknown";

  const payload = buildSeerrRequestPayload(data);

  try {
    const res = await fetch(`${baseUrl(instance)}/api/v1/request`, {
      method: "POST",
      headers: headers(instance),
      body: JSON.stringify(payload),
    });

    if (res.status === 201 || res.status === 200) return "pending";
    if (res.status === 409) return await getStatusFromApi(instance, data);
    return "unknown";
  } catch {
    return "unknown";
  }
}
