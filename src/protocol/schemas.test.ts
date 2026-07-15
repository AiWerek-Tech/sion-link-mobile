import {
  discoverySchema,
  exactFrameSchema,
  obsLiveSchema,
  snapshotSchema,
} from "./schemas";

describe("SION Link wire schemas", () => {
  it("accepts a legacy discovery response", () => {
    expect(
      discoverySchema.parse({
        ok: true,
        service: "sion-media",
        name: "Operator",
        version: "1.1.0",
        port: 41732,
        capabilities: [],
      }).port,
    ).toBe(41732);
  });

  it("rejects an unrelated service", () => {
    expect(() =>
      discoverySchema.parse({ ok: true, service: "other", port: 41732 }),
    ).toThrow();
  });

  it("normalizes a minimal snapshot", () => {
    const parsed = snapshotSchema.parse({ updatedAt: 1 });
    expect(parsed.projectionState).toBe("CLEAR");
    expect(parsed.currentSlide).toBeNull();
  });

  it("accepts the exact live frame event used by viewer role", () => {
    expect(
      exactFrameSchema.parse({
        dataUrl: "data:image/jpeg;base64,AA==",
        updatedAt: 2,
      }).updatedAt,
    ).toBe(2);
    expect(
      exactFrameSchema.parse({ url: "/api/exact-frame?v=2", updatedAt: 2 }).url,
    ).toContain("/api/exact-frame");
  });

  it("rejects non-image exact frame payloads", () => {
    expect(() =>
      exactFrameSchema.parse({
        dataUrl: "https://example.com/frame.jpg",
        updatedAt: 2,
      }),
    ).toThrow();
    expect(() => exactFrameSchema.parse({ updatedAt: 2 })).toThrow();
  });

  it("accepts authenticated OBS live HLS and WebRTC endpoints", () => {
    const live = obsLiveSchema.parse({
      ok: true,
      role: "viewer",
      available: true,
      state: "live",
      publisherConnected: true,
      hlsUrl: "http://192.168.1.60:8888/sion-test/index.m3u8",
      webrtcUrl: "http://192.168.1.60:8889/sion-test",
      whepUrl: "http://192.168.1.60:8889/sion-test/whep",
      updatedAt: 3,
    });
    expect(live.publisherConnected).toBe(true);
    expect(live.hlsUrl).toContain(".m3u8");
  });
});
