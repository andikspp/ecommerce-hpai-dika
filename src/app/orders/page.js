"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Ambil userId dari token JWT di localStorage
                const token = localStorage.getItem("token");
                let userId = null;
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split(".")[1]));
                        userId = payload.id;
                    } catch { }
                }
                if (!userId) {
                    console.error("User tidak ditemukan atau belum login.");
                    setOrders([]);
                    setLoading(false);
                    return;
                }

                // Kirim userId sebagai query param
                const response = await axios.get(`/api/order?userId=${userId}`);
                if (response.data && Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.error("Data pesanan tidak valid:", response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Gagal memuat pesanan:", err);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    function renderStatus(status) {
        const statusConfig = {
            pending: {
                label: "Menunggu Konfirmasi",
                bg: "bg-amber-100 dark:bg-amber-900/30",
                text: "text-amber-800 dark:text-amber-300",
                icon: "⏳"
            },
            accepted: {
                label: "Dikonfirmasi",
                bg: "bg-green-100 dark:bg-green-900/30",
                text: "text-green-800 dark:text-green-300",
                icon: "✅"
            },
            rejected: {
                label: "Ditolak",
                bg: "bg-red-100 dark:bg-red-900/30",
                text: "text-red-800 dark:text-red-300",
                icon: "❌"
            },
            shipped: {
                label: "Dikirim",
                bg: "bg-blue-100 dark:bg-blue-900/30",
                text: "text-blue-800 dark:text-blue-300",
                icon: "🚚"
            },
            delivered: {
                label: "Selesai",
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                text: "text-emerald-800 dark:text-emerald-300",
                icon: "📦"
            }
        };

        const config = statusConfig[status] || {
            label: status.charAt(0).toUpperCase() + status.slice(1),
            bg: "bg-gray-100 dark:bg-gray-700",
            text: "text-gray-800 dark:text-gray-300",
            icon: "📋"
        };

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                <span>{config.icon}</span>
                {config.label}
            </span>
        );
    }

    function formatDate(dateStr) {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    // Filter orders based on status
    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(order => order.status === filterStatus);

    // Get order statistics
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === "pending").length,
        accepted: orders.filter(o => o.status === "accepted").length,
        shipped: orders.filter(o => o.status === "shipped").length,
        delivered: orders.filter(o => o.status === "delivered").length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat pesanan...</p>
                </div>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center text-white">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                Pesanan Saya
                            </h1>
                            <p className="text-green-100">
                                Pantau status dan riwayat pesanan Anda
                            </p>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex items-center justify-center py-20">
                    <div className="text-center bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 max-w-md mx-4">
                        <div className="text-6xl mb-6">📦</div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Belum Ada Pesanan
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Anda belum memiliki pesanan. Mari mulai berbelanja produk herbal HPAI terbaik!
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
                            Pesanan Saya
                        </h1>
                        <p className="text-green-100">
                            Pantau status dan riwayat pesanan Anda
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Pesanan</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Menunggu</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Dikonfirmasi</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.shipped}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Dikirim</div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">{stats.delivered}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Selesai</div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: "all", label: "Semua", count: stats.total },
                            { key: "pending", label: "Menunggu", count: stats.pending },
                            { key: "accepted", label: "Dikonfirmasi", count: stats.accepted },
                            { key: "shipped", label: "Dikirim", count: stats.shipped },
                            { key: "delivered", label: "Selesai", count: stats.delivered },
                            { key: "rejected", label: "Ditolak", count: orders.filter(o => o.status === "rejected").length }
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setFilterStatus(filter.key)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${filterStatus === filter.key
                                        ? "bg-green-600 text-white shadow-lg"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        No. Pesanan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        No. Resi
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredOrders.map((order, index) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                                                #{order.noOrder || order.orderId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Rp {order.total?.toLocaleString("id-ID")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStatus(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {order.resiNumber || (
                                                    <span className="text-gray-400 italic">Belum tersedia</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Link
                                                href={`/order-confirmation?id=${order.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden p-4">
                        <div className="space-y-4">
                            {filteredOrders.map((order, index) => (
                                <div key={order.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                                                #{order.noOrder || order.orderId}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        {renderStatus(order.status)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Rp {order.total?.toLocaleString("id-ID")}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">No. Resi</div>
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {order.resiNumber || (
                                                    <span className="text-gray-400 italic">Belum tersedia</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/order-confirmation?id=${order.id}`}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Lihat Detail Pesanan
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* No Results */}
                    {filteredOrders.length === 0 && filterStatus !== "all" && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-4xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Tidak ada pesanan
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tidak ada pesanan dengan status yang dipilih
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 text-center">
                    <Link
                        href="/product"
                        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Belanja Lagi
                    </Link>
                </div>
            </div>
        </div>
    );
}