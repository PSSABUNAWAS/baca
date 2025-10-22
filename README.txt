LIBA v6.0 PWA (Kemas Kini)
============================

Perubahan utama:
- **Tidak perlu tampal Teks Sasaran.** Murid membaca buku fizikal.
- Sistem merakam audio sehingga guru klik **Selesai Baca**.
- **Analisis automatik berdasarkan kepantasan bacaan (WPM)** menggunakan Web Speech API (BM).
- Peratus Penguasaan (%) dikira dari WPM relatif kepada sasaran umum 120 WPM (diclamp 0–100).
- **TP** berasingan, dipeta dari WPM: TP1 ≤40, TP2 ≤60, TP3 ≤80, TP4 ≤100, TP5 ≤120, TP6 >120.

Aliran kerja ringkas
--------------------
1) Buka `index.html` (Edge/Chrome) dan benarkan mikrofon.
2) Isi **Nama Murid** (kelas opsyenal).
3) Tekan **Mula Baca** – stopwatch berjalan, rakaman + pertuturan ke teks bermula.
4) Tekan **Selesai Baca** – keputusan dipaparkan terus.
5) **Simpan Rekod** untuk tambah ke jadual. **Eksport CSV** bila perlu.

Nota
----
- Web Speech API: `webkitSpeechRecognition` (BM: `ms-MY`).
- WPM = jumlah perkataan yang dikenali / (minit bacaan).
- Ini ukuran kepantasan bacaan umum merentas tahap; sesuaikan ambang TP jika diperlukan.
