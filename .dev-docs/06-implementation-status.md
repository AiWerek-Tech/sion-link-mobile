# Implementation Status — 2026-07-13

## Implemented in `0.1.0-alpha.1`

- Expo SDK 57 / React Native 0.86 TypeScript scaffold.
- Android/iOS application identifiers and LAN/camera platform declarations.
- Central design tokens and reusable Card/Button typography primitives.
- Zod schemas for discovery, session, snapshot, slide, role, and command.
- URL normalization and SION Link QR parser.
- Secure pairing persistence through Expo SecureStore.
- REST client with explicit timeout and validated responses.
- SSE snapshot subscription with connection/reconnecting state.
- Zustand connection lifecycle and server-side-compatible command gating.
- Native connection screen with saved server, manual entry, QR scanner, actionable errors, and loading state.
- Native Presenter and Operator screens.
- Native Live Viewer and Stage Display with keep-awake.
- Protocol and URL unit tests.
- Successful Android production JavaScript export.
- Standalone Android testing APK berhasil dibangun untuk `arm64-v8a` dan `armeabi-v7a`.
- Release manifest mengizinkan HTTP LAN untuk koneksi ke SION Media pada Android 9+.
- Branding resmi SION Media diterapkan pada launcher, adaptive icon, native splash, animated splash, onboarding, dan header aplikasi.
- First-install onboarding tiga langkah dengan penyimpanan status aman.
- Connection UX dipisahkan menjadi Scan QR dan Input Manual sebagai dua metode yang berbeda.
- In-app connection help, QR scanner overlay, saved-server reconnect card, dan permission fallback.
- UI role memakai visual hierarchy, status connection, icon command, dan touch target mobile-native.
- Fixed: mobile kini mendengarkan named SSE events `snapshot` dan `exact-frame` sesuai kontrak server aktual.
- Fixed: Live Viewer merender exact Program Output frame, sementara Presenter/Operator/Stage menerima snapshot slide real-time.
- Fixed: legacy launcher icon dan adaptive foreground memakai Android safe-zone agar logo tidak terpotong oleh mask perangkat.
- OBS SRT Live Input dari SION Media diputar melalui `expo-video` sebagai LL-HLS native dengan video H.264 dan audio AAC.
- Viewer otomatis memprioritaskan OBS Live ketika publisher aktif; Presenter, Operator, dan Stage menampilkan panel OBS tanpa kehilangan kontrol/cue.
- Status gateway dipoll melalui endpoint terautentikasi `/api/obs-live` dan pulih otomatis ketika OBS reconnect.

## Verification

```text
npm run typecheck     PASS
npm run lint          PASS
npm test              PASS (6 tests)
npx expo install --check  PASS
npm run export:android    PASS
Gradle assembleRelease   PASS
APK signature v2 verify  PASS
Official launcher asset  PASS
```

## Known gaps before physical-device MVP

1. Server belum mengiklankan mDNS `_sion-link._tcp`, sehingga app baru menyediakan QR dan manual pairing.
2. Legacy API memakai access code dalam query URL; session token v1 belum tersedia.
3. Legacy command API belum memberikan acknowledgement ber-ID.
4. Exact-output payload perlu diuji dan dioptimalkan pada HP low-end.
5. APK sudah dibangun, tetapi instalasi dan functional test pada perangkat fisik masih perlu dilakukan user.
6. iOS memerlukan macOS/Xcode atau EAS Build untuk validasi final.
7. Reconnect policy saat ini mengandalkan reconnect milik SSE library; connection supervisor dengan network/app-state awareness masih perlu ditambahkan.
8. Viewer/Stage belum memiliki orientation preset, fit/fill selector, brightness, dan diagnostic overlay.

## Dependency audit note

`npm audit` melaporkan 10 moderate findings pada dependency transitive tooling Expo (`@expo/cli`, config plugins, `xcode`, dan `uuid`). Tidak ada high/critical finding. Saran otomatis npm meminta downgrade besar ke Expo 46 dan tidak aman diterapkan. Pertahankan Expo 57 serta pantau patch resmi.

## Next implementation order

1. Jalankan app pada Android fisik terhadap server SION Media nyata.
2. Tambahkan contract fixtures dari snapshot aktual.
3. Implementasikan app-state/network-aware reconnect supervisor.
4. Tambahkan server identity dan mDNS pada SION Media.
5. Implementasikan discovery UI dan diagnostics wizard.
6. Tambahkan session token serta command acknowledgement v1.
