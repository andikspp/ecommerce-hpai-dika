"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function OrderConfirmationPage() {
    const [order, setOrder] = useState(null);
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                // Ambil order dari backend berdasarkan id
                try {
                    const res = await axios.get(`/api/order?id=${orderId}`);
                    if (res.data) setOrder(res.data);
                    console.log("Order fetched successfully:", res.data);
                } catch (err) {
                    setOrder(null);
                }
            } else {
                // Fallback: ambil dari localStorage
                const lastOrder = localStorage.getItem("lastOrder");
                if (lastOrder) setOrder(JSON.parse(lastOrder));
            }
        };
        fetchOrder();
    }, [orderId]);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Pesanan Tidak Ditemukan</h1>
                    <p className="text-gray-600 dark:text-gray-400">Silakan coba lagi.</p>
                    <Link href="/" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    // Tentukan tampilan berdasarkan paymentStatus
    let statusIcon = <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-4 animate-bounce" />;
    let statusTitle = "Pesanan Berhasil!";
    let statusMessage = (
        <>
            Terima kasih, pesanan Anda telah diterima dan sedang diproses.<br />
            Nomor pesanan: <span className="font-semibold">{order.noOrder || '-'}</span>
        </>
    );
    let showOrderDetail = true;

    if (order.paymentStatus === "pending") {
        statusIcon = <FaClock className="mx-auto text-yellow-500 text-6xl mb-4 animate-pulse" />;
        statusTitle = "Menunggu Pembayaran";
        statusMessage = (
            <>
                Silakan selesaikan pembayaran Anda untuk memproses pesanan.<br />
                Nomor pesanan: <span className="font-semibold">{order.id || order.orderId || '-'}</span>
            </>
        );
    } else if (order.paymentStatus === "failed" || order.paymentStatus === "expired") {
        statusIcon = <FaTimesCircle className="mx-auto text-red-500 text-6xl mb-4" />;
        statusTitle = "Pembayaran Gagal";
        statusMessage = (
            <>
                Pembayaran Anda gagal atau kadaluarsa.<br />
                Nomor pesanan: <span className="font-semibold">{order.id || order.orderId || '-'}</span>
            </>
        );
        showOrderDetail = false;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4">
            <div className="bg-white dark:bg-green-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
                {statusIcon}
                <h1 className="text-3xl font-bold mb-2"
                    style={{ color: order.paymentStatus === "pending" ? "#d97706" : order.paymentStatus === "failed" || order.paymentStatus === "expired" ? "#dc2626" : "#15803d" }}>
                    {statusTitle}
                </h1>
                <p className="mb-6 text-green-800 dark:text-green-200">{statusMessage}</p>
                {showOrderDetail && (
                    <div className="bg-green-50 dark:bg-green-800 rounded-xl p-4 mb-6 text-left">
                        <div className="mb-2 flex justify-between">
                            <span className="font-semibold">Tanggal</span>
                            <span>{order.createdAt ? new Date(order.createdAt).toLocaleString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                            }) : (order.date || '-')}</span>
                        </div>
                        <div className="mb-2 font-semibold">Ringkasan Pesanan:</div>
                        <ul className="mb-2">
                            {order.items?.length > 0 ? order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span>{item.product?.name || 'Produk'} x{item.qty}</span>
                                    <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                                </li>
                            )) : (
                                <li className="italic text-gray-400">Tidak ada detail item.</li>
                            )}
                        </ul>
                        <div className="flex justify-between items-center text-base font-semibold mt-2">
                            <span>Ongkir</span>
                            <span className="text-green-700 dark:text-green-200">
                                {order.ongkir !== undefined
                                    ? `Rp ${order.ongkir.toLocaleString('id-ID')}`
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-green-200 dark:border-green-700 pt-2 mt-2">
                            <span>Total</span>
                            <span>Rp {order.total?.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Kembali ke Beranda
                    </Link>
                    <Link
                        href="/orders"
                        className="bg-white border border-green-600 text-green-700 hover:bg-green-50 dark:bg-green-800 dark:text-green-100 dark:border-green-400 px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Lihat Pesanan Saya
                    </Link>
                </div>
            </div>
        </div>
    );
}