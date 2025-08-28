"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function OrderConfirmationPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                try {
                    const res = await axios.get(`/api/order?id=${orderId}`);
                    if (res.data) setOrder(res.data);
                    console.log("Order fetched successfully:", res.data);
                } catch (err) {
                    setOrder(null);
                }
            } else {
                const lastOrder = localStorage.getItem("lastOrder");
                if (lastOrder) setOrder(JSON.parse(lastOrder));
            }
            setLoading(false);
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat konfirmasi pesanan...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
                    <div className="text-6xl mb-6">❌</div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Pesanan Tidak Ditemukan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Silakan periksa kembali link pesanan Anda
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    // Status configurations
    const getStatusConfig = () => {
        if (order.paymentStatus === "pending") {
            return {
                icon: "⏳",
                title: "Menunggu Pembayaran",
                message: "Silakan selesaikan pembayaran Anda untuk memproses pesanan",
                bgGradient: "from-amber-500 to-orange-500",
                cardBg: "bg-amber-50 dark:bg-amber-900/30",
                textColor: "text-amber-800 dark:text-amber-200",
                showDetail: true,
                animation: "animate-pulse"
            };
        } else if (order.paymentStatus === "failed" || order.paymentStatus === "expired") {
            return {
                icon: "❌",
                title: "Pembayaran Gagal",
                message: "Pembayaran Anda gagal atau kadaluarsa. Silakan coba lagi",
                bgGradient: "from-red-500 to-pink-500",
                cardBg: "bg-red-50 dark:bg-red-900/30",
                textColor: "text-red-800 dark:text-red-200",
                showDetail: false,
                animation: "animate-bounce"
            };
        } else if (order.paymentStatus === "paid" && order.status === "shipped") {
            return {
                icon: "🚚",
                title: "Pesanan Sedang Dikirim",
                message: "Pesanan Anda sedang dalam perjalanan",
                bgGradient: "from-green-500 to-purple-500",
                cardBg: "bg-blue-50 dark:bg-blue-900/30",
                textColor: "text-blue-800 dark:text-blue-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        } else if (order.paymentStatus === "paid" && order.status === "delivered") {
            return {
                icon: "📦",
                title: "Pesanan Selesai",
                message: "Pesanan Anda telah sampai di tujuan",
                bgGradient: "from-emerald-500 to-green-500",
                cardBg: "bg-emerald-50 dark:bg-emerald-900/30",
                textColor: "text-emerald-800 dark:text-emerald-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        } else if (order.paymentStatus === "paid" && order.status === "rejected") {
            return {
                icon: "🚫",
                title: "Pesanan Ditolak",
                message: `Mohon maaf, pesanan ditolak: ${order.rejectedReason || 'Alasan tidak tersedia'}`,
                bgGradient: "from-red-500 to-pink-500",
                cardBg: "bg-red-50 dark:bg-red-900/30",
                textColor: "text-red-800 dark:text-red-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        } else {
            return {
                icon: "✅",
                title: "Pesanan Berhasil!",
                message: "Terima kasih! Pesanan Anda telah diterima dan sedang diproses",
                bgGradient: "from-green-500 to-emerald-500",
                cardBg: "bg-green-50 dark:bg-green-900/30",
                textColor: "text-green-800 dark:text-green-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Header */}
            <div className={`bg-gradient-to-r ${statusConfig.bgGradient} py-12`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                            Konfirmasi Pesanan
                        </h1>
                        <p className="text-white/90">
                            Status dan detail pesanan Anda
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
                                    ✓
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Keranjang</span>
                            </div>
                            <div className="w-12 h-0.5 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    ✓
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Checkout</span>
                            </div>
                            <div className="w-12 h-0.5 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    3
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Konfirmasi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

                {/* Status Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className={`bg-gradient-to-r ${statusConfig.bgGradient} px-8 py-12 text-center text-white relative overflow-hidden`}>
                        {/* Background decorations */}
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10">
                            <div className={`text-6xl mb-6 ${statusConfig.animation}`}>
                                {statusConfig.icon}
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                {statusConfig.title}
                            </h2>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
                                {statusConfig.message}
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
                                <p className="text-sm font-medium">Nomor Pesanan</p>
                                <p className="text-xl font-bold">
                                    {order.noOrder || order.orderId || order.id || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    {statusConfig.showDetail && (
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">

                                {/* Order Info */}
                                <div className={`${statusConfig.cardBg} rounded-2xl p-6`}>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Informasi Pesanan
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-gray-600 dark:text-gray-400">Tanggal Pemesanan</span>
                                            <span className="font-semibold text-gray-800 dark:text-white">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric"
                                                }) : (order.date || '-')}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-gray-600 dark:text-gray-400">Status Pembayaran</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                order.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {order.paymentStatus === 'paid' ? 'Lunas' :
                                                    order.paymentStatus === 'pending' ? 'Menunggu' : 'Gagal'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-gray-600 dark:text-gray-400">Status Pesanan</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    order.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                        order.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                                }`}>
                                                {order.status === 'delivered' ? 'Selesai' :
                                                    order.status === 'shipped' ? 'Dikirim' :
                                                        order.status === 'accepted' ? 'Dikonfirmasi' :
                                                            order.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                            </span>
                                        </div>

                                        {order.status === 'shipped' && (
                                            <>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                                    <span className="text-gray-600 dark:text-gray-400">Jasa Pengiriman</span>
                                                    <span className="font-semibold text-gray-800 dark:text-white">
                                                        {order.shippingMethod?.toUpperCase() || '-'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-gray-600 dark:text-gray-400">No. Resi</span>
                                                    <span className="font-mono font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {order.resiNumber || '-'}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className={`${statusConfig.cardBg} rounded-2xl p-6`}>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Ringkasan Pesanan
                                    </h3>

                                    {/* Items */}
                                    <div className="space-y-3 mb-6">
                                        {order.items?.length > 0 ? order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                                <div className="flex-1">
                                                    <span className="text-gray-800 dark:text-white font-medium">
                                                        {item.product?.name || 'Produk'}
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                                                        x{item.qty}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-gray-800 dark:text-white">
                                                    Rp {(item.price * item.qty).toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        )) : (
                                            <div className="text-gray-400 italic text-center py-4">
                                                Detail item tidak tersedia
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Subtotal</span>
                                            <span>
                                                Rp {((order.total || 0) - (order.ongkir || 0)).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Ongkos Kirim</span>
                                            <span>
                                                {order.ongkir !== undefined
                                                    ? `Rp ${order.ongkir.toLocaleString('id-ID')}`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                                            <span>Total Bayar</span>
                                            <span className="text-green-600 dark:text-green-400">
                                                Rp {order.total?.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Kembali ke Beranda
                    </Link>

                    <Link
                        href="/orders"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Lihat Semua Pesanan
                    </Link>

                    <Link
                        href="/product"
                        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Belanja Lagi
                    </Link>
                </div>

                {/* Help Section */}
                <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">Butuh Bantuan?</h3>
                    </div>
                    <p className="text-blue-600 dark:text-blue-300 mb-4">
                        Tim customer service kami siap membantu Anda 24/7
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="https://wa.me/6282294317043"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.148z" />
                            </svg>
                            WhatsApp
                        </a>
                        <a
                            href="mailto:support@hpai.com"
                            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}