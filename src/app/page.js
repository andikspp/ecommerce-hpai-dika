"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Homepage() {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState("Semua");
  const [kategoriList, setKategoriList] = useState(["Semua"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await axios.get("/api/produk");
        // Filter hanya produk yang aktif
        const produkAktif = (res.data || []).filter((p) => p.isActive === true);
        setProduk(produkAktif);

        // Ambil kategori unik dari produk aktif
        const kategoriMap = new Map();
        produkAktif.forEach((p) => {
          if (p.category && !kategoriMap.has(p.category.id)) {
            kategoriMap.set(p.category.id, p.category.name);
          }
        });
        const kategoriUnik = [
          { id: "Semua", name: "Semua" },
          ...Array.from(kategoriMap, ([id, name]) => ({ id, name })),
        ];
        setKategoriList(kategoriUnik);
      } catch {
        setProduk([]);
        setKategoriList([{ id: "Semua", name: "Semua" }]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, []);

  // Filter produk sesuai kategori
  const produkTampil =
    kategori === "Semua"
      ? produk
      : produk.filter((p) => String(p.category?.id) === String(kategori));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Filter Kategori */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-100 text-center sm:text-left">
              Produk Herbal HPAI
            </h2>
            <div>
              <label className="mr-2 text-green-700 dark:text-green-100 font-semibold">
                Kategori:
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="px-3 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
              >
                {kategoriList.map((kat, idx) => (
                  <option key={kat.id + "-" + idx} value={kat.id}>
                    {kat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Produk Section */}
        <section id="produk">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center text-green-700 dark:text-green-100 py-8">
                Memuat produk...
              </div>
            ) : produkTampil.length === 0 ? (
              <div className="col-span-full text-center text-green-700 dark:text-green-100 py-8">
                Tidak ada produk untuk kategori ini.
              </div>
            ) : (
              produkTampil.map((produk, idx) => (
                <div
                  key={(produk.id ?? "produk") + "-" + idx}
                  className="bg-white dark:bg-green-800 rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl transition"
                >
                  <img
                    src={
                      produk.gambar?.startsWith("http")
                        ? produk.gambar
                        : `http://localhost:5000${produk.imageUrl}`
                    }
                    alt={produk.name}
                    className="w-28 h-28 object-cover rounded-lg mb-3 border border-green-200 dark:border-green-700 bg-green-50"
                  />
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-100 mb-1 text-center">
                    {produk.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-200 text-sm mb-2 text-center">
                    {produk.description}
                  </p>
                  <div className="text-green-800 dark:text-green-200 font-bold mb-3">Rp
                    {produk.price}
                  </div>
                  <a
                    href={`/produk/${produk.id}`}
                    className="mt-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Lihat Detail
                  </a>
                </div>
              ))
            )}
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
      </div >
    </div >
  );
}