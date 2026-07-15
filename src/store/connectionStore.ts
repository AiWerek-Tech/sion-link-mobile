import { create } from "zustand";
import {
  roleCommands,
  type ObsLiveResponse,
  type SionLinkCommand,
  type SionLinkRole,
  type SionLinkSnapshot,
} from "../protocol/schemas";
import {
  clearPairing,
  loadPairing,
  savePairing,
  type SavedPairing,
} from "../services/persistence";
import {
  createSession,
  discoverServer,
  getObsLive,
  sendCommand,
  subscribeToSnapshots,
} from "../services/sionLinkClient";
import { baseUrlOf, type ServerAddress } from "../services/url";

type ConnectionStatus =
  "idle" | "connecting" | "connected" | "reconnecting" | "error";

interface ConnectionState {
  status: ConnectionStatus;
  address: ServerAddress | null;
  code: string | null;
  role: SionLinkRole | null;
  serverName: string | null;
  serverVersion: string | null;
  snapshot: SionLinkSnapshot | null;
  exactFrameDataUrl: string | null;
  exactFrameUpdatedAt: number | null;
  obsLive: ObsLiveResponse | null;
  error: string | null;
  commandPending: SionLinkCommand | null;
  hydrate: () => Promise<SavedPairing | null>;
  connect: (
    address: ServerAddress,
    code: string,
    remember?: boolean,
  ) => Promise<void>;
  disconnect: (forget?: boolean) => Promise<void>;
  command: (command: SionLinkCommand) => Promise<void>;
}

let unsubscribeStream: (() => void) | null = null;
let obsLiveTimer: ReturnType<typeof setInterval> | null = null;
const clientId = `mobile-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  status: "idle",
  address: null,
  code: null,
  role: null,
  serverName: null,
  serverVersion: null,
  snapshot: null,
  exactFrameDataUrl: null,
  exactFrameUpdatedAt: null,
  obsLive: null,
  error: null,
  commandPending: null,

  hydrate: async () => {
    const saved = await loadPairing();
    if (!saved) return null;
    set({
      address: { host: saved.host, port: saved.port },
      code: saved.code,
      serverName: saved.serverName || null,
    });
    return saved;
  },

  connect: async (address, codeInput, remember = true) => {
    const code = codeInput.trim().toUpperCase();
    if (!/^[A-F0-9]{6}$/.test(code))
      throw new Error("Kode akses harus enam karakter heksadesimal.");
    unsubscribeStream?.();
    unsubscribeStream = null;
    if (obsLiveTimer) clearInterval(obsLiveTimer);
    obsLiveTimer = null;
    set({
      status: "connecting",
      address,
      code,
      error: null,
      snapshot: null,
      exactFrameDataUrl: null,
      exactFrameUpdatedAt: null,
      obsLive: null,
    });
    try {
      const [discovery, session] = await Promise.all([
        discoverServer(address),
        createSession(address, code),
      ]);
      if (remember)
        await savePairing({
          ...address,
          code,
          serverName: discovery.name,
          role: session.role,
        });
      set({
        status: "connected",
        role: session.role,
        serverName: discovery.name,
        serverVersion: discovery.version,
        error: null,
      });
      unsubscribeStream = subscribeToSnapshots(
        address,
        code,
        clientId,
        (snapshot) => set({ snapshot, status: "connected", error: null }),
        (frame) => {
          const frameUrl =
            frame.dataUrl ||
            (frame.url
              ? `${baseUrlOf(address)}${frame.url}${frame.url.includes("?") ? "&" : "?"}code=${encodeURIComponent(code)}`
              : null);
          if (!frameUrl) return;
          set({
            exactFrameDataUrl: frameUrl,
            exactFrameUpdatedAt: frame.updatedAt,
            status: "connected",
            error: null,
          });
        },
        (connected, error) =>
          set({
            status: connected ? "connected" : "reconnecting",
            error: connected ? null : error || null,
          }),
      );
      const refreshObsLive = async () => {
        const next = await getObsLive(address, code);
        if (next) set({ obsLive: next });
      };
      await refreshObsLive();
      obsLiveTimer = setInterval(() => void refreshObsLive(), 750);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal terhubung ke SION Media.";
      set({ status: "error", error: message, role: null });
      throw error;
    }
  },

  disconnect: async (forget = false) => {
    unsubscribeStream?.();
    unsubscribeStream = null;
    if (obsLiveTimer) clearInterval(obsLiveTimer);
    obsLiveTimer = null;
    if (forget) await clearPairing();
    set({
      status: "idle",
      role: null,
      snapshot: null,
      exactFrameDataUrl: null,
      exactFrameUpdatedAt: null,
      obsLive: null,
      error: null,
      ...(forget ? { address: null, code: null, serverName: null } : {}),
    });
  },

  command: async (command) => {
    const { address, code, role } = get();
    if (!address || !code || !role) throw new Error("Belum terhubung.");
    if (!roleCommands[role].includes(command))
      throw new Error("Command tidak diizinkan untuk role ini.");
    set({ commandPending: command, error: null });
    try {
      await sendCommand(address, code, command);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Command gagal.";
      set({ error: message });
      throw error;
    } finally {
      set({ commandPending: null });
    }
  },
}));
