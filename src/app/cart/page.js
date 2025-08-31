"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../CartContext";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productStock, setProductStock] = useState({});
    const { setCartCount } = useCart();

    useEffect(() => {
        const fetchCart = async () => {
            const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
            const token = localStorage.getItem("token");
            let userId = null;
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    userId = payload.id;
                } catch { }
            }

            if (userId) {
                let dbCart = [];
                try {
                    const res = await axios.get(`/api/cart/${userId}`);
                    dbCart = res.data.items || [];
                } catch { }
                const merged = [...dbCart];
                localCart.forEach(localItem => {
                    const foundIdx = merged.findIndex(item =>
                        (item.productId || item.id) === (localItem.productId || localItem.id)
                    );
                    if (foundIdx !== -1) {
                        merged[foundIdx].qty = localItem.qty;
                    } else {
                        merged.push(localItem);
                    }
                });
                setCart(merged);
                localStorage.setItem("cart", JSON.stringify(merged));
            } else {
                setCart(localCart);
            }
            await fetchProductStocks(localCart);
            setLoading(false);
        };
        fetchCart();
    }, []);

    // Fungsi untuk mengambil stok produk
    const fetchProductStocks = async (cartItems) => {
        try {
            const stockData = {};
            for (const item of cartItems) {
                const productId = item.productId || item.id;
                try {
                    const response = await axios.get(`/api/produk/${productId}`);
                    stockData[productId] = response.data.stock || 0;
                } catch (error) {
                    console.error(`Error fetching stock for product ${productId}:`, error);
                    stockData[productId] = 0;
                }
            }
            setProductStock(stockData);
        } catch (error) {
            console.error("Error fetching product stocks:", error);
        }
    };

    const total = cart.reduce((sum, item) => {
        const product = item.product || item;
        return sum + (product.price * item.qty);
    }, 0);

    const handleRemove = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Item?',
            text: 'Apakah Anda yakin ingin menghapus item ini dari keranjang?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            const newCart = cart.filter((item) => item.id !== id);
            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));

            const totalQty = newCart.reduce((sum, item) => sum + (item.qty || 1), 0);
            setCartCount(totalQty);

            if (newCart.length === 0) {
                const token = localStorage.getItem("token");
                let userId = null;
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split(".")[1]));
                        userId = payload.id;
                    } catch { }
                }
                if (userId) {
                    try {
                        await axios.post("/api/cart/save", { userId, cart: [] });
                    } catch (e) {
                        console.error("Gagal menghapus cart di backend:", e);
                    }
                }
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Item berhasil dihapus dari keranjang',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const handleQtyChange = (id, qty) => {
        if (qty < 1) return;

        // Validasi stok
        const productId = cart.find(item => item.id === id)?.productId || id;
        const availableStock = productStock[productId] || 0;

        if (qty > availableStock) {
            Swal.fire({
                icon: 'warning',
                title: 'Stok Tidak Mencukupi',
                text: `Stok tersedia hanya ${availableStock} unit. Jumlah akan disesuaikan dengan stok yang tersedia.`,
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
            qty = availableStock;
        }

        const newCart = cart.map((item) =>
            item.id === id ? { ...item, qty } : item
        );
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));

        const totalQty = newCart.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(totalQty);
    };

    const handleCheckout = () => {
        // Validasi stok sebelum checkout
        const invalidItems = cart.filter(item => {
            const productId = item.productId || item.id;
            const availableStock = productStock[productId] || 0;
            return item.qty > availableStock;
        });

        if (invalidItems.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Stok Tidak Mencukupi',
                html: `
                    <p>Beberapa produk memiliki stok yang tidak mencukupi:</p>
                    <ul class="text-left mt-2">
                        ${invalidItems.map(item => {
                    const product = item.product || item;
                    const productId = item.productId || item.id;
                    const availableStock = productStock[productId] || 0;
                    return `<li>• ${product.name}: Diminta ${item.qty}, Tersedia ${availableStock}</li>`;
                }).join('')}
                    </ul>
                    <p class="mt-2">Silakan sesuaikan jumlah produk sebelum melanjutkan.</p>
                `,
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Anda belum login',
                text: 'Silakan login terlebih dahulu untuk melanjutkan ke checkout.',
                confirmButtonText: 'Login',
                showCancelButton: true,
                cancelButtonText: 'Batal',
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#6b7280',
                customClass: {
                    popup: 'rounded-2xl'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login";
                }
            });
            return;
        }
        window.location.href = "/checkout";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat keranjang...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                            Keranjang Belanja
                        </h1>
                        <p className="text-green-100">
                            Review produk pilihan Anda sebelum checkout
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    1
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Keranjang</span>
                            </div>
                            <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-semibold">
                                    2
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Checkout</span>
                            </div>
                            <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-semibold">
                                    3
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Konfirmasi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {cart.length === 0 ? (
                    // Empty Cart State
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-6">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Keranjang Anda Kosong
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Belum ada produk di keranjang. Mari mulai berbelanja produk herbal HPAI terbaik!
                        </p>
                        <Link
                            href="/product"
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Produk ({cart.length} item)
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {cart.map((item) => {
                                        const product = item.product || item;
                                        const productId = item.productId || item.id;
                                        const availableStock = productStock[productId] || 0;

                                        return (
                                            <CartItem
                                                key={item.id}
                                                item={item}
                                                product={product}
                                                availableStock={availableStock}
                                                onQtyChange={handleQtyChange}
                                                onRemove={handleRemove}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                                    Ringkasan Pesanan
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal ({cart.length} item)</span>
                                        <span>Rp {total.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Ongkos Kirim</span>
                                        <span>Dihitung saat checkout</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white">
                                            <span>Total</span>
                                            <span>Rp {total.toLocaleString("id-ID")}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Lanjut ke Checkout
                                </button>

                                <Link
                                    href="/product"
                                    className="w-full mt-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tambah Produk Lain
                                </Link>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="text-green-500">🔒</span>
                                            <span>Transaksi 100% Aman</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="text-green-500">🚚</span>
                                            <span>Pengiriman ke Seluruh Indonesia</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="text-green-500">✅</span>
                                            <span>Produk Original HPAI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Cart Item Component
function CartItem({ item, product, onQtyChange, onRemove }) {
    const [qty, setQty] = useState(item.qty);

    const handleQtyUpdate = (newQty) => {
        if (newQty < 1) return;
        setQty(newQty);
        onQtyChange(item.id, newQty);
    };

    return (
        <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                    <img
                        src={
                            product.imageUrl?.startsWith("http")
                                ? product.imageUrl
                                : `http://localhost:5000${product.imageUrl || ""}`
                        }
                        alt={product.name || "Produk"}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {product.name || "Produk"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {product.description ? product.description.substring(0, 100) + "..." : "Produk herbal HPAI berkualitas"}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Price */}
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            Rp {(product.price || 0).toLocaleString("id-ID")}
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex items-center gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                <button
                                    onClick={() => handleQtyUpdate(qty - 1)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 rounded-l-lg"
                                    disabled={qty <= 1}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={qty}
                                    onChange={(e) => handleQtyUpdate(parseInt(e.target.value) || 1)}
                                    className="w-16 px-3 py-2 text-center border-0 focus:ring-0 dark:bg-transparent dark:text-white"
                                />
                                <button
                                    onClick={() => handleQtyUpdate(qty + 1)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 rounded-r-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => onRemove(item.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                                title="Hapus dari keranjang"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-3 text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal: </span>
                        <span className="text-lg font-semibold text-gray-800 dark:text-white">
                            Rp {((product.price || 0) * qty).toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}