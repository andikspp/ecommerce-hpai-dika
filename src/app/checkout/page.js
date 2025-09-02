"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [shippingMethod, setShippingMethod] = useState("jne");
    const [ongkir, setOngkir] = useState(20000);
    const [total, setTotal] = useState(0);
    const [note, setNote] = useState("");
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
            } else {
                setLoading(false);
            }
        }

        // Ambil cart dari localStorage
        let localCart = [];
        try {
            localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        } catch {
            localCart = [];
        }
        setCart(localCart);
        if (localCart.length > 0) {
            // Hitung total dari localCart
            setTotal(localCart.reduce((sum, item) => {
                const price = item.price !== undefined ? item.price : (item.product?.price || 0);
                return sum + (price * item.qty);
            }, 0));
            setLoading(false);
        } else {
            // Jika cart kosong di localStorage, ambil total dari server
            const token = localStorage.getItem("token");
            if (token) {
                const userId = JSON.parse(atob(token.split('.')[1])).id; // Ambil userId dari token
                console.log("Fetching cart total for userId:", userId);
                axios.get(`/api/cart?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((res) => {
                        const cartData = res.data.cart || [];
                        setCart(cartData);
                        setTotal(cartData.reduce((sum, item) => sum + (item.price * item.qty), 0));
                        setLoading(false);
                    })
                    .catch(() => {
                        setTotal(0);
                        setCart([]);
                        setLoading(false);
                    });
            } else {
                console.log("No token found, setting empty cart and total");
                setTotal(0);
                setCart([]);
                setLoading(false);
            }
        }
        // Ambil user dari token jika ada (tetap seperti sebelumnya)
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    setUser(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setUser(null);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // skrip snap midtrans
    useEffect(() => {
        if (!window.snap) {
            const script = document.createElement("script");
            script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute("data-client-key", "Mid-client-65HdGI2I5ScM9V8C"); // Ganti dengan client key sandbox Anda
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleBayar = async () => {
        try {
            // Show loading with SweetAlert
            Swal.fire({
                title: 'Memproses Pembayaran...',
                html: 'Mohon tunggu sebentar',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Kirim data order ke backend untuk generate snapToken
            const res = await axios.post("/api/create-transaction", {
                cart,
                user,
                ongkir,
                total: total + (ongkir || 0),
                shippingMethod,
                // Tambahkan data lain jika perlu
            });
            const { snapToken } = res.data;

            // Close loading
            Swal.close();

            // Tampilkan modal Snap
            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    try {
                        console.log("Payment success:", result);
                        const orderData = {
                            shippingMethod,
                            note: note || "",
                            userId: user?.id || null,
                            noOrder: `ORDER-${user.id}-${Date.now()}`,
                            ongkir: ongkir || 0,
                            total: total + (ongkir || 0),
                            address: user?.alamat || "",
                            kelurahan: user?.kelurahan || "",
                            kecamatan: user?.kecamatan || "",
                            kota: user?.kota || "",
                            provinsi: user?.provinsi || "",
                            paymentMethod: null,
                            paymentStatus: "paid",
                            paymentTime: new Date().toISOString(),
                            paymentId: null,
                            snapToken: snapToken,
                            status: "pending",
                            items: cart.map(item => ({
                                productId: item.productId || (item.product && item.product.id) || item.id,
                                qty: item.qty,
                                price: item.price || (item.product && item.product.price) || 0,
                            })),
                        }
                        console.log("Order data to create:", orderData);

                        Swal.fire({
                            icon: 'success',
                            title: 'Pembayaran Berhasil!',
                            text: 'Sedang membuat pesanan...',
                            timer: 2000,
                            showConfirmButton: false
                        });

                        axios.post("/api/order", orderData)
                            .then((response) => {
                                console.log("Order created successfully:", response.data);
                                localStorage.setItem("lastOrder", JSON.stringify(response.data));
                                localStorage.removeItem("cart");
                                // Redirect ke halaman konfirmasi atau sukses
                                window.location.href = "/order-confirmation";
                            })
                            .catch((error) => {
                                console.error("Error creating order:", error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Gagal!',
                                    text: 'Gagal membuat order. Silakan coba lagi.',
                                });
                            });
                    } catch (error) {
                        console.error("Error handling payment success:", error);
                    }
                },
                onPending: function (result) {
                    console.log("Payment pending:", result);
                    Swal.fire({
                        icon: "info",
                        title: "Pembayaran Tertunda",
                        text: "Silakan selesaikan pembayaran Anda.",
                        confirmButtonColor: '#16a34a'
                    });
                },
                onError: function (result) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Pembayaran Gagal',
                        text: 'Silakan coba lagi.',
                        confirmButtonColor: '#16a34a'
                    });
                },
                onClose: function () {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Pembayaran Dibatalkan',
                        text: 'Anda belum menyelesaikan pembayaran.',
                        confirmButtonColor: '#16a34a'
                    });
                }
            });
        } catch (err) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal memproses pembayaran. Silakan coba lagi.',
                confirmButtonColor: '#16a34a'
            });
        }
    };

    const shippingOptions = [
        { value: "jne", label: "JNE", icon: "🚚", desc: "Reguler 2-3 hari" },
        { value: "jnt", label: "J&T Express", icon: "📦", desc: "Ekonomi 3-4 hari" },
        { value: "sicepat", label: "SiCepat", icon: "⚡", desc: "BEST 1-2 hari" },
        { value: "anteraja", label: "AnterAja", icon: "🛵", desc: "Reguler 2-4 hari" },
        { value: "pos", label: "POS Indonesia", icon: "📮", desc: "Kilat 2-3 hari" }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat checkout...</p>
                </div>
            </div>
        );
    }

    if (!cart.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 max-w-md mx-4">
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Keranjang Kosong
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Silakan tambahkan produk ke keranjang terlebih dahulu
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
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 text-white">
                        <Link
                            href="/cart"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold">
                                Checkout
                            </h1>
                            <p className="text-green-100 mt-1">
                                Konfirmasi pesanan dan selesaikan pembayaran
                            </p>
                        </div>
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
                                    ✓
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Keranjang</span>
                            </div>
                            <div className="w-12 h-0.5 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    2
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Checkout</span>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Alamat Pengiriman</h2>
                                        <p className="text-green-100 text-sm">Informasi penerima dan alamat tujuan</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user.name || "Guest"}</h3>
                                                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                                                {user.alamat && (
                                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <p className="text-gray-900 dark:text-white font-medium">{user.alamat}</p>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                            {[user.kelurahan, user.kecamatan, user.kota, user.provinsi].filter(Boolean).join(", ")}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <Link
                                                href="/profile/edit"
                                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                        {!user.alamat && (
                                            <div className="p-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.992-.833-2.762 0L3.052 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                                                        Alamat belum lengkap. <Link href="/profile/edit" className="font-medium underline">Lengkapi sekarang</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">Informasi pengguna tidak tersedia</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Metode Pengiriman</h2>
                                        <p className="text-blue-100 text-sm">Pilih layanan pengiriman yang diinginkan</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {shippingOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${shippingMethod === option.value
                                                ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                                                : "border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={option.value}
                                                checked={shippingMethod === option.value}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center gap-3 flex-1">
                                                <span className="text-2xl">{option.icon}</span>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">{option.label}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</div>
                                                </div>
                                            </div>
                                            {shippingMethod === option.value && (
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Notes */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Catatan Pesanan</h2>
                                        <p className="text-purple-100 text-sm">Tambahkan catatan untuk penjual (opsional)</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
                                    placeholder="Contoh: Tolong kirim secepatnya, atau warna kemasan yang diinginkan..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>
                                            <p className="text-green-100 text-sm">{cart.length} item dalam keranjang</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Items List */}
                                    <div className="space-y-4 mb-6">
                                        {cart.map((item) => {
                                            const product = item.product || item;
                                            return (
                                                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                    <img
                                                        src={product.imageUrl?.startsWith("http") ? product.imageUrl : `http://localhost:5000${product.imageUrl || ""}`}
                                                        alt={product.name || "Produk"}
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{product.name || "Produk"}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.qty}</p>
                                                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                                            Rp {(product.price * item.qty).toLocaleString("id-ID")}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                Rp {total.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Ongkos Kirim</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {ongkir === null ? (
                                                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-16 rounded"></div>
                                                ) : (
                                                    `Rp ${ongkir.toLocaleString('id-ID')}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-900 dark:text-white">Total Bayar</span>
                                            <span className="text-green-600 dark:text-green-400">
                                                Rp {(total + (ongkir || 0)).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Payment Button */}
                                    <button
                                        onClick={handleBayar}
                                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Bayar Sekarang
                                    </button>

                                    <div className="mt-4 text-center">
                                        <Link
                                            href="/cart"
                                            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center justify-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Kembali ke Keranjang
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <div>
                                        <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                                            Pembayaran Aman
                                        </p>
                                        <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                                            Transaksi dilindungi dengan enkripsi SSL dan diproses melalui Midtrans
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}