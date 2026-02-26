

# 🌙 Ramadhan Time – Jadwal Imsakiyah & Countdown Maghrib

## Overview
Aplikasi utilitas Ramadhan yang fungsional dengan desain modern mobile-first, terinspirasi dari referensi UI yang diberikan (neumorphic, clean, black & white dengan aksen Islamic). Menggunakan Aladhan API untuk jadwal sholat real-time berdasarkan lokasi.

---

## Halaman & Fitur

### 1. Home Screen (Halaman Utama)
- **Header**: Logo "Ramadhan Time" dengan ikon bulan sabit & lentera
- **Lokasi**: Nama kota terdeteksi otomatis (Geolocation API), dengan tombol ubah lokasi manual
- **Countdown Timer Besar** (fokus utama):
  - Tampilan digital JAM : MENIT : DETIK dengan circular progress indicator (seperti referensi)
  - Label dinamis: "Menuju Maghrib" atau "Menuju Imsak"
  - Auto-switch: sebelum Maghrib → countdown ke Maghrib, setelah Isya → countdown ke Imsak
  - Efek glow halus di sekitar timer
- **Info Cards**: Waktu sholat berikutnya & suhu (opsional)
- **Toggle Iftar/Sehar Alert** dengan switch
- **Jadwal Sholat Hari Ini**: Card layout menampilkan Imsak, Subuh, Dzuhur, Ashar, Maghrib, Isya — highlight waktu sholat aktif/berikutnya
- **Greeting**: "Selamat Menjalankan Ibadah Puasa"

### 2. Kalender Ramadhan (Tab/Halaman Kedua)
- Daftar scrollable 30 hari Ramadhan
- Highlight hari ini
- Setiap hari menampilkan jadwal sholat lengkap
- Navigasi mudah antar hari

### 3. Pengaturan
- **Dark/Light Mode Toggle** dengan transisi smooth fade
  - Light: cream (#FFF8E7), hijau (#2E7D32), emas (#C9A227)
  - Dark: navy (#0D1B2A), biru gelap (#1B263B), emas (#E0AA3E)
- **Notifikasi Toggle**: 10 menit sebelum Maghrib & Imsak (browser notifications)
- **Pilih Lokasi Manual**: search kota

---

## Desain & UX
- **Mobile-first**, responsive untuk tablet & desktop
- Terinspirasi referensi: neumorphic soft shadows, rounded cards, clean spacing
- Ikon Islamic subtle (bulan sabit, lentera) sebagai dekorasi
- Tipografi elegan & besar untuk countdown
- Animasi smooth: ticking countdown, transisi halaman, fade dark/light mode
- Loading skeleton saat fetch data

## Teknis
- **Aladhan API** (`api.aladhan.com`) untuk jadwal sholat
- **Geolocation API** untuk deteksi lokasi otomatis
- **localStorage**: cache jadwal terakhir (offline fallback), preferensi tema, lokasi
- **PWA**: manifest.json + service worker untuk installable & offline caching
- **Error handling**: fallback UI jika API gagal, gunakan data cached
- Bottom navigation: Home, Kalender, Settings

