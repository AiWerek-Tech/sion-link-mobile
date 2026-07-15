import EventSource from "react-native-sse";
import {
  discoverySchema,
  exactFrameSchema,
  obsLiveSchema,
  sessionSchema,
  snapshotSchema,
  type DiscoveryResponse,
  type ExactFrame,
  type ObsLiveResponse,
  type SessionResponse,
  type SionLinkCommand,
  type SionLinkSnapshot,
} from "../protocol/schemas";
import { baseUrlOf, type ServerAddress } from "./url";

const REQUEST_TIMEOUT_MS = 5_000;

export function parseSnapshotEvent(data: string): SionLinkSnapshot {
  return snapshotSchema.parse(JSON.parse(data));
}

export function parseExactFrameEvent(data: string): ExactFrame {
  return exactFrameSchema.parse(JSON.parse(data));
}

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        typeof body === "object" && body && "error" in body
          ? String(body.error)
          : `HTTP ${response.status}`;
      throw new Error(message);
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

export async function discoverServer(
  address: ServerAddress,
): Promise<DiscoveryResponse> {
  return discoverySchema.parse(
    await fetchJson(`${baseUrlOf(address)}/api/discovery`),
  );
}

export async function createSession(
  address: ServerAddress,
  code: string,
): Promise<SessionResponse> {
  return sessionSchema.parse(
    await fetchJson(
      `${baseUrlOf(address)}/api/session?code=${encodeURIComponent(code)}`,
    ),
  );
}

export async function getObsLive(
  address: ServerAddress,
  code: string,
): Promise<ObsLiveResponse | null> {
  try {
    return obsLiveSchema.parse(
      await fetchJson(
        `${baseUrlOf(address)}/api/obs-live?code=${encodeURIComponent(code)}`,
      ),
    );
  } catch {
    return null;
  }
}

export async function sendCommand(
  address: ServerAddress,
  code: string,
  command: SionLinkCommand,
): Promise<void> {
  await fetchJson(
    `${baseUrlOf(address)}/api/command?code=${encodeURIComponent(code)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    },
  );
}

export function subscribeToSnapshots(
  address: ServerAddress,
  code: string,
  clientId: string,
  onSnapshot: (snapshot: SionLinkSnapshot) => void,
  onExactFrame: (frame: ExactFrame) => void,
  onConnection: (connected: boolean, error?: string) => void,
): () => void {
  const query = new URLSearchParams({
    code,
    clientId,
    deviceName: "SION Link Mobile",
    trusted: "0",
  });
  const source = new EventSource<"snapshot" | "exact-frame">(
    `${baseUrlOf(address)}/events?${query.toString()}`,
    { timeout: 15_000 },
  );
  source.addEventListener("open", () => onConnection(true));
  source.addEventListener("snapshot", (event) => {
    if (!event.data) return;
    try {
      onSnapshot(parseSnapshotEvent(event.data));
    } catch {
      onConnection(false, "Server mengirim data yang tidak kompatibel.");
    }
  });
  source.addEventListener("exact-frame", (event) => {
    if (!event.data) return;
    try {
      onExactFrame(parseExactFrameEvent(event.data));
    } catch {
      onConnection(false, "Frame live dari server tidak kompatibel.");
    }
  });
  source.addEventListener("error", (event) =>
    onConnection(
      false,
      "message" in event ? event.message : "Koneksi real-time terputus.",
    ),
  );
  return () => source.close();
}
