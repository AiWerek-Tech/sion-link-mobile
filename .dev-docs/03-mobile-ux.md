# Mobile UX Specification

## First run

```text
Welcome
  → Cari SION Media
  → Scan QR
  → Alamat manual (fallback)
  → Validasi server
  → Validasi kode
  → Server menentukan role
  → Native role screen
```

Permission Local Network dan Camera diminta secara kontekstual ketika pengguna menjalankan fitur terkait, bukan saat splash screen.

## Connection screen

- Primary CTA: `Cari SION Media`.
- Secondary CTA: `Scan QR`.
- Manual form berada dalam advanced/fallback section.
- Server card menampilkan nama, alamat, versi, dan indikator kompatibilitas.
- Kode ditampilkan seperti PIN dan dapat di-paste.
- Error harus actionable: beda Wi-Fi, firewall, server nonaktif, izin ditolak, kode invalid, atau versi protokol tidak cocok.

## Runtime shell

- Header: role, server name/address, state indicator.
- Status: `Menghubungkan`, `Sinkron`, `Menghubungkan ulang`, `Offline`, `Akses dicabut`.
- Tombol disconnect tidak menghapus pairing kecuali pengguna memilih `Lupakan perangkat`.
- App state foreground memicu health check dan membuka ulang SSE bila perlu.

## Presenter

- Current cue dominan; next cue sekunder.
- Notes terpisah dan dapat diperbesar.
- Prev/Next selalu berada pada area jangkauan ibu jari.
- Haptic ringan saat acknowledgement berhasil.
- Disable/debounce command saat request aktif.

## Operator

- Program dan preview jelas berbeda.
- `TAKE` menjadi primary action.
- `BLACK`, `CLEAR`, dan `LOGO` memerlukan visual severity yang jelas.
- Command destruktif tidak boleh berdekatan tanpa ruang pemisah.
- Tampilkan rejection/timeout, bukan optimistic success permanen.

## Viewer

- Fullscreen dan landscape-friendly.
- Mode Fit, Fill, dan Safe Area.
- Keep screen awake.
- Tap membuka overlay status; overlay hilang otomatis.
- Tidak ada command.

## Stage

- Current, next, notes, chord/key, tempo, time signature, dan timer.
- Preset: Presenter, Singer, Musician, Minimal.
- Status LIVE/FREEZE/BLACK selalu terlihat.
- Landscape default untuk tablet/IFP, tetapi tetap usable di portrait phone.

## Accessibility

- Tidak menggunakan warna sebagai satu-satunya status.
- Dynamic text sampai setidaknya 130% tanpa memotong command penting.
- Kontras minimum WCAG AA.
- Screen reader label pada semua icon button.
- Reduced motion dihormati.

