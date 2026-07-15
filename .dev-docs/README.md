# SION Link Mobile — Developer & AI Agent Index

Dokumentasi ini adalah sumber acuan pengembangan SION Link Mobile. Aplikasi mobile harus menjadi client native dari server SION Link milik SION Media Desktop; jangan membuat backend atau database ibadah kedua.

## Urutan baca wajib

1. `01-product-architecture.md` — tujuan produk, role, batas sistem, dan keputusan stack.
2. `02-protocol-and-security.md` — kontrak server saat ini dan evolusi protokol.
3. `03-mobile-ux.md` — alur koneksi dan perilaku setiap role.
4. `04-implementation-roadmap.md` — fase, acceptance criteria, dan urutan kerja.
5. `05-agent-guide.md` — aturan implementasi dan verifikasi.
6. `06-implementation-status.md` — hasil implementasi aktual, verifikasi, dan gap tersisa.

## Status implementasi

- Target pertama: Android MVP native.
- Stack: Expo SDK 57, React Native 0.86, TypeScript.
- Versi awal: `0.1.0-alpha.1`.
- Transport MVP: REST + SSE pada LAN.
- Sumber kebenaran: SION Media Desktop.
- PowerPoint Bridge tetap desktop-only.

## Prinsip yang tidak boleh dilanggar

- Role ditentukan server dari kode akses; client tidak memperbolehkan eskalasi role.
- Otorisasi command wajib tetap dilakukan server-side.
- Mobile tidak boleh menebak bahwa command berhasil; tampilkan acknowledgement/error.
- Connection recovery harus mempertahankan konfigurasi terakhir.
- Jangan menaruh access code pada log aplikasi atau telemetry.
- UI Viewer dan Stage harus menjaga layar tetap aktif.
- Seluruh payload eksternal harus divalidasi sebelum masuk state aplikasi.
