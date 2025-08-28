"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../CartContext";
import Swal from "sweetalert2";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [produk, setProduk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { setCartCount } = useCart();

    useEffect(() => {
        const fetchProduk = async () => {
            try {
                const res = await axios.get(`/api/produk/${id}`);
                setProduk(res.data);
            } catch {
                setProduk(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduk();
    }, [id]);

    const handleAddToCart = () => {
        if (!produk) return;

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((item) => item.id === produk.id);

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                id: produk.id,
                name: produk.name,
                price: produk.price,
                qty: qty,
                gambar: produk.gambar,
                imageUrl: produk.imageUrl,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(totalQty);

        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `${qty} ${produk.name} berhasil ditambahkan ke keranjang`,
            timer: 2000,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => {
            router.push('/checkout');
        }, 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat detail produk...</p>
                </div>
            </div>
        );
    }

    if (!produk) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
                    <div className="text-6xl mb-6">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Produk Tidak Ditemukan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Maaf, produk yang Anda cari tidak tersedia
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // Mock data untuk multiple images (jika diperlukan)
    const productImages = [
        produk.gambar?.startsWith("http") ? produk.gambar : `http://localhost:5000${produk.imageUrl || produk.gambar}`,
        // Tambahkan gambar lain jika ada
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Breadcrumb */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <a href="/" className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                            Beranda
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <a href="/product" className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                            Produk
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {produk.name}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Product Images */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                            <div className="aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-8">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={produk.name}
                                    className="w-full h-full object-contain rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        {productImages.length > 1 && (
                            <div className="flex gap-3">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                                                ? 'border-green-500 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${produk.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Jaminan Produk
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Produk Original HPAI</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Halal & Aman Dikonsumsi</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Garansi Uang Kembali</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">

                        {/* Product Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {produk.category?.name || "Produk Herbal"}
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {produk.name}
                            </h1>

                            {/* Rating & Reviews (Mock) */}
                            {/* <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-600 dark:text-gray-400">4.8 (127 ulasan)</span>
                            </div> */}

                            {/* Price */}
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    Rp {produk.price?.toLocaleString("id-ID")}
                                </div>
                                {/* <div className="flex items-center gap-2">
                                    <span className="text-gray-500 dark:text-gray-400 line-through">
                                        Rp {(produk.price * 1.2)?.toLocaleString("id-ID")}
                                    </span>
                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-sm font-semibold">
                                        Hemat 20%
                                    </span>
                                </div> */}
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-3 h-3 rounded-full ${produk.stock > 10 ? 'bg-green-500' : produk.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {produk.stock > 10 ? 'Stok Tersedia' : produk.stock > 0 ? 'Stok Terbatas' : 'Stok Habis'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Tersisa {produk.stock || 0} item
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Jumlah
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl">
                                        <button
                                            onClick={() => setQty(Math.max(1, qty - 1))}
                                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-l-xl"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={produk.stock}
                                            value={qty}
                                            onChange={(e) => setQty(Math.max(1, Math.min(produk.stock, parseInt(e.target.value) || 1)))}
                                            className="w-16 px-4 py-3 text-center border-0 focus:ring-0 dark:bg-transparent dark:text-white"
                                        />
                                        <button
                                            onClick={() => setQty(Math.min(produk.stock, qty + 1))}
                                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-r-xl"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">
                                        Subtotal: <span className="font-bold text-green-600 dark:text-green-400">
                                            Rp {(produk.price * qty)?.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={produk.stock === 0}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5-5m12.5 5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                                    </svg>
                                    Tambah ke Keranjang
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={produk.stock === 0}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Deskripsi Produk
                            </h3>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                    {produk.description || "Produk herbal HPAI berkualitas tinggi yang telah terpercaya untuk kesehatan Anda."}
                                </p>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Manfaat Produk
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">100% Bahan Herbal Alami</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Telah Teruji Klinis</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Aman untuk Konsumsi Jangka Panjang</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">Bebas Efek Samping</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Produk
                    </button>
                </div>
            </div>
        </div>
    );
}