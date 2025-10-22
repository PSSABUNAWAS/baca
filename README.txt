LIBA v6.0 PWA
=================

Aplikasi Penilaian Bacaan (LIBA) – versi PWA tanpa bunyi.
Fungsi utama:
- Rakaman suara (MediaRecorder) guna mikrofon luar.
- Pertuturan ke teks (Web Speech API / webkitSpeechRecognition).
- Pengiraan automatik Peratus Penguasaan & TP (berbeza).
- Warna TP kekal: TP1 Merah → TP6 Ungu.
- Stopwatch (Mula Baca / Selesai Baca).
- Simpan rekod dalam jadual & eksport CSV (termasuk pautan rakaman).
- Kelas opsyenal (1–6 AR-RAZI & AL-KHAWARIZMI).
- Offline-first (Service Worker + manifest) dan Add to Home Screen.
- Antara muka Bahasa Melayu penuh.

Cara guna ringkas
-----------------
1) Buka `index.html` dalam Microsoft Edge (disyorkan).
2) Klik “Benarkan” kebenaran mikrofon apabila diminta.
3) Pilih kelas (opsyenal), masukkan Nama Murid, dan isikan “Teks Sasaran”.
4) Tekan **Mula Baca** untuk hidupkan stopwatch, rakam audio & pengenalan pertuturan.
5) Tekan **Selesai Baca** — keputusan dipapar serta-merta di halaman utama.
6) Klik **Simpan Rekod** untuk masukkan keputusan ke jadual.
7) Guna **Eksport CSV** untuk muat turun data.
8) Pasang ke skrin utama (Add to Home Screen). Aplikasi berfungsi tanpa Internet.

Nota
----
- Web Speech API tersedia di Chrome/Edge dengan `webkitSpeechRecognition`.
- Ketepatan peratus dianggarkan berdasarkan padanan perkataan antara transkrip dan teks sasaran.
- Rakaman audio disimpan sebagai fail .webm tempatan (boleh dimuat turun). Untuk kegunaan luar talian, fail yang dimuat turun akan kekal pada peranti.

