"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaTimes } from "react-icons/fa";
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/order");
                setOrders(Array.isArray(response.data) ? response.data : []);
            } catch {
                setOrders([]);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    function renderStatus(status) {
        if (status === "pending") return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaClock /> Menunggu Konfirmasi</span>;
        if (status === "accepted") return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaCheckCircle /> Diterima</span>;
        if (status === "rejected") return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaTimesCircle /> Ditolak</span>;
        if (status === "shipped") return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaCheckCircle /> Dikirim</span>;
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
    }

    function formatDate(dateStr) {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    const filteredOrders = orders.filter(order =>
        (order.noOrder || order.id || "").toString().toLowerCase().includes(search.toLowerCase()) ||
        (order.user?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    // Handler untuk buka modal detail
    const handleDetail = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    // Handler untuk aksi terima/tolak pesanan
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
            await axios.patch(`/api/order?id=${selectedOrder.id}`, { status });
            // Update status di list tanpa reload
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

    // Handler submit nomor resi
    const handleSubmitResi = async (e) => {
        e.preventDefault();
        if (!resi) return;
        setActionLoading(true);
        try {
            await axios.patch(`/api/order?id=${selectedOrder.id}`, { status: "shipped", resi });
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
            await axios.patch(`/api/order?id=${selectedOrder.id}`, { status: "rejected", reason: rejectReason });
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

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-green-100 to-green-300 dark:from-green-950 dark:to-green-800">
            <div className="h-screen sticky top-0 z-10">
                <AdminSidebar />
            </div>
            <main className="flex-1 px-4 py-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto bg-white dark:bg-green-900 rounded-2xl shadow-2xl p-8">
                    <h1 className="text-3xl font-extrabold text-green-700 dark:text-green-100 mb-8 text-center tracking-tight">Kelola Pesanan</h1>
                    <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-1/3">
                            <input
                                type="text"
                                placeholder="Cari No. Pesanan atau Nama Pembeli..."
                                className="w-full px-4 py-2 rounded-lg border border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" />
                        </div>
                        <span className="text-green-700 dark:text-green-100 font-semibold">{filteredOrders.length} pesanan</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full table-auto rounded-xl overflow-hidden shadow">
                            <thead>
                                <tr className="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 uppercase text-xs">
                                    <th className="px-6 py-4 text-left">No. Pesanan</th>
                                    <th className="px-6 py-4 text-center">Tanggal & Waktu</th>
                                    <th className="px-6 py-4 text-center">Pembeli</th>
                                    <th className="px-6 py-4 text-center">Total</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-400 dark:text-green-200">
                                            Tidak ada pesanan ditemukan.
                                        </td>
                                    </tr>
                                ) : filteredOrders.map(order => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-green-700 dark:text-green-200">{order.noOrder || order.id}</td>
                                        <td className="px-6 py-4 text-center text-green-900 dark:text-green-100">{formatDate(order.createdAt)}</td>
                                        <td className="px-6 py-4 text-center text-green-900 dark:text-green-100">{order.user?.name || "-"}</td>
                                        <td className="px-6 py-4 text-center text-green-900 dark:text-green-100 font-semibold">Rp {order.total?.toLocaleString("id-ID")}</td>
                                        <td className="px-6 py-4 text-center">{renderStatus(order.status)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDetail(order)}
                                                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {/* Modal Detail Pesanan */}
            {modalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-green-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
                        <button
                            className="absolute top-4 right-4 text-green-700 dark:text-green-100 hover:text-red-500"
                            onClick={() => setModalOpen(false)}
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-100">Detail Pesanan</h2>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">No. Pesanan</span>
                            <span>{selectedOrder.noOrder || selectedOrder.id}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Tanggal</span>
                            <span>{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Pembeli</span>
                            <span>{selectedOrder.user?.name || "-"}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Alamat</span>
                            <span>{selectedOrder.address}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Kelurahan</span>
                            <span>{selectedOrder.kelurahan || "-"}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Kecamatan</span>
                            <span>{selectedOrder.kecamatan || "-"}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Kota/Kabupaten</span>
                            <span>{selectedOrder.kota || "-"}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Provinsi</span>
                            <span>{selectedOrder.provinsi || "-"}</span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Status</span>
                            <span>{renderStatus(selectedOrder.status)}</span>
                        </div>
                        <div className="mb-2 font-semibold">Ringkasan Item:</div>
                        <ul className="mb-2">
                            {selectedOrder.items?.length > 0 ? selectedOrder.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span>{item.product?.name || "Produk"} x{item.qty}</span>
                                    <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                                </li>
                            )) : (
                                <li className="italic text-gray-400">Tidak ada detail item.</li>
                            )}
                        </ul>
                        <div className="flex justify-between items-center text-base font-semibold mt-2">
                            <span>Ongkir</span>
                            <span className="text-green-700 dark:text-green-200">
                                {selectedOrder.ongkir !== undefined
                                    ? `Rp ${selectedOrder.ongkir.toLocaleString('id-ID')}`
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-green-200 dark:border-green-700 pt-2 mt-2">
                            <span>Total</span>
                            <span>Rp {selectedOrder.total?.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex gap-4 mt-8 justify-center">
                            {selectedOrder.status === "accepted" && (
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                                    onClick={() => handleAction("shipped")}
                                    disabled={actionLoading}
                                >
                                    Kirim Pesanan
                                </button>
                            )}
                            {selectedOrder.status !== "accepted" && selectedOrder.status !== "shipped" && (
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                                    onClick={() => handleAction("accepted")}
                                    disabled={actionLoading}
                                >
                                    Konfirmasi Pesanan
                                </button>
                            )}
                            {selectedOrder.status !== "shipped" && (
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setShowRejectModal(true);
                                    }}
                                    disabled={actionLoading}
                                >
                                    Tolak Pesanan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Input Resi */}
            {showResiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <form
                        className="bg-white dark:bg-green-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
                        onSubmit={handleSubmitResi}
                    >
                        <button
                            className="absolute top-4 right-4 text-green-700 dark:text-green-100 hover:text-red-500"
                            onClick={() => setShowResiModal(false)}
                            type="button"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-100 text-center">Input Nomor Resi</h2>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 mb-6"
                            placeholder="Masukkan nomor resi pengiriman"
                            value={resi}
                            onChange={e => setResi(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                            disabled={actionLoading}
                        >
                            Simpan Resi
                        </button>
                    </form>
                </div>
            )}

            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <form
                        className="bg-white dark:bg-green-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
                        onSubmit={handleSubmitReject}
                    >
                        <button
                            className="absolute top-4 right-4 text-green-700 dark:text-green-100 hover:text-red-500"
                            onClick={() => setShowRejectModal(false)}
                            type="button"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-red-700 dark:text-red-200 text-center">Alasan Penolakan Pesanan</h2>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-red-300 dark:bg-green-800 dark:text-green-100 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-red-400 mb-6"
                            placeholder="Masukkan alasan penolakan pesanan"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            required
                            rows={3}
                        />
                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                            disabled={actionLoading}
                        >
                            Tolak Pesanan
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}