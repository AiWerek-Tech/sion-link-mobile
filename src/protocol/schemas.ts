import { z } from "zod";

export const roleSchema = z.enum(["presenter", "operator", "viewer", "stage"]);
export type SionLinkRole = z.infer<typeof roleSchema>;

export const commandSchema = z.enum([
  "NEXT",
  "PREV",
  "TAKE",
  "CLEAR",
  "BLACK",
  "LOGO",
  "FREEZE",
  "GOTO",
  "TIMER_START",
  "TIMER_STOP",
  "TIMER_RESET",
]);
export type SionLinkCommand = z.infer<typeof commandSchema>;

export const slideSchema = z.object({
  text: z.string().default(""),
  label: z.string().nullable().optional(),
  contentType: z.enum(["song", "bible", "reading", "custom"]).optional(),
  bibleReference: z.string().nullable().optional(),
  stageNotes: z.string().nullable().optional(),
  stageChord: z.string().nullable().optional(),
  keyNote: z.string().nullable().optional(),
  timeSignature: z.string().nullable().optional(),
  tempo: z.string().nullable().optional(),
  visualType: z.enum(["image", "video", "pdf"]).optional(),
  visualPath: z.string().optional(),
  visualDataUrl: z.string().optional(),
  visualUrl: z.string().optional(),
  pageNumber: z.number().int().optional(),
  canPresenterNavigate: z.boolean().optional(),
});

export const snapshotSchema = z.object({
  projectionState: z.string().default("CLEAR"),
  currentSlide: slideSchema.nullable().default(null),
  nextSlide: slideSchema.nullable().default(null),
  currentIndex: z.number().int().default(-1),
  nextIndex: z.number().int().nullable().default(null),
  totalSlides: z.number().int().nonnegative().optional(),
  hasNextSlide: z.boolean().default(false),
  flowPosition: z.number().int().default(-1),
  isSmartMode: z.boolean().default(false),
  timerElapsed: z.number().nonnegative().optional(),
  timerRunning: z.boolean().optional(),
  updatedAt: z.number(),
});
export type SionLinkSnapshot = z.infer<typeof snapshotSchema>;

export const exactFrameSchema = z
  .object({
    dataUrl: z.string().startsWith("data:image/").optional(),
    url: z.string().startsWith("/").optional(),
    updatedAt: z.number(),
  })
  .refine((frame) => Boolean(frame.dataUrl || frame.url), {
    message: "Frame harus memiliki dataUrl atau URL lokal.",
  });
export type ExactFrame = z.infer<typeof exactFrameSchema>;

export const discoverySchema = z.object({
  ok: z.literal(true),
  service: z.literal("sion-media"),
  name: z.string().default("SION Media"),
  version: z.string().default(""),
  port: z.coerce.number().int().min(1).max(65535),
  capabilities: z.array(z.string()).default([]),
  protocolVersion: z.number().int().positive().optional(),
  serverId: z.string().optional(),
});
export type DiscoveryResponse = z.infer<typeof discoverySchema>;

export const sessionSchema = z.object({
  ok: z.literal(true),
  role: roleSchema,
  label: z.string().default("SION Link"),
  path: z.string().startsWith("/"),
});
export type SessionResponse = z.infer<typeof sessionSchema>;

export const obsLiveSchema = z.object({
  ok: z.literal(true),
  role: roleSchema,
  available: z.boolean(),
  state: z.enum(["stopped", "starting", "waiting", "live", "error"]),
  publisherConnected: z.boolean(),
  hlsUrl: z.string().url().nullable(),
  webrtcUrl: z.string().url().nullable(),
  whepUrl: z.string().url().nullable(),
  updatedAt: z.number(),
});
export type ObsLiveResponse = z.infer<typeof obsLiveSchema>;

export const roleCommands: Record<SionLinkRole, readonly SionLinkCommand[]> = {
  presenter: ["PREV", "NEXT"],
  operator: [
    "PREV",
    "NEXT",
    "TAKE",
    "CLEAR",
    "BLACK",
    "LOGO",
    "FREEZE",
    "GOTO",
    "TIMER_START",
    "TIMER_STOP",
    "TIMER_RESET",
  ],
  viewer: [],
  stage: [],
};
