"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../CartContext";

export default function ProdukPage() {
    const [produk, setProduk] = useState([]);
    const [kategori, setKategori] = useState("Semua");
    const [kategoriList, setKategoriList] = useState([{ id: "Semua", name: "Semua" }]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState("grid");
    const [notification, setNotification] = useState("");
    const { setCartCount } = useCart();

    useEffect(() => {
        const fetchProduk = async () => {
            try {
                const res = await axios.get("/api/produk");
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

    // Filter dan sort produk
    const produkTampil = produk
        .filter((p) => {
            const matchCategory = kategori === "Semua" || String(p.category?.id) === String(kategori);
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchCategory && matchSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low": return parseFloat(a.price) - parseFloat(b.price);
                case "price-high": return parseFloat(b.price) - parseFloat(a.price);
                case "name": return a.name.localeCompare(b.name);
                default: return 0;
            }
        });

    // Handle add to cart
    const handleAddToCart = (produkItem, qty = 1) => {
        // Check if product has stock
        if (!produkItem.stock || produkItem.stock === 0) {
            setNotification(`Maaf, ${produkItem.name} sedang habis stok!`);
            setTimeout(() => setNotification(""), 3000);
            return;
        }

        // Check if requested quantity exceeds available stock
        if (qty > produkItem.stock) {
            setNotification(`Maaf, stok ${produkItem.name} hanya tersedia ${produkItem.stock} unit!`);
            setTimeout(() => setNotification(""), 3000);
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((item) => item.id === produkItem.id);

        // Check if adding to existing cart item would exceed stock
        const currentCartQty = existing ? existing.qty : 0;
        const totalQty = currentCartQty + qty;

        if (totalQty > produkItem.stock) {
            const availableToAdd = produkItem.stock - currentCartQty;
            if (availableToAdd > 0) {
                setNotification(`Hanya bisa menambah ${availableToAdd} unit lagi. Stok tersisa: ${produkItem.stock}`);
            } else {
                setNotification(`${produkItem.name} sudah mencapai batas maksimum di keranjang!`);
            }
            setTimeout(() => setNotification(""), 3000);
            return;
        }

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                id: produkItem.id,
                name: produkItem.name,
                price: produkItem.price,
                qty: qty,
                gambar: produkItem.gambar,
                imageUrl: produkItem.imageUrl,
                stock: produkItem.stock, // Add stock info to cart item
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Update cart count di context
        const totalCartQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(totalCartQty);

        // Show success notification with stock info
        const remainingStock = produkItem.stock - totalQty;
        setNotification(`${produkItem.name} ditambahkan ke keranjang! (Sisa stok: ${remainingStock})`);
        setTimeout(() => setNotification(""), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Notification */}
            {notification && (
                <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        <span className="font-medium">{notification}</span>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <section className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Katalog Produk HPAI
                        </h1>
                        <p className="text-xl text-green-100 max-w-2xl mx-auto">
                            Temukan produk herbal HPAI pilihan terbaik untuk kesehatan Anda
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Filter & Search Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 top-20 z-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cari Produk
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari nama produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kategori
                            </label>
                            <select
                                value={kategori}
                                onChange={(e) => setKategori(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                {kategoriList.map((kat, idx) => (
                                    <option key={kat.id + "-" + idx} value={kat.id}>
                                        {kat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Urutkan
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                <option value="name">Nama A-Z</option>
                                <option value="price-low">Harga Terendah</option>
                                <option value="price-high">Harga Tertinggi</option>
                            </select>
                        </div>
                    </div>

                    {/* View Mode & Results Count */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                            Menampilkan <span className="font-semibold text-green-600 dark:text-green-400">{produkTampil.length}</span> produk
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tampilan:</span>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <section id="produk">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Memuat produk...</p>
                            </div>
                        </div>
                    ) : produkTampil.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Tidak ada produk ditemukan
                            </h3>
                            <p className="text-gray-500 dark:text-gray-500">
                                Coba ubah kata kunci pencarian atau filter kategori
                            </p>
                        </div>
                    ) : (
                        <div className={`${viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                            }`}>
                            {produkTampil.map((produkItem, idx) => (
                                <ProductCard
                                    key={produkItem.id ?? idx}
                                    produk={produkItem}
                                    viewMode={viewMode}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ produk, viewMode, onAddToCart }) {
    const [qty, setQty] = useState(1);
    const [showQtyInput, setShowQtyInput] = useState(false);

    // Check if product is out of stock
    const isOutOfStock = !produk.stock || produk.stock === 0;
    const isLowStock = produk.stock && produk.stock <= 5 && produk.stock > 0;

    const handleQuickAdd = () => {
        if (isOutOfStock) return;
        onAddToCart(produk, qty);
        setShowQtyInput(false);
        setQty(1);
    };

    if (viewMode === "list") {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${isOutOfStock ? 'opacity-75' : ''}`}>
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
                        <img
                            src={
                                produk.gambar?.startsWith("http")
                                    ? produk.gambar
                                    : `${process.env.NEXT_PUBLIC_API_URL}${produk.imageUrl}`
                            }
                            alt={produk.name}
                            className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
                        />
                        {/* Stock Badge */}
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    STOK HABIS
                                </span>
                            </div>
                        )}
                        {isLowStock && !isOutOfStock && (
                            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                Stok Terbatas
                            </div>
                        )}
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {produk.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                {produk.description}
                            </p>
                            {/* Stock Info */}
                            <div className="mb-4">
                                {isOutOfStock ? (
                                    <span className="text-red-500 font-semibold text-sm">Stok Habis</span>
                                ) : (
                                    <span className={`text-sm ${isLowStock ? 'text-orange-500' : 'text-gray-500'}`}>
                                        Stok: {produk.stock} unit
                                    </span>
                                )}
                            </div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                                Rp {produk.price}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href={`/product/${produk.id}`}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium text-center transition-colors duration-200"
                            >
                                Lihat Detail
                            </a>
                            <div className="flex gap-2">
                                {isOutOfStock ? (
                                    <button
                                        disabled
                                        className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                                    >
                                        Stok Habis
                                    </button>
                                ) : showQtyInput ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max={produk.stock}
                                            value={qty}
                                            onChange={(e) => {
                                                const newQty = parseInt(e.target.value) || 1;
                                                setQty(Math.min(newQty, produk.stock));
                                            }}
                                            className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            onClick={handleQuickAdd}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                        >
                                            Tambah
                                        </button>
                                        <button
                                            onClick={() => setShowQtyInput(false)}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-2 rounded-lg transition-colors duration-200"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowQtyInput(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.7L21 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                        </svg>
                                        Keranjang
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden ${isOutOfStock ? 'opacity-75' : ''}`}>
            <div className="relative overflow-hidden">
                <img
                    src={
                        produk.gambar?.startsWith("http")
                            ? produk.gambar
                            : `${process.env.NEXT_PUBLIC_API_URL}${produk.imageUrl}`
                    }
                    alt={produk.name}
                    className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
                />

                {/* Stock Badges */}
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {produk.category?.name || "Produk"}
                </div>

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            STOK HABIS
                        </span>
                    </div>
                )}

                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Stok Terbatas
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {produk.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                    {produk.description}
                </p>

                {/* Stock Info */}
                <div className="mb-3">
                    {isOutOfStock ? (
                        <span className="text-red-500 font-semibold text-sm">Stok Habis</span>
                    ) : (
                        <span className={`text-sm ${isLowStock ? 'text-orange-500' : 'text-gray-500'}`}>
                            Stok: {produk.stock} unit
                        </span>
                    )}
                </div>

                <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                    Rp {produk.price}
                </div>

                <div className="flex flex-col gap-2">
                    <a
                        href={`/product/${produk.id}`}
                        className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium text-center transition-colors duration-200"
                    >
                        Lihat Detail
                    </a>

                    {isOutOfStock ? (
                        <button
                            disabled
                            className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                        >
                            Stok Habis
                        </button>
                    ) : showQtyInput ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max={produk.stock}
                                value={qty}
                                onChange={(e) => {
                                    const newQty = parseInt(e.target.value) || 1;
                                    setQty(Math.min(newQty, produk.stock));
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                onClick={handleQuickAdd}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => setShowQtyInput(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowQtyInput(true)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.7L21 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                            </svg>
                            Tambah ke Keranjang
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}