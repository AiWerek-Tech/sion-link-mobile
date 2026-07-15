# AI Agent and Developer Guide

## Before editing

1. Baca seluruh dokumen `.dev-docs`.
2. Periksa kontrak aktual `sion-media-desktop/src/main/presenter-remote-server.ts`.
3. Jangan mengubah backend berdasarkan asumsi mobile; tulis contract test atau migration note.
4. Pertahankan kompatibilitas legacy sampai endpoint v1 tersedia.

## Source boundaries

- `src/protocol`: schema dan type dari wire format.
- `src/services`: network, SSE, discovery, persistence.
- `src/store`: lifecycle dan state orchestration.
- `src/screens`: composition per screen/role.
- `src/components`: reusable presentational primitives.
- `src/theme`: tokens; hindari magic colors tersebar.

## Coding rules

- TypeScript strict; hindari `any`.
- Parse semua network response dengan Zod.
- Network timeout wajib eksplisit.
- Abort request ketika screen/unmount atau connection diganti.
- Jangan simpan code/token di AsyncStorage atau console.
- Jangan menambahkan command client yang belum diizinkan server.
- Jangan memakai WebView untuk role utama.
- Gunakan pure functions untuk parser, URL normalization, dan backoff agar mudah diuji.

## Required checks

```powershell
npm run typecheck
npm run lint
npm test
npx expo export --platform android
```

## Definition of done

- Happy path dan error path tersedia.
- Loading/empty/offline/reconnecting state memiliki UI.
- Permission denial dapat dipulihkan.
- Tidak ada crash pada malformed payload.
- Dokumentasi roadmap dan status diperbarui.

