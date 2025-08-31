"use client";
import { usePathname } from "next/navigation";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
            </div>

            {/* Wave Top */}
            <div className="relative">
                <svg viewBox="0 0 1440 120" className="w-full h-20 fill-gray-50 dark:fill-gray-900 transform rotate-180">
                    <path d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Stokis HNI & HPAI Ika</h3>
                                <p className="text-green-200 text-sm">Toko Herbal Terpercaya</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                            Menyediakan produk herbal HPAI original dengan kualitas terbaik.
                            Kepercayaan dan kepuasan pelanggan adalah prioritas utama kami.
                        </p>

                        {/* Social Media */}
                        <div className="flex space-x-4">
                            <a
                                href="https://wa.me/6282294317043"
                                className="w-10 h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="WhatsApp"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                </svg>
                            </a>
                            <a
                                href="mailto:agenhpai.ika@email.com"
                                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="Email"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/hpai.ika"
                                className="w-10 h-10 bg-pink-600 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Menu Utama</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Beranda", href: "/" },
                                { label: "Produk", href: "/product" },
                                { label: "Tentang", href: "/about" },
                                { label: "Keranjang", href: "/cart" }
                            ].map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-gray-300 hover:text-green-300 transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3 group-hover:bg-green-300 transition-colors duration-200"></span>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Hubungi Kami</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Perumahan Grand Mutiara Nanggerang Blok C No. 23,
                                        Kec. Tajurhalang, Kab. Bogor, Jawa Barat
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <a
                                        href="https://wa.me/6282294317043"
                                        className="text-gray-300 hover:text-green-300 transition-colors duration-200 text-sm"
                                    >
                                        0822-9431-7043
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <a
                                        href="mailto:agenhpai.ika@email.com"
                                        className="text-gray-300 hover:text-green-300 transition-colors duration-200 text-sm"
                                    >
                                        agenhpai.ika@email.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-gray-400 text-sm">
                                &copy; {currentYear} <span className="font-semibold text-green-300">Stokis HNI & HPAI Ika</span>.
                                Semua hak cipta dilindungi.
                            </p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <a
                                href="/privacy"
                                className="text-gray-400 hover:text-green-300 text-sm transition-colors duration-200"
                            >
                                Kebijakan Privasi
                            </a>
                            <a
                                href="/terms"
                                className="text-gray-400 hover:text-green-300 text-sm transition-colors duration-200"
                            >
                                Syarat & Ketentuan
                            </a>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <span className="text-green-400">🏆</span>
                            <span>Produk Original</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <span className="text-green-400">✅</span>
                            <span>Bersertifikat Halal</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <span className="text-green-400">🚚</span>
                            <span>Pengiriman Terpercaya</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <span className="text-green-400">💬</span>
                            <span>Konsultasi 24/7</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 w-12 h-12 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group"
                aria-label="Kembali ke atas"
            >
                <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </footer>
    );
}

export default function FooterClient() {
    const pathname = usePathname();
    const hideFooter = [
        "/login",
        "/register",
        "/forgot-password",
        "/verification-code",
        "/admin/login",
        "/admin/dashboard",
        "/admin/user",
        "/admin/kategori",
        "/admin/produk",
        "/admin/produk/tambah",
        "/admin/kategori/tambah",
        "/admin/kategori/edit",
        "/admin/produk/edit",
        "/admin/order",
        "/admin/produk/detail",
    ].includes(pathname);

    if (hideFooter) return null;
    return <Footer />;
}