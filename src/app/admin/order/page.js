"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
    FaSearch,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaTimes,
    FaShippingFast,
    FaFilter,
    FaEye,
    FaUserCircle,
    FaMapMarkerAlt,
    FaBoxOpen,
    FaCalendarAlt,
    FaDollarSign
} from "react-icons/fa";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showResiModal, setShowResiModal] = useState(false);
    const [resi, setResi] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                window.location.href = "/admin/login";
            } else {
                setIsChecking(false);
                fetchOrders();
            }
        }
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("/api/orders");
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch {
            setOrders([]);
        }
        setLoading(false);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    function renderStatus(status) {
        const statusConfig = {
            pending: {
                icon: FaClock,
                text: "Menunggu Konfirmasi",
                className: "bg-yellow-100 text-yellow-800 border-yellow-200"
            },
            accepted: {
                icon: FaCheckCircle,
                text: "Dikonfirmasi",
                className: "bg-blue-100 text-blue-800 border-blue-200"
            },
            rejected: {
                icon: FaTimesCircle,
                text: "Ditolak",
                className: "bg-red-100 text-red-800 border-red-200"
            },
            shipped: {
                icon: FaShippingFast,
                text: "Dikirim",
                className: "bg-purple-100 text-purple-800 border-purple-200"
            },
            delivered: {
                icon: FaCheckCircle,
                text: "Selesai",
                className: "bg-green-100 text-green-800 border-green-200"
            }
        };

        const config = statusConfig[status] || {
            icon: FaClock,
            text: status,
            className: "bg-gray-100 text-gray-800 border-gray-200"
        };

        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
                <IconComponent className="w-3 h-3" />
                {config.text}
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

    const filteredOrders = orders.filter(order => {
        const matchesSearch = (order.noOrder || order.id || "").toString().toLowerCase().includes(search.toLowerCase()) ||
            (order.user?.name || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDetail = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleAction = async (status) => {
        if (!selectedOrder) return;
        setActionLoading(true);
        try {
            if (status === "shipped") {
                setModalOpen(false);
                setShowResiModal(true);
                setActionLoading(false);
                return;
            }
            await axios.put(`/api/orders/${selectedOrder.id}/status`, { status });
            setOrders(orders =>
                orders.map(o => o.id === selectedOrder.id ? { ...o, status } : o)
            );
            setSelectedOrder({ ...selectedOrder, status });
            setModalOpen(false);
        } catch (err) {
            alert("Gagal memperbarui status pesanan.");
        }
        setActionLoading(false);
    };

    const handleSubmitResi = async (e) => {
        e.preventDefault();
        if (!resi) return;
        setActionLoading(true);
        try {
            await axios.put(`/api/orders/${selectedOrder.id}/status`, { status: "shipped", resi });
            setOrders(orders =>
                orders.map(o => o.id === selectedOrder.id ? { ...o, status: "shipped", resi } : o)
            );
            setSelectedOrder({ ...selectedOrder, status: "shipped", resi });
            setShowResiModal(false);
            setResi("");
        } catch (err) {
            alert("Gagal menginput nomor resi.");
        }
        setActionLoading(false);
    };

    const handleSubmitReject = async (e) => {
        e.preventDefault();
        if (!rejectReason) return;
        setActionLoading(true);
        try {
            await axios.put(`/api/orders/${selectedOrder.id}/status`, { status: "rejected", reason: rejectReason });
            setOrders(orders =>
                orders.map(o => o.id === selectedOrder.id ? { ...o, status: "rejected", reason: rejectReason } : o)
            );
            setSelectedOrder({ ...selectedOrder, status: "rejected", reason: rejectReason });
            setShowRejectModal(false);
            setRejectReason("");
        } catch (err) {
            alert("Gagal menolak pesanan.");
        }
        setActionLoading(false);
    };

    const getStatusCount = (status) => {
        return orders.filter(order => order.status === status).length;
    };

    if (isChecking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Memuat data Pesanan...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            <AdminSidebar handleLogout={handleLogout} />

            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Kelola Pesanan
                    </h1>
                </div>

                {/* Status Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pesanan</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                            </div>
                            <FaBoxOpen className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Menunggu Konfirmasi</p>
                                <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
                            </div>
                            <FaClock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Terkonfirmasi</p>
                                <p className="text-2xl font-bold text-blue-600">{getStatusCount('accepted')}</p>
                            </div>
                            <FaCheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dalam Pengiriman</p>
                                <p className="text-2xl font-bold text-purple-600">{getStatusCount('shipped')}</p>
                            </div>
                            <FaShippingFast className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Selesai</p>
                                <p className="text-2xl font-bold text-green-600">{getStatusCount('delivered')}</p>
                            </div>
                            <FaCheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari Pesanan atau Customer..."
                                    className="w-full md:w-80 px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <div className="relative">
                                <select
                                    className="w-full md:w-auto px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="pending">Menunggu Konfirmasi</option>
                                    <option value="accepted">Terkonfirmasi</option>
                                    <option value="shipped">Terkirim</option>
                                    <option value="delivered">Selesai</option>
                                    <option value="rejected">Ditolak</option>
                                </select>
                                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Menampilkan {filteredOrders.length} dari {orders.length} pesanan
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Detail Pesanan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Nama Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <FaBoxOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No orders found</h3>
                                                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        #{order.noOrder || order.id}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <FaCalendarAlt className="w-3 h-3" />
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {order.user?.name || "Guest"}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {order.user?.email || "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <FaDollarSign className="w-3 h-3 text-green-600" />
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Rp {order.total?.toLocaleString("id-ID")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderStatus(order.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleDetail(order)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                    Lihat Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Detail Pesanan */}
            {modalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Pesanan</h2>
                                <button
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModalOpen(false)}
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informasi Pesanan</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">#{selectedOrder.noOrder || selectedOrder.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Tanggal:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedOrder.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                            {renderStatus(selectedOrder.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informasi Pelanggan</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Nama:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.user?.name || "Guest"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.user?.email || "-"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-green-600" />
                                    Alamat Pengiriman
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <p className="text-gray-900 dark:text-white">{selectedOrder.address}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {[selectedOrder.kelurahan, selectedOrder.kecamatan, selectedOrder.kota, selectedOrder.provinsi].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Item Pesanan</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items?.length > 0 ? (
                                        selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                <div>
                                                    <span className="font-medium text-gray-900 dark:text-white">{item.product?.name || "Product"}</span>
                                                    <span className="text-gray-600 dark:text-gray-400 ml-2">x{item.qty}</span>
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    Rp {(item.price * item.qty).toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 italic">Item tidak ditemukan.</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Ongkir:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {selectedOrder.ongkir !== undefined
                                            ? `Rp ${selectedOrder.ongkir.toLocaleString('id-ID')}`
                                            : 'Free'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-gray-900 dark:text-white">Total:</span>
                                    <span className="text-green-600">Rp {selectedOrder.total?.toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {selectedOrder.status === "pending" && (
                                    <>
                                        <button
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                            onClick={() => handleAction("accepted")}
                                            disabled={actionLoading}
                                        >
                                            Terima Pesanan
                                        </button>
                                        <button
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                            onClick={() => {
                                                setModalOpen(false);
                                                setShowRejectModal(true);
                                            }}
                                            disabled={actionLoading}
                                        >
                                            Tolak Pesanan
                                        </button>
                                    </>
                                )}
                                {selectedOrder.status === "accepted" && (
                                    <button
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        onClick={() => handleAction("shipped")}
                                        disabled={actionLoading}
                                    >
                                        Kirim Pesanan
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Input Resi */}
            {showResiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <form
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
                        onSubmit={handleSubmitResi}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tambah Nomor Resi</h2>
                            <button
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setShowResiModal(false)}
                                type="button"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nomor Resi
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Masukkan nomor resi pengiriman"
                                    value={resi}
                                    onChange={e => setResi(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Mengirim..." : "Kirim"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal Reject Order */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <form
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
                        onSubmit={handleSubmitReject}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Tolak Pesanan</h2>
                            <button
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setShowRejectModal(false)}
                                type="button"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Alasan Penolakan
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Masukkan alasan penolakan pesanan"
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    required
                                    rows={4}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Memproses..." : "Tolak Pesanan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}