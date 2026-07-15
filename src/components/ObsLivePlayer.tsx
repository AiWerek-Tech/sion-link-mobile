import { useEvent } from "expo";
import { useVideoPlayer, VideoView, type VideoSource } from "expo-video";
import { Radio, Volume2 } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useConnectionStore } from "../store/connectionStore";
import { colors, radius, spacing } from "../theme/tokens";

export function ObsLivePlayer(): React.JSX.Element | null {
  const obsLive = useConnectionStore((state) => state.obsLive);
  const source = useMemo<VideoSource | null>(
    () =>
      obsLive?.publisherConnected && obsLive.hlsUrl
        ? { uri: obsLive.hlsUrl, contentType: "hls" }
        : null,
    [obsLive],
  );
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = false;
    instance.muted = false;
    instance.play();
  });
  const statusEvent = useEvent(player, "statusChange");
  const status = statusEvent?.status ?? player.status;
  const error = statusEvent?.error;

  if (!source) return null;
  return (
    <View style={styles.root}>
      <View style={styles.statusBar}>
        <View style={styles.liveBadge}>
          <Radio size={13} color={colors.green} />
          <Text style={styles.liveText}>OBS LIVE</Text>
        </View>
        <View style={styles.audioStatus}>
          <Volume2 size={13} color={colors.muted} />
          <Text style={styles.audioText}>Audio aktif</Text>
        </View>
      </View>
      <View style={styles.videoFrame}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls
          playsInline
          surfaceType="textureView"
        />
      </View>
      {status === "loading" && (
        <View style={styles.message}>
          <Text style={styles.messageText}>Menyiapkan video dan audio…</Text>
        </View>
      )}
      {status === "error" && (
        <View style={styles.message}>
          <Text style={styles.errorText}>
            {error?.message || "Stream tidak dapat diputar. Mencoba kembali…"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    gap: spacing.sm,
  },
  videoFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: colors.black,
    overflow: "hidden",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  video: { width: "100%", height: "100%" },
  statusBar: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#063D32",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  liveText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 0.8,
  },
  audioStatus: { flexDirection: "row", alignItems: "center", gap: 5 },
  audioText: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  message: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  messageText: { color: colors.text, textAlign: "center", fontWeight: "700" },
  errorText: { color: "#FDA4AF", textAlign: "center", fontWeight: "700" },
});
