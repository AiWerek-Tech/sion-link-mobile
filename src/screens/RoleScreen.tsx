import { useKeepAwake } from "expo-keep-awake";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  LogOut,
  MonitorPlay,
  Pause,
  Radio,
  Send,
  Unplug,
  X,
} from "lucide-react-native";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ActionButton,
  Card,
  Eyebrow,
  Heading,
  Muted,
} from "../components/primitives";
import type {
  SionLinkCommand,
  SionLinkRole,
  SionLinkSnapshot,
} from "../protocol/schemas";
import { useConnectionStore } from "../store/connectionStore";
import { colors, radius, spacing } from "../theme/tokens";
import { BrandLogo } from "../components/BrandLogo";
import { ObsLivePlayer } from "../components/ObsLivePlayer";

function formatTimer(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  return `${String(mins).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function visualUri(
  slide: SionLinkSnapshot["currentSlide"],
  host?: string,
  port?: number,
  code?: string,
) {
  if (slide?.visualDataUrl) return slide.visualDataUrl;
  if (slide?.visualUrl && host && port && code) {
    return `http://${host}:${port}${slide.visualUrl}${slide.visualUrl.includes("?") ? "&" : "?"}code=${encodeURIComponent(code)}`;
  }
  if (
    slide?.visualType !== "image" ||
    !slide.visualPath ||
    !host ||
    !port ||
    !code
  )
    return null;
  return `http://${host}:${port}/media?code=${encodeURIComponent(code)}&path=${encodeURIComponent(slide.visualPath)}`;
}

function SlidePreview({
  slide,
  exactFrame,
}: {
  slide: SionLinkSnapshot["currentSlide"];
  exactFrame?: string | null;
}) {
  const { address, code } = useConnectionStore();
  const uri =
    exactFrame ||
    visualUri(slide, address?.host, address?.port, code || undefined);
  return (
    <View style={styles.slidePreview}>
      {uri ? (
        <Image
          source={{ uri }}
          resizeMode="contain"
          style={styles.slidePreviewImage}
        />
      ) : (
        <Text style={styles.slidePreviewText} numberOfLines={6}>
          {slide?.text || "Menunggu slide dari SION Media…"}
        </Text>
      )}
      <View style={styles.slidePreviewLabel}>
        <Text style={styles.slidePreviewLabelText}>
          {slide?.label || (slide?.visualType ? "VISUAL" : "SLIDE")}
        </Text>
      </View>
    </View>
  );
}

function Cue({
  title,
  slide,
  notes,
  accent = false,
  exactFrame,
}: {
  title: string;
  slide?: SionLinkSnapshot["currentSlide"];
  notes?: string | null;
  accent?: boolean;
  exactFrame?: string | null;
}) {
  return (
    <Card tone={accent ? "cyan" : "default"}>
      <Eyebrow>{title}</Eyebrow>
      <SlidePreview slide={slide || null} exactFrame={exactFrame} />
      {notes ? <Text style={styles.notes}>{notes}</Text> : null}
    </Card>
  );
}

function CommandGrid({
  role,
  snapshot,
}: {
  role: SionLinkRole;
  snapshot: SionLinkSnapshot | null;
}) {
  const { command, commandPending } = useConnectionStore();
  const send = (value: SionLinkCommand) => {
    void command(value).catch(() => undefined);
  };
  if (role === "viewer" || role === "stage") return null;
  return (
    <View style={styles.commandArea}>
      <View style={styles.commandRow}>
        <View style={styles.flex}>
          <ActionButton
            label="Sebelumnya"
            icon={<ArrowLeft size={18} color={colors.text} />}
            variant="secondary"
            disabled={Boolean(commandPending)}
            onPress={() => send("PREV")}
          />
        </View>
        <View style={styles.flex}>
          <ActionButton
            label="Berikutnya"
            icon={<ArrowRight size={18} color={colors.canvas} />}
            loading={commandPending === "NEXT"}
            disabled={Boolean(commandPending)}
            onPress={() => send("NEXT")}
          />
        </View>
      </View>
      {role === "operator" && (
        <>
          <ActionButton
            label="TAKE ke Program"
            icon={<Send size={18} color={colors.canvas} />}
            loading={commandPending === "TAKE"}
            disabled={Boolean(commandPending)}
            onPress={() => send("TAKE")}
          />
          <View style={styles.commandRow}>
            <View style={styles.flex}>
              <ActionButton
                label="Clear"
                icon={<X size={18} color={colors.text} />}
                variant="secondary"
                disabled={Boolean(commandPending)}
                onPress={() => send("CLEAR")}
              />
            </View>
            <View style={styles.flex}>
              <ActionButton
                label={
                  snapshot?.projectionState === "BLACK" ? "Kembalikan" : "Black"
                }
                icon={<Eye size={18} color={colors.text} />}
                variant="danger"
                disabled={Boolean(commandPending)}
                onPress={() => send("BLACK")}
              />
            </View>
          </View>
          <View style={styles.commandRow}>
            <View style={styles.flex}>
              <ActionButton
                label="Freeze"
                icon={<Pause size={18} color={colors.text} />}
                variant="secondary"
                disabled={Boolean(commandPending)}
                onPress={() => send("FREEZE")}
              />
            </View>
            <View style={styles.flex}>
              <ActionButton
                label="Logo"
                icon={<MonitorPlay size={18} color={colors.text} />}
                variant="secondary"
                disabled={Boolean(commandPending)}
                onPress={() => send("LOGO")}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

function ViewerShell({
  snapshot,
  obs,
  children,
}: {
  snapshot: SionLinkSnapshot | null;
  obs: boolean;
  children: ReactNode;
}) {
  const status = useConnectionStore((state) => state.status);
  const serverName = useConnectionStore((state) => state.serverName);
  const disconnect = useConnectionStore((state) => state.disconnect);
  const slide = snapshot?.currentSlide;
  return (
    <View style={styles.viewerPage}>
      <View style={styles.viewerToolbar}>
        <View style={styles.viewerIdentity}>
          <BrandLogo compact />
          <View style={styles.viewerIdentityText}>
            <Text style={styles.viewerTitle}>Live Viewer</Text>
            <Text style={styles.viewerServer} numberOfLines={1}>
              {serverName || "SION Media"}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Keluar dari Live Viewer"
          onPress={() => void disconnect(false)}
          style={({ pressed }) => [
            styles.viewerLogout,
            pressed && styles.viewerLogoutPressed,
          ]}
        >
          <LogOut size={17} color={colors.text} />
          <Text style={styles.viewerLogoutText}>Keluar</Text>
        </Pressable>
      </View>
      <View style={styles.viewerStatusRow}>
        <View
          style={[styles.status, status !== "connected" && styles.statusWarn]}
        >
          <Radio
            size={12}
            color={status === "connected" ? colors.green : colors.amber}
          />
          <Text style={styles.statusText}>
            {status === "connected" ? "TERHUBUNG" : "MENYAMBUNG"}
          </Text>
        </View>
        <Text style={styles.viewerState}>
          {obs
            ? "Sumber: OBS Studio"
            : `Output: ${snapshot?.projectionState || "CLEAR"}`}
        </Text>
      </View>
      {children}
      <View style={styles.viewerMeta}>
        <Text style={styles.viewerMetaLabel}>SEDANG TAYANG</Text>
        <Text style={styles.viewerMetaValue} numberOfLines={1}>
          {slide?.label || slide?.text || "Menunggu materi"}
        </Text>
      </View>
    </View>
  );
}

function Viewer({ snapshot }: { snapshot: SionLinkSnapshot | null }) {
  useKeepAwake();
  const exactFrameDataUrl = useConnectionStore(
    (state) => state.exactFrameDataUrl,
  );
  const obsLive = useConnectionStore((state) => state.obsLive);
  const address = useConnectionStore((state) => state.address);
  const code = useConnectionStore((state) => state.code);
  const slide = snapshot?.currentSlide;
  if (obsLive?.publisherConnected && obsLive.hlsUrl)
    return (
      <ViewerShell snapshot={snapshot} obs>
        <ObsLivePlayer />
      </ViewerShell>
    );
  if (exactFrameDataUrl)
    return (
      <ViewerShell snapshot={snapshot} obs={false}>
        <View style={styles.viewerCanvas}>
          <Image
            source={{ uri: exactFrameDataUrl }}
            resizeMode="contain"
            style={styles.viewerImage}
          />
        </View>
      </ViewerShell>
    );
  const slideUri = visualUri(
    slide || null,
    address?.host,
    address?.port,
    code || undefined,
  );
  if (slideUri)
    return (
      <ViewerShell snapshot={snapshot} obs={false}>
        <View style={styles.viewerCanvas}>
          <Image
            source={{ uri: slideUri }}
            resizeMode="contain"
            style={styles.viewerImage}
          />
        </View>
      </ViewerShell>
    );
  return (
    <ViewerShell snapshot={snapshot} obs={false}>
      <View style={styles.viewerCanvas}>
        <Text style={styles.viewerText}>
          {slide?.text || "Menunggu output live…"}
        </Text>
      </View>
    </ViewerShell>
  );
}

function Stage({ snapshot }: { snapshot: SionLinkSnapshot | null }) {
  useKeepAwake();
  const exactFrameDataUrl = useConnectionStore(
    (state) => state.exactFrameDataUrl,
  );
  return (
    <ScrollView contentContainerStyle={styles.stage}>
      <View style={styles.stageStatus}>
        <BrandLogo compact />
        <View style={styles.stageStatusRight}>
          <Text style={styles.state}>
            {snapshot?.projectionState || "CLEAR"}
          </Text>
          <Text style={styles.timer}>
            {formatTimer(snapshot?.timerElapsed)}
          </Text>
        </View>
      </View>
      <ObsLivePlayer />
      <Cue
        title="Sekarang"
        slide={snapshot?.currentSlide}
        exactFrame={exactFrameDataUrl}
        notes={snapshot?.currentSlide?.stageNotes}
        accent
      />
      <View style={styles.metaRow}>
        {snapshot?.currentSlide?.stageChord && (
          <Text style={styles.meta}>
            Chord {snapshot.currentSlide.stageChord}
          </Text>
        )}
        {snapshot?.currentSlide?.keyNote && (
          <Text style={styles.meta}>Key {snapshot.currentSlide.keyNote}</Text>
        )}
        {snapshot?.currentSlide?.tempo && (
          <Text style={styles.meta}>{snapshot.currentSlide.tempo} BPM</Text>
        )}
      </View>
      <Cue title="Berikutnya" slide={snapshot?.nextSlide} />
    </ScrollView>
  );
}

export function RoleScreen() {
  const {
    role,
    status,
    snapshot,
    serverName,
    error,
    disconnect,
    exactFrameDataUrl,
  } = useConnectionStore();
  if (!role) return null;
  if (role === "viewer") return <Viewer snapshot={snapshot} />;
  if (role === "stage") return <Stage snapshot={snapshot} />;
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <BrandLogo compact />
      <View style={styles.topbar}>
        <View>
          <Eyebrow>
            {role === "operator" ? "Operator Remote" : "Presenter Remote"}
          </Eyebrow>
          <Text style={styles.server}>{serverName}</Text>
        </View>
        <View
          style={[styles.status, status !== "connected" && styles.statusWarn]}
        >
          <Radio
            size={12}
            color={status === "connected" ? colors.green : colors.amber}
          />
          <Text style={styles.statusText}>
            {status === "connected" ? "SINKRON" : "RECONNECT"}
          </Text>
        </View>
      </View>
      {error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          Slide {Math.max(0, (snapshot?.currentIndex ?? -1) + 1)} /{" "}
          {snapshot?.totalSlides ?? "–"}
        </Text>
        <Text style={styles.state}>{snapshot?.projectionState || "CLEAR"}</Text>
      </View>
      <Heading>
        {role === "operator" ? "Kontrol produksi" : "Kendali pemateri"}
      </Heading>
      <ObsLivePlayer />
      <Cue
        title="Sedang tayang"
        slide={snapshot?.currentSlide}
        exactFrame={exactFrameDataUrl}
        notes={snapshot?.currentSlide?.stageNotes}
        accent
      />
      <Cue title="Slide berikutnya" slide={snapshot?.nextSlide} />
      <CommandGrid role={role} snapshot={snapshot} />
      <ActionButton
        label="Putuskan koneksi"
        icon={<Unplug size={17} color={colors.text} />}
        variant="secondary"
        onPress={() => void disconnect(false)}
      />
      <Muted>
        Koneksi tersimpan tetap tersedia untuk penggunaan berikutnya.
      </Muted>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 48 },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  server: { color: colors.text, fontSize: 16, fontWeight: "800", marginTop: 4 },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "#064E3B",
  },
  statusWarn: { backgroundColor: "#713F12" },
  statusText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  progress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: { color: colors.muted, fontWeight: "700" },
  state: { color: colors.amber, fontWeight: "900", letterSpacing: 1 },
  cueText: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 34,
    fontWeight: "800",
  },
  notes: {
    color: "#BAE6FD",
    fontSize: 16,
    lineHeight: 24,
    borderTopWidth: 1,
    borderTopColor: "#155E75",
    paddingTop: spacing.md,
  },
  commandArea: { gap: spacing.sm },
  commandRow: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1 },
  error: {
    backgroundColor: "#35121B",
    borderColor: "#7F1D2D",
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  errorText: { color: "#FDA4AF" },
  slidePreview: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
    minHeight: 148,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  slidePreviewImage: { width: "100%", height: "100%" },
  slidePreviewText: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "800",
    padding: spacing.lg,
    textAlign: "center",
  },
  slidePreviewLabel: {
    position: "absolute",
    left: spacing.sm,
    bottom: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "rgba(2,6,23,.82)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  slidePreviewLabelText: {
    color: "#BAE6FD",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  viewerPage: {
    flex: 1,
    backgroundColor: colors.canvas,
    padding: spacing.md,
    gap: spacing.md,
  },
  viewerToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    minHeight: 52,
  },
  viewerIdentity: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  viewerIdentityText: { flex: 1, minWidth: 0 },
  viewerTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  viewerServer: { color: colors.muted, fontSize: 11, marginTop: 2 },
  viewerLogout: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  viewerLogoutPressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  viewerLogoutText: { color: colors.text, fontSize: 12, fontWeight: "800" },
  viewerStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  viewerState: {
    flex: 1,
    color: colors.muted,
    fontSize: 11,
    textAlign: "right",
  },
  viewerCanvas: {
    flex: 1,
    minHeight: 220,
    backgroundColor: colors.black,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerImage: { width: "100%", height: "100%" },
  viewerText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 44,
    fontWeight: "800",
    textAlign: "center",
    padding: spacing.lg,
  },
  viewerMeta: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: "center",
  },
  viewerMetaLabel: {
    color: colors.green,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  viewerMetaValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },
  stage: {
    minHeight: "100%",
    backgroundColor: colors.black,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  stageStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageStatusRight: { alignItems: "flex-end", gap: 3 },
  timer: {
    color: colors.green,
    fontSize: 32,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  meta: {
    color: colors.amber,
    backgroundColor: "#281F06",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    fontWeight: "800",
  },
});
