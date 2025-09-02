"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Homepage() {
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await axios.get("/api/produk");
        const produkAktif = (res.data || []).filter((p) => p.isActive === true);
        setProduk(produkAktif);
      } catch {
        setProduk([]);
      }
    };
    fetchProduk();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Selamat Datang di
              <span className="block text-yellow-300">Stokis HNI & HPAI Ika</span>
            </h1>
            <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Solusi kesehatan alami dengan produk herbal HPAI berkualitas tinggi,
              terpercaya, dan bersertifikat halal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/product"
                className="inline-flex items-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-green-800 font-bold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🛍️ Belanja Sekarang
              </Link>
              <a
                href="https://wa.me/6282294317043"
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-lg border-2 border-white/30 backdrop-blur-sm transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Konsultasi Gratis
              </a>
            </div>
          </div>
        </div>
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-emerald-50 dark:fill-gray-900">
            <path d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content */}
              <div className="p-8 lg:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold mb-6 w-fit">
                  ✨ Tentang Kami
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Distributor HPAI Terpercaya Sejak 2020
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Kami berkomitmen menyediakan produk herbal HPAI original dengan kualitas terbaik.
                  Dengan pengalaman bertahun-tahun, kami telah melayani ribuan pelanggan di seluruh Indonesia.
                </p>

                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">100% Produk Original</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-xl">🚚</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Pengiriman Cepat</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-xl">💬</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Konsultasi Gratis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 text-xl">🏆</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Pelayanan Terbaik</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                      <a href="https://wa.me/6282294317043" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                        0822-9431-7043
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a href="mailto:agenhpai.ika@email.com" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                        agenhpai.ika@email.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative h-64 lg:h-full min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-20"></div>
                <img
                  src="/foto adek.jpg"
                  alt="Distributor HPAI Ika"
                  className="w-full h-full object-cover"
                />
                {/* Simple overlay pattern */}
                <div className="absolute inset-0 bg-white/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold mb-6">
              🌿 Produk Unggulan
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Temukan Produk Herbal HPAI Terbaik
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Jelajahi koleksi lengkap produk herbal HPAI yang telah terbukti berkualitas dan bermanfaat untuk kesehatan Anda
            </p>
          </div>

          {/* Product Preview Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {produk.slice(0, 3).map((item, idx) => (
              <div
                key={item.id ?? idx}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      item.gambar?.startsWith("http")
                        ? item.gambar
                        : `http://localhost:5000${item.imageUrl}`
                    }
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Unggulan
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Rp {item.price}
                    </span>
                    <a
                      href={`/product/${item.id}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Lihat Detail
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link href="/product/" className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              🛍️ Lihat Semua Produk
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Kepercayaan pelanggan adalah prioritas utama kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🏆",
                title: "Kualitas Terjamin",
                desc: "Semua produk telah tersertifikasi dan teruji kualitasnya"
              },
              {
                icon: "⚡",
                title: "Pengiriman Cepat",
                desc: "Pengiriman ke seluruh Indonesia dengan jaminan aman"
              },
              {
                icon: "💰",
                title: "Harga Terbaik",
                desc: "Dapatkan harga distributor langsung tanpa perantara"
              },
              {
                icon: "🤝",
                title: "Layanan 24/7",
                desc: "Konsultasi dan bantuan tersedia kapan saja"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alamat Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Alamat & Kontak
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ingin membeli langsung? Silakan kunjungi alamat kami di bawah ini.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Distributor HPAI Ika
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Perumahan Grand Mutiara Nanggerang Blok C No. 23, Desa Nanggerang, Kecamatan Tajurhalang, Kabupaten Bogor, Jawa Barat
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                      <a href="https://wa.me/6282294317043" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                        0822-9431-7043
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a href="mailto:agenhpai.ika@email.com" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                        agenhpai.ika@email.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-64 lg:h-full min-h-[300px]">
                <iframe
                  title="Lokasi Toko"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2803.2752074654877!2d106.78018931360262!3d-6.467109011776893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2sid!4v1753701672811!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-16 lg:py-24 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Siap Memulai Hidup Sehat dengan HPAI?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Bergabunglah dengan ribuan pelanggan yang telah merasakan manfaat produk herbal HPAI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/product"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              🛒 Mulai Belanja
            </Link>
            <a
              href="https://wa.me/6282294317043"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              💬 Hubungi Kami
            </a>
          </div>
        </div>
      </section >
    </div >
  );
}