"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
    FaCheckCircle,
    FaShoppingBag,
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaCreditCard,
    FaBox,
    FaTruck,
    FaHome,
    FaWhatsapp,
    FaEnvelope,
    FaCopy,
    FaDownload
} from "react-icons/fa";

// Component yang menggunakan useSearchParams
function OrderConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError("Order ID tidak ditemukan");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                setError("Gagal memuat data pesanan");
                console.error("Error fetching order:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const copyOrderId = () => {
        navigator.clipboard.writeText(orderId);
        // You can add a toast notification here
    };

    const shareWhatsApp = () => {
        const message = `Halo! Saya telah melakukan pemesanan dengan ID: ${orderId}. Mohon bantuan untuk informasi lebih lanjut.`;
        const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const sendEmail = () => {
        const subject = `Konfirmasi Pesanan - ID: ${orderId}`;
        const body = `Halo,\n\nSaya telah melakukan pemesanan dengan detail:\n\nID Pesanan: ${orderId}\nTanggal: ${order ? formatDate(order.createdAt) : ''}\n\nMohon bantuan untuk informasi lebih lanjut.\n\nTerima kasih.`;
        const mailtoUrl = `mailto:support@hpai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Memuat Konfirmasi Pesanan...
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Mohon tunggu sebentar
                    </p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <FaBox className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Pesanan Tidak Ditemukan
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {error || "Pesanan yang Anda cari tidak dapat ditemukan."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                        <FaCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Pesanan Berhasil Dibuat!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Terima kasih atas pesanan Anda. Detail pesanan dan informasi pengiriman sudah dikirim ke email Anda.
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FaShoppingBag className="w-5 h-5 text-green-600" />
                                Ringkasan Pesanan
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                {order.status?.toUpperCase() || 'PENDING'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ID Pesanan</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
                                        #{orderId}
                                    </p>
                                    <button
                                        onClick={copyOrderId}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        title="Salin ID Pesanan"
                                    >
                                        <FaCopy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pesanan</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Produk yang Dipesan</h3>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                                        {item.product?.imageUrl ? (
                                            <img
                                                src={item.product.imageUrl.startsWith("http")
                                                    ? item.product.imageUrl
                                                    : `http://localhost:5000${item.product.imageUrl}`}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaBox className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {item.product?.name || 'Produk'}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Qty: {item.quantity} × {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {formatPrice(item.quantity * item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Pembayaran</span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatPrice(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaTruck className="w-5 h-5 text-blue-600" />
                            Alamat Pengiriman
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <FaUser className="w-4 h-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaPhone className="w-4 h-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300">{order.customerPhone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaCreditCard className="w-5 h-5 text-purple-600" />
                            Informasi Pembayaran
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Metode Pembayaran:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {order.paymentMethod || 'COD (Cash on Delivery)'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Status Pembayaran:</span>
                                <span className={`font-medium ${order.paymentStatus === 'paid'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-yellow-600 dark:text-yellow-400'}`}>
                                    {order.paymentStatus === 'paid' ? 'Lunas' : 'Menunggu Pembayaran'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {formatPrice(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Butuh Bantuan?</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={shareWhatsApp}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            <FaWhatsapp className="w-4 h-4" />
                            WhatsApp Support
                        </button>
                        <button
                            onClick={sendEmail}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <FaEnvelope className="w-4 h-4" />
                            Email Support
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <FaHome className="w-4 h-4" />
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mt-8">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Langkah Selanjutnya</h3>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                        <li className="flex items-start gap-2">
                            <span className="font-bold">1.</span>
                            <span>Kami akan menghubungi Anda dalam 1×24 jam untuk konfirmasi pesanan</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">2.</span>
                            <span>Pesanan akan diproses setelah konfirmasi dan pembayaran</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">3.</span>
                            <span>Anda akan mendapat nomor resi untuk tracking pengiriman</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">4.</span>
                            <span>Estimasi pengiriman 2-5 hari kerja (tergantung lokasi)</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// Loading component untuk fallback
function OrderConfirmationLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Memuat Konfirmasi Pesanan...
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Mohon tunggu sebentar
                </p>
            </div>
        </div>
    );
}

// Main component dengan Suspense wrapper
export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<OrderConfirmationLoading />}>
            <OrderConfirmationContent />
        </Suspense>
    );
}