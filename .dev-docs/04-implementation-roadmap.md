# Implementation Roadmap

## Phase 0 — Foundation

- [x] Expo/React Native TypeScript scaffold.
- [x] Design tokens dan reusable native primitives.
- [x] Zod protocol schemas.
- [x] Connection store dan secure persistence.
- [x] REST/SSE client boundary.
- [ ] Extract shared `@sion/link-protocol` package lintas repository.
- [ ] Contract test melawan server SION Media aktual.

Acceptance: lint, typecheck, dan unit tests lulus; tidak ada secret di log.

## Phase 1 — Android MVP

- [x] Manual connection.
- [x] QR pairing.
- [x] Saved connection dan reconnect.
- [x] Presenter screen native.
- [x] Operator screen native dasar.
- [x] Viewer screen native dasar.
- [x] Stage screen native dasar.
- [ ] Android development APK dan physical device test.
- [ ] LAN permission/cleartext verification pada Android 9+.

Acceptance: satu perangkat Android dapat terhubung, menerima snapshot, menjalankan command sesuai role, lalu pulih setelah server restart.

## Phase 2 — Production UX

- [ ] mDNS discovery.
- [ ] Server selector dan multi-server handling.
- [ ] Command acknowledgement v1.
- [ ] Adaptive preview/frame delivery.
- [x] Native LL-HLS playback untuk OBS SRT Live Input dengan audio.
- [x] Capability negotiation dan polling status OBS Live Input legacy.
- [ ] Stage presets, brightness, fit/fill.
- [ ] Diagnostics wizard.
- [ ] Trusted-device enrollment.

## Phase 3 — Backend hardening

- [ ] Persistent server identity.
- [ ] Versioned endpoints.
- [ ] Bearer session tokens.
- [ ] Idempotent command IDs.
- [ ] Capability negotiation.
- [ ] Media asset IDs menggantikan raw local path.

## Phase 4 — iOS

- [ ] Local Network usage description.
- [ ] Bonjour service declarations.
- [ ] ATS LAN policy.
- [ ] Physical iPhone/iPad testing.
- [ ] TestFlight beta.

## Phase 5 — Release quality

- [ ] Jest unit tests dan contract fixtures.
- [ ] Maestro end-to-end tests.
- [ ] Packet loss/server restart/Wi-Fi switching matrix.
- [ ] Battery, memory, large payload profiling.
- [ ] Android signing, private beta channel, privacy policy.
