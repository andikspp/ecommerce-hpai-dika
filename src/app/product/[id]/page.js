"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [produk, setProduk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notif, setNotif] = useState("");

    useEffect(() => {
        const fetchProduk = async () => {
            try {
                const res = await axios.get(`/api/produk/${id}`);
                setProduk(res.data);
            } catch {
                setProduk(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduk();
    }, [id]);

    const handleAddToCart = () => {
        if (!produk) return;
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((item) => item.id === produk.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: produk.id,
                name: produk.name,
                price: produk.price,
                qty: 1,
                gambar: produk.gambar,
                imageUrl: produk.imageUrl,
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setNotif("Produk berhasil ditambahkan ke keranjang!");
        setTimeout(() => setNotif(""), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50 dark:bg-green-900">
                <span className="text-green-700 dark:text-green-100 text-xl font-semibold">Memuat detail produk...</span>
            </div>
        );
    }

    if (!produk) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-green-900">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Produk tidak ditemukan</h2>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-10">
            <div className="max-w-4xl mx-auto bg-white dark:bg-green-900 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0 flex flex-col items-center w-full md:w-1/2">
                    <img
                        src={
                            produk.gambar?.startsWith("http")
                                ? produk.gambar
                                : `http://localhost:5000${produk.imageUrl || produk.gambar}`
                        }
                        alt={produk.name}
                        className="w-64 h-64 object-cover rounded-xl border border-green-200 dark:border-green-700 bg-green-50 shadow"
                    />
                    <div className="mt-4 text-sm text-green-700 dark:text-green-200">
                        Stok: <span className="font-bold">{produk.stock ?? 0}</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-2">{produk.name}</h1>
                        <div className="mb-2">
                            <span className="inline-block bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-xs font-semibold">
                                {produk.category?.name || "Tanpa Kategori"}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
                            Rp {produk.price?.toLocaleString("id-ID")}
                        </div>
                        <p className="text-green-700 dark:text-green-200 mb-6 whitespace-pre-line">
                            {produk.description}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition"
                        >
                            Tambah ke Keranjang
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-100 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Kembali
                        </button>
                    </div>
                    {notif && (
                        <div className="mt-4 text-center text-green-700 dark:text-green-100 font-semibold">
                            {notif}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}