
## 📁 1. Struktur Folder Proyek Frontend

Susunan folder dirancang modular agar mudah dibaca oleh penguji (asesor) dan menerapkan prinsip *Clean Code*:

```text
src/
├── assets/            # Gambar, logo, atau icon statis
├── components/        # Reusable UI Components (Atom & Molecules)
│   ├── Button.jsx     # Tombol aksi (Primary, Secondary, Danger)
│   ├── InputField.jsx # Input teks, select, atau form kontrol
│   └── Table.jsx      # Komponen tabel dinamis dengan aksi Edit/Delete
├── pages/             # Halaman utama aplikasi (Smart Components)
│   └── SiswaPage.jsx  # Halaman manajemen data Siswa & Jurusan
├── services/          # Konfigurasi Axios dan komunikasi API Backend
│   └── api.js         # Pengaturan baseURL dan endpoint handler
├── App.jsx            # Root component yang merender halaman
├── App.css            # Styling tambahan / Tailwind CSS directives
└── main.js / main.jsx # Entry point aplikasi React

```

---

## ⚙️ 2. Cara Menjalankan Aplikasi Frontend

Ikuti langkah-langkah berikut di terminal untuk menjalankan proyek React:

1. **Buka Terminal** dan arahkan ke direktori folder frontend:
```bash
cd nama-folder-frontend

```


2. **Install Dependencies** (jika belum dilakukan):
```bash
npm install

```


3. **Konfigurasi URL Backend (`src/services/api.js`)**:
Pastikan `baseURL` mengarah ke port backend Express Anda yang sedang aktif (misalnya port `3001`):
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api/v1', // Sesuaikan port backend
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;

```


4. **Jalankan Development Server**:
```bash
npm run dev

```


5. Buka browser dan akses URL yang tertera di terminal (biasanya `http://localhost:5173`).

---

## 🚀 3. Fitur Utama & Cara Penggunaan

Aplikasi frontend ini dirancang untuk menangani operasi **CRUD** (*Create, Read, Update, Delete*) secara interaktif dan *real-time* terintegrasi dengan backend API.

### A. Fitur Menampilkan Data (`Read` & Pagination)

* **Tabel Dinamis:** Data siswa atau jurusan akan dimuat ke dalam tabel rapi menggunakan komponen `Table.jsx`.
* **Pencarian (Search):** Terdapat kolom input pencarian di bagian atas untuk memfilter data berdasarkan nama secara instan.
* **Pagination:** Navigasi halaman (`Halaman Sebelumnya` / `Halaman Berikutnya`) untuk membatasi jumlah data yang tampil per halaman.

### B. Fitur Tambah & Ubah Data (`Create` & `Update`)

* **Form Input Terstruktur:** Menggunakan komponen `InputField.jsx` yang mendukung berbagai tipe data (teks, nomor telepon, pilihan dropdown/select).
* **Modal / Form Sederhana:** Saat tombol **"Tambah Data"** diklik, form akan terbuka. Jika menekan tombol **"Edit"** pada baris tabel tertentu, form akan otomatis terisi data lama untuk diperbarui (*Pre-filled*).

### C. Fitur Hapus Data (`Delete`)

* **Konfirmasi Hapus:** Tombol hapus pada setiap baris tabel memicu dialog konfirmasi untuk mencegah kesalahan penghapusan data secara tidak disengaja.
