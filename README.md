# Frontend HPAI Store

Tampilan toko online produk herbal HPAI: katalog, keranjang, checkout (Midtrans Snap), riwayat pesanan, review, dan panel admin di `/admin`.

**Stack:** Next.js 15 (App Router), React 19, Tailwind CSS 4, axios, SweetAlert2.

Backend (Express + Prisma) ada di repo terpisah: [`backend-hpai`](https://github.com/andikspp/backend-hpai). Frontend ini tidak bisa jalan tanpa backend.

## Menjalankan di lokal

Prasyarat: Node.js 22+, dan backend sudah berjalan (default `http://localhost:5000`).

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya
npm run dev                  # http://localhost:3000
```

Restart `npm run dev` setiap kali `.env.local` diubah.

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server development |
| `npm run build` | Build production |
| `npm start` | Jalankan hasil build |
| `npm run lint` | ESLint |

## Environment

Lihat [`.env.example`](.env.example):

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL backend: tujuan rewrite `/api/*` dan URL gambar produk |
| `BACKEND_URL` | Opsional: URL backend khusus untuk rewrite jika berbeda |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Client Key Midtrans (memang publik) |
| `NEXT_PUBLIC_MIDTRANS_SNAP_URL` | `snap.js` sandbox atau production |

URL backend untuk rewrite dibaca **saat build**. Di Vercel, isi env-nya sebelum build.

## Cara frontend memanggil backend

- Semua halaman memanggil path relatif `/api/...`, misalnya `axios.get("/api/produk")`.
- [`next.config.mjs`](next.config.mjs) meneruskan `/api/*` apa adanya ke backend, termasuk header `Authorization`. Tidak ada lagi file proxy di `src/app/api`. Tambahkan endpoint di backend, bukan di sini.
- [`AxiosAuth.js`](src/app/AxiosAuth.js) memasang token otomatis ke setiap request `/api/...`:
  - halaman di bawah `/admin` memakai `localStorage.adminToken`
  - halaman lain memakai `localStorage.token`
- Gambar produk dimuat langsung dari `${NEXT_PUBLIC_API_URL}/uploads/...`.

## Checkout

Halaman checkout hanya mengirim `productId` dan `qty` ke `POST /api/create-transaction`. Harga, ongkir, total, dan status pembayaran ditentukan backend. Status "lunas" hanya berasal dari webhook Midtrans ke backend, bukan dari callback popup di browser.

Ongkir yang ditampilkan di checkout (Rp20.000) ditulis di kode. Jika `ONGKIR_FLAT` di backend diubah, samakan juga di [`checkout/page.js`](src/app/checkout/page.js).

## Struktur halaman

```
src/app/
  page.js                 # beranda
  product/, product/[id]  # katalog & detail produk
  cart/, checkout/        # keranjang & pembayaran
  orders/                 # riwayat pesanan user
  order-confirmation/     # detail pesanan, konfirmasi diterima, review
  login/, register/, verification-code/, forgot-password/, reset-link/
  profile/                # profil & edit profil
  admin/                  # dashboard, produk, kategori, order, user
```

## Deploy (Vercel)

1. Deploy bersama backend versi yang berpasangan.
2. Isi env di Vercel (Settings → Environment Variables), lalu build ulang.
3. Untuk production, pakai Client Key dan `snap.js` production Midtrans.
