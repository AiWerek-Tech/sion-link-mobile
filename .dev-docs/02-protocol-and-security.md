# Protocol and Security

## Kontrak server legacy yang tersedia

```text
GET  /api/discovery
GET  /api/session?code=CODE
GET  /events?code=CODE&clientId=...&deviceName=...&trusted=...
POST /api/command?code=CODE
GET  /media?code=CODE&path=...
GET  /api/obs-live?code=CODE
```

Respons OBS live tervalidasi berisi `state`, `publisherConnected`, `hlsUrl`, `webrtcUrl`, dan `whepUrl`. URL hanya diberikan setelah kode role berhasil diautentikasi. Stream path gateway bersifat persisten, acak, dan dapat di-reset manual dari SION Media.

Default port: `41732`.

Role: `presenter | operator | viewer | stage`.

Command dikenal: `NEXT`, `PREV`, `TAKE`, `CLEAR`, `BLACK`, `LOGO`, `FREEZE`, `GOTO`, `TIMER_START`, `TIMER_STOP`, `TIMER_RESET`.

## Kontrak client MVP

1. Normalisasi host dan port.
2. Panggil discovery untuk memastikan service adalah `sion-media`.
3. Validasi session menggunakan access code.
4. Percayai `role` dan `path` dari respons server setelah schema validation.
5. Buka SSE dan validasi setiap snapshot.
6. Command hanya tersedia berdasarkan role lokal, tetapi server tetap otoritas terakhir.
7. Jika menerima HTTP 401/403, hentikan reconnect dan minta pairing ulang.

## Evolusi v1 yang diperlukan di SION Media

```text
GET  /api/v1/discovery
POST /api/v1/session
GET  /api/v1/events
POST /api/v1/commands
GET  /api/v1/media/:assetId
```

Discovery minimum:

```json
{
  "service": "sion-media",
  "protocolVersion": 1,
  "serverId": "persistent-uuid",
  "serverName": "SION Media - Gereja",
  "appVersion": "1.1.0-beta.1",
  "port": 41732,
  "capabilities": ["presenter", "operator", "viewer", "stage"]
}
```

Session v1 harus menukar kode enam digit dengan short-lived bearer token. Code tidak boleh terus berada di query URL.

Command v1 membawa `commandId`, `clientSequence`, dan opsional `expectedSnapshotVersion`; server mengembalikan acknowledgement dengan ID yang sama.

## Server discovery target

SION Media mengiklankan `_sion-link._tcp.local` melalui mDNS/Bonjour dengan TXT record `id`, `name`, `version`, dan `port`. QR dan manual address tetap tersedia. Subnet scan hanya fallback Android.

## Threat model

- Tamu pada Wi-Fi yang sama menebak kode operator.
- Access code bocor melalui URL/log/screenshot.
- Perangkat lama terhubung ke komputer lain yang memakai IP sama.
- Command ganda akibat retry jaringan.
- Snapshot/media payload terlalu besar menyebabkan memory pressure.
- Server palsu mengaku sebagai SION Media.

## Mitigasi

- Rate limiting dan role authorization server-side.
- Session token jangka pendek dan rotasi kode.
- Persistent `serverId` serta konfirmasi pairing di desktop.
- Idempotent command ID.
- Batas ukuran response/payload dan schema validation.
- Jangan log code/token.
- SecureStore untuk secret; AsyncStorage hanya untuk data non-rahasia.
- Mode service/private menonaktifkan role yang tidak diperlukan.
