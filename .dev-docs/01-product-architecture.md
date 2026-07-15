# Product and System Architecture

## Tujuan

SION Link Mobile adalah companion native Android/iOS untuk menghubungkan pemateri, operator tambahan, live viewer, dan perangkat panggung dengan SION Media Desktop pada jaringan lokal.

## Keputusan arsitektur

```text
SION Media Desktop (authoritative server)
  ├─ discovery/session API
  ├─ SSE snapshot stream
  ├─ command authorization
  └─ protected media endpoint
          │ LAN
          ▼
SION Link Mobile
  ├─ connection and pairing
  ├─ native role UI
  ├─ reconnect/heartbeat
  └─ secure local preferences
```

## OBS Live Input

OBS mengirim satu stream H.264/AAC melalui SRT ke media gateway yang dikelola SION Media. Gateway melakukan fan-out sebagai Low-Latency HLS untuk player native Mobile dan halaman Desktop, serta menyediakan WebRTC/WHEP untuk client yang kompatibel. Mobile tidak menerima SRT mentah dan tidak menjalankan media server sendiri.

```text
OBS --SRT--> SION Media / MediaMTX --LL-HLS--> SION Link Mobile
                                  +--WebRTC--> SION Link Desktop/advanced client
```

Mobile tidak menyimpan library lagu, rundown, Bible Pack, atau state proyeksi sebagai sumber kebenaran. Snapshot lokal hanya cache tampilan dan harus diganti oleh snapshot server terbaru.

## Role

| Role | Hak akses | Tampilan utama |
|---|---|---|
| Presenter | `NEXT`, `PREV` | Current, next, notes, timer |
| Operator | Kontrol produksi sesuai policy server | Preview/program, rundown, command produksi |
| Viewer | Read-only | Program output fullscreen |
| Stage | Read-only | Current/next cue, notes, chord, timer, status |

Kode akses menentukan role. Mobile tidak menyediakan pemilih role pada proses login.

## Stack

- Expo SDK 57 Development Build.
- React Native 0.86 dan TypeScript strict.
- Zustand untuk connection/session/snapshot state.
- Zod untuk boundary validation.
- Expo SecureStore untuk access code dan server identity.
- Expo Camera untuk QR pairing.
- Expo KeepAwake untuk viewer/stage.
- REST + SSE untuk kompatibilitas server yang ada.

Expo Go hanya boleh dipakai untuk eksperimen UI yang tidak membutuhkan konfigurasi native. Pengembangan dan QA utama menggunakan development build.

## Batas platform

- Android adalah target MVP pertama dan dapat dibangun dari Windows.
- Build dan pengujian iOS final memerlukan macOS/Xcode atau EAS Build.
- PowerPoint Bridge tidak tersedia di mobile karena bergantung pada Windows COM, PowerShell, dan PowerPoint Desktop.
- HTTP LAN membutuhkan Android Network Security Configuration dan pengecualian ATS terbatas di iOS.

## Target kualitas

- Cold connect pada server tersimpan: <= 3 detik pada LAN sehat.
- Recovery setelah SSE terputus: percobaan pertama <= 1 detik, exponential backoff maksimum 15 detik.
- Command acknowledgement: tampil maksimal 2 detik; setelah itu status timeout.
- Tidak crash ketika jaringan berpindah, server restart, snapshot invalid, atau permission ditolak.
- Touch target minimum 44/48 logical pixels.
