"use client";
import React, { useState } from "react";
import { useCart } from "../CartContext";
import { productImageSrc } from "@/lib/imageUrl";

// Bagian interaktif katalog: mode tampilan (grid/list), notifikasi, dan tambah ke keranjang.
// Daftar produk sudah diambil di server oleh page.js dan dikirim lewat props.
export default function ProductGrid({ items }) {
    const [viewMode, setViewMode] = useState("grid");
    const [notification, setNotification] = useState("");
    const { setCartCount } = useCart();

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
        <>
            {/* Notification */}
            {notification && (
                <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        <span className="font-medium">{notification}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-end items-center gap-2 mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tampilan:</span>
                <button
                    type="button"
                    aria-label="Tampilan grid"
                    aria-pressed={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </button>
                <button
                    type="button"
                    aria-label="Tampilan daftar"
                    aria-pressed={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className={`${viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
                }`}>
                {items.map((produkItem) => (
                    <ProductCard
                        key={produkItem.id}
                        produk={produkItem}
                        viewMode={viewMode}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </>
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
                                productImageSrc(produk.imageUrl || produk.gambar)
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
                                Rp {Number(produk.price).toLocaleString("id-ID")}
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
                        productImageSrc(produk.imageUrl || produk.gambar)
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
                    Rp {Number(produk.price).toLocaleString("id-ID")}
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