# Ramadhan Time
Aplikasi Asisten Amaliah Ramadhan All-in-One Berbasis PWA

## Tentang Proyek
Ramadhan Time adalah aplikasi web progresif (Progressive Web App / PWA) yang dirancang untuk menjadi pendamping ibadah umat Muslim, khususnya selama bulan suci Ramadhan. Aplikasi ini dikembangkan dengan pendekatan mobile-first dan antarmuka (UI/UX) modern.

## Fitur Utama
- Jadwal & Countdown Sholat Real-time: Menampilkan jadwal sholat secara presisi berdasarkan deteksi lokasi pengguna dan zona waktu.
- Alarm Otomatis: Notifikasi dan alarm tepat waktu untuk pengingat buka puasa dan sahur.
- Al-Quran Digital Terintegrasi:
  - Mode Khusyuk (Layar Penuh).
  - Penanda Ayat Terakhir Dibaca.
  - Audio Murottal.
  - Fitur Auto-Scroll.
- Kompas Arah Kiblat: Mengolah data sensor orientasi perangkat pintar untuk menunjukkan arah kiblat secara presisi.
- Kalkulator Zakat: Modul perhitungan kewajiban zakat fitrah dan zakat maal.
- Kumpulan Doa Pilihan: Akses cepat ke berbagai doa harian dan amalan.
- Habit Tracker: Sistem pelacakan rutinitas ibadah, seperti target tarawih dan tilawah harian untuk mengevaluasi progres amalan.
- Daily Quote: Pengingat atau kutipan inspiratif dari ayat maupun hadits setiap hari.
- Dukungan PWA: Mendukung instalasi native ke layar perangkat (Add to Home Screen) serta memiliki cache optimal untuk mengurangi penggunaan data.

## Teknologi dan Arsitektur
Proyek ini mengadopsi standar pengembangan modern web apps:
- Frontend Framework: React.js (v18) via Vite.
- Bahasa: TypeScript menjamin keamanan tipe data menyeluruh di setiap state.
- Styling: Tailwind CSS untuk styling, bersinergi dengan komponen *accessible* dari Radix UI / Shadcn UI.
- Animasi UI: Framer Motion.
- Data Fetching: @tanstack/react-query menangani caching maupun validasi data API pihak ketiga.
- Routing: React Router DOM (v6).
- Penyimpanan: Pemanfaatan LocalStorage untuk menjaga persistensi pengaturan pengguna, histori bacaan, serta habit tracker secara lokal.

## Struktur Direktori
```text
src/
├── components/   # Komponen spesifik fitur (QuranView, HabitTracker, Kompas, dll)
│   └── ui/       # Komponen UI dasar (Shadcn UI)
├── data/         # Objek data statis internal
├── hooks/        # Custom React hooks (usePrayerTimes, usePWA, useLocation, dll)
├── lib/          # Helper dan utility functions
├── pages/        # Komponen rute halaman utama
└── styles/       # Konfigurasi gaya tambahan dan file CSS
```

## Setup Lingkungan Lokal

**Prasyarat**: Pastikan Node.js telah terinstal pada sistem Anda.

1. Clone repositori ini:
   ```bash
   git clone <url-repo-anda>
   cd ramadhantime
   ```

2. Instalasi dependensi (mendukung npm, yarn, pnpm, atau bun):
   ```bash
   npm install
   ```

3. Jalankan server pengembangan mode lokal:
   ```bash
   npm run dev
   ```

4. Akses proyek melalui `http://localhost:5173` dari browser pilihan Anda.

## Deployment dan Build
Untuk mempersiapkan environment production:
```bash
npm run build
```
Bundle aplikasi hasil minimasi dan optimalisasi dapat ditemukan di direktori `dist/` (atau direktori keluaran konfigurasi Vite Anda), yang siap didistribusikan ke layanan hosting web statis.
