# SION Link Mobile 📱⚡

[![Version](https://img.shields.io/badge/version-0.1.0--alpha.1-orange.svg)](#)
[![Platform](https://img.shields.io/badge/platform-android-green.svg)](#)
[![Framework](https://img.shields.io/badge/built%20with-React%20Native%20%7C%20Expo-brightgreen.svg)](#)

**SION Link Mobile** adalah aplikasi Android native resmi (*companion mobile*) untuk ekosistem **SION Media**. Aplikasi ini dibangun menggunakan **React Native** dan **Expo** untuk mempermudah pemateri, operator, pemusik, dan jemaat dalam menghubungkan perangkat seluler mereka ke server lokal SION Media secara nirkabel.

---

## ✨ Fitur Utama

- **📷 QR Code Pairing**: Menghubungkan perangkat ke server lokal SION Media secara instan dengan memindai kode QR peran (*role*) langsung dari layar monitor utama.
- **🖥️ Multi-Role Native Layouts**:
  - **🎛️ Operator**: Akses kontrol penuh untuk mengganti slide dan media langsung dari genggaman.
  - **🧑‍🏫 Pemateri**: Tampilan minimalis berukuran besar khusus untuk menggeser slide presentasi/khotbah secara mandiri.
  - **⏱️ Stage Display**: Menampilkan *Speaker Notes*, chord lagu, waktu/timer, serta *cue* slide berikutnya. Dilengkapi dengan fitur layar *keep-awake* agar layar tidak redup/mati saat digunakan.
  - **🎬 Live Viewer**: Menyajikan tampilan bersih (*clean output*) lirik dan media untuk proyektor sekunder.
- **🎥 OBS Live Stream Integration**: Pemutar video bawaan berbasis `expo-video` untuk menerima siaran video H.264 dan audio AAC dari live OBS menggunakan jalur LL-HLS berlatensi rendah. Aplikasi akan mendeteksi status siaran OBS dan kembali ke mode Program biasa ketika siaran berakhir.
- **🛡️ Secure Store & Auto Recovery**: Menggunakan enkripsi `expo-secure-store` untuk menyimpan kredensial pairing secara aman di perangkat, dilengkapi fitur pemulihan koneksi instan saat sinyal Wi-Fi terganggu.

---

## 🛠️ Persyaratan Sistem

- **Perangkat**: Android 7.0 (API Level 24) ke atas.
- **Jaringan**: Wi-Fi lokal yang sama dengan server SION Media.
- **Node.js**: Versi LTS terbaru (direkomendasikan v18+ atau v20+).
- **Perkakas CLI**: Expo CLI (terinstal otomatis dalam proyek).

---

## 🚀 Memulai Pengembangan

### 1. Kloning Repositori
```bash
git clone https://github.com/AiWerek-Tech/sion-link-mobile.git
cd sion-link-mobile
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan Expo
```bash
npm start
```
Buka aplikasi **Expo Go** di perangkat Android Anda dan pindai kode QR yang muncul di terminal untuk mulai menguji.

### 4. Menjalankan Langsung di Perangkat / Emulator Android
Pastikan USB Debugging aktif di ponsel Anda dan jalankan:
```bash
npm run android
```

---

## 📂 Struktur Folder Proyek

```text
sion-link-mobile/
├── assets/              # Aset gambar, ikon, dan splash screen aplikasi
├── src/
│   ├── components/      # Komponen UI modular reusable (Card, Button, Scanner)
│   ├── protocol/        # Handler protokol verifikasi, REST, dan SSE
│   ├── screens/         # Tampilan layar utama (Connect, Scanner, Operator, Viewer, Stage)
│   ├── services/        # Service integrasi (Network Scan, Video stream player)
│   ├── store/           # State management global menggunakan Zustand
│   └── theme/           # Konfigurasi gaya visual, warna, dan tipografi
├── App.tsx              # Entry point utama aplikasi React Native
├── app.json             # Konfigurasi Expo app manifest (nama, skema, izin)
├── tsconfig.json        # Konfigurasi transpiler TypeScript
└── package.json         # Dependensi proyek & skrip pengembangan
```

---

## 👤 Kontributor & Lisensi

Dikembangkan oleh **AiWerek Tech** untuk ekosistem **SION Media**.
Untuk kontribusi dan pelaporan bug, silakan buat *issue* atau kirimkan *pull request* di repositori ini.
