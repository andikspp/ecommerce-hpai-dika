export const metadata = {
  title: "Beranda - Agen HPAI Ika",
  description: "Selamat datang di toko herbal HPAI terpercaya.",
};

const produkDummy = [
  {
    id: 1,
    nama: "Habbatussauda Oil",
    gambar: "/produk/habbatussauda.jpg",
    harga: "Rp 75.000",
    deskripsi: "Minyak Habbatussauda asli, membantu menjaga daya tahan tubuh.",
  },
  {
    id: 2,
    nama: "Madu HPAI",
    gambar: "/produk/madu.jpg",
    harga: "Rp 55.000",
    deskripsi: "Madu murni pilihan untuk kesehatan keluarga.",
  },
  {
    id: 3,
    nama: "Spirulina HPAI",
    gambar: "/produk/spirulina.jpg",
    harga: "Rp 90.000",
    deskripsi: "Suplemen alami kaya nutrisi untuk vitalitas.",
  },
  {
    id: 4,
    nama: "Kopi Radix",
    gambar: "/produk/kopi-radix.jpg",
    harga: "Rp 35.000",
    deskripsi: "Kopi herbal dengan rempah pilihan.",
  },
];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white dark:bg-green-900 shadow-lg rounded-xl p-8 flex flex-col items-center mb-10">
          <div className="mb-4">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="#22c55e" />
              <path d="M32 18c-6 9-12 12-12 18a12 12 0 0024 0c0-6-6-9-12-18z" fill="#fff" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-2 text-center">
            Selamat Datang di Agen HPAI Ika
          </h1>
          <p className="text-green-600 dark:text-green-200 text-center text-base mb-6">
            Toko herbal HPAI terpercaya. Temukan produk herbal asli, aman, dan berkualitas untuk kesehatan Anda.
          </p>
          <a
            href="#produk"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Lihat Produk Herbal
          </a>
        </div>

        {/* Produk Section */}
        <section id="produk" className="mt-8">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-100 mb-6 text-center">
            Produk Unggulan Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {produkDummy.map((produk) => (
              <div
                key={produk.id}
                className="bg-white dark:bg-green-800 rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition"
              >
                <img
                  src={produk.gambar}
                  alt={produk.nama}
                  className="w-28 h-28 object-cover rounded-lg mb-3 border border-green-200 dark:border-green-700 bg-green-50"
                />
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-100 mb-1 text-center">{produk.nama}</h3>
                <p className="text-green-600 dark:text-green-200 text-sm mb-2 text-center">{produk.deskripsi}</p>
                <div className="text-green-800 dark:text-green-200 font-bold mb-3">{produk.harga}</div>
                <a
                  href={`/produk/${produk.id}`}
                  className="mt-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Lihat Detail
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section Alamat Toko */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-100 mb-4 text-center">
            Alamat & Kontak Agen HPAI Ika
          </h2>
          <p className="text-green-700 dark:text-green-200 text-center mb-4">
            Ingin membeli langsung? Silakan kunjungi alamat kami di bawah ini.
          </p>
          <div className="bg-white dark:bg-green-900 rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
            <div>
              <div className="text-green-800 dark:text-green-100 font-semibold mb-2">
                Agen HPAI Ika
              </div>
              <div className="text-green-700 dark:text-green-200 mb-1">
                Perumahan Grand Mutiara Nanggerang Blok C No. 23, Desa Nanggerang, Kecamatan Tajurhalang, Kabupaten Bogor, Jawa Barat
              </div>
              <div className="text-green-700 dark:text-green-200">
                WhatsApp: <a href="https://wa.me/6281234567890" className="underline hover:text-green-600">0812-3456-7890</a>
              </div>
              <div className="text-green-700 dark:text-green-200">
                Email: <a href="mailto:agenhpai.ika@email.com" className="underline hover:text-green-600">agenhpai.ika@email.com</a>
              </div>
            </div>
            <div className="w-full md:w-64 h-40 rounded-lg overflow-hidden border border-green-200 dark:border-green-700">
              {/* Ganti src dengan embed Google Maps lokasi toko Anda */}
              <iframe
                title="Lokasi Toko"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2803.2752074654877!2d106.78018931360262!3d-6.467109011776893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sid!4v1753701672811!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}