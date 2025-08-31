import React from "react";

export const metadata = {
    title: "Tentang Kami - Distributor HPAI Ika",
    description: "Pelajari lebih lanjut tentang Distributor HPAI Ika dan komitmen kami terhadap kesehatan Anda.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <div className="mb-8">
                            <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                            Tentang Kami
                        </h1>
                        <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                            Distributor HPAI terpercaya yang berkomitmen untuk kesehatan dan kesejahteraan Anda
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Main Story */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-16">
                    <div className="grid lg:grid-cols-2 gap-0">
                        <div className="p-8 lg:p-12">
                            <div className="mb-6">
                                <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold">
                                    Tentang
                                </span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Stokis HNI & HPAI Ika
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                Saya adalah salah satu stokis produk HPAI terpercaya yang telah berpengalaman bertahun-tahun dalam menjual produk-produk HPAI berkualitas tinggi. Dengan dedikasi penuh, saya melayani kebutuhan kesehatan Anda dengan produk herbal yang aman, alami, dan efektif.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                Kepercayaan dan kepuasan pelanggan adalah prioritas utama saya. Setiap produk yang saya jual telah melalui standar kualitas untuk memastikan Anda mendapatkan manfaat terbaik untuk kesehatan.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8 lg:p-12 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Melayani dengan Hati</h3>
                                <p className="text-green-100">
                                    Komitmen saya adalah memberikan pelayanan terbaik dalam memenuhi kebutuhan anda mengenai produk herbal HPAI.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">5+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Tahun Pengalaman</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Produk Herbal</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">1000+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Pelanggan Puas</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Layanan Konsultasi</div>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="grid lg:grid-cols-2 gap-8 mb-16">

                    {/* Vision */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6">
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Visi</h3>
                                    <p className="text-blue-100 text-sm">Pandangan masa depan</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                Menjadi salah satu stokis HPAI terdepan yang menyediakan produk HPAI berkualitas tinggi untuk meningkatkan kesehatan dan kualitas hidup konsumen secara berkelanjutan.
                            </p>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6">
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Misi</h3>
                                    <p className="text-purple-100 text-sm">Langkah strategis</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Menyediakan produk herbal HPAI yang aman, berkualitas, dan terjangkau</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Memberikan edukasi kesehatan dan manfaat herbal kepada masyarakat</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Membangun kepercayaan melalui pelayanan prima dan transparan</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Mengembangkan komunitas hidup sehat dengan produk herbal</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-16">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
                        <div className="text-center text-white">
                            <h3 className="text-3xl font-bold mb-2">Nilai-Nilai</h3>
                            <p className="text-green-100">Prinsip yang memandu setiap langkah kami</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Terpercaya</h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Saya membangun kepercayaan melalui transparansi dan konsistensi dalam setiap pelayanan
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Peduli</h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Kepedulian terhadap kesehatan dan kesejahteraan pelanggan adalah prioritas utama saya
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Responsif</h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Selalu siap melayani kebutuhan pelanggan dengan cepat, ramah, dan profesional demi kepuasan Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 lg:p-12 text-center text-white">
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                        Siap Memulai Hidup Sehat?
                    </h3>
                    <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Bergabunglah dengan ribuan pelanggan yang telah merasakan manfaat produk herbal HPAI berkualitas
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/product"
                            className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Lihat Produk
                        </a>
                        <a
                            href="https://wa.me/6282294317043"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.148z" />
                            </svg>
                            Konsultasi Gratis
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}