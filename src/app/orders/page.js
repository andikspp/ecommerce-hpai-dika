"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/order");
                if (response.data && Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.error("Data pesanan tidak valid:", response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Gagal memuat pesanan:", err);
            }
        };
        fetchOrders();
    }, []);

    function renderStatus(status) {
        if (status === "pending") return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">Menunggu Konfirmasi</span>;
        if (status === "paid") return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Sudah Dibayar</span>;
        if (status === "failed" || status === "expired") return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">Gagal</span>;
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
                <div className="animate-pulse text-green-700 dark:text-green-100 text-xl font-semibold">Memuat pesanan...</div>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
                <div className="text-center bg-white dark:bg-green-900 rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-100">Belum ada pesanan</h2>
                    <Link href="/" className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition">Belanja Sekarang</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-10">
            <div className="max-w-5xl mx-auto bg-white dark:bg-green-900 rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-extrabold text-green-700 dark:text-green-100 mb-8 text-center tracking-tight">Pesanan Saya</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto rounded-xl overflow-hidden shadow">
                        <thead>
                            <tr className="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 uppercase text-xs">
                                <th className="px-6 py-4 text-left">No. Pesanan</th>
                                <th className="px-6 py-4 text-center">Tanggal & Waktu</th>
                                <th className="px-6 py-4 text-center">Total</th>
                                <th className="px-6 py-4 text-center">Status Pemesanan</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr
                                    key={order.id}
                                    className="border-b border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                >
                                    <td className="px-6 py-4 font-mono font-bold text-green-700 dark:text-green-200">{order.noOrder || order.orderId}</td>
                                    <td className="px-6 py-4 text-center text-green-900 dark:text-green-100">{formatDate(order.createdAt)}</td>
                                    <td className="px-6 py-4 text-center text-green-900 dark:text-green-100 font-semibold">Rp {order.total?.toLocaleString("id-ID")}</td>
                                    <td className="px-6 py-4 text-center">{renderStatus(order.status)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            href={`/order-confirmation?id=${order.id}`}
                                            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}