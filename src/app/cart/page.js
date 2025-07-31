"use client";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            // 1. Cek localStorage
            const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
            console.log("Cart data from localStorage:", cartData);
            if (cartData.length > 0) {
                setCart(cartData);
                setLoading(false);
            } else {
                // 2. Jika kosong, cek user login
                const token = localStorage.getItem("token");
                let userId = null;
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split(".")[1]));
                        userId = payload.id;
                    } catch { }
                }
                // 3. Jika user login, fetch cart dari database
                if (userId) {
                    try {
                        console.log("Mengirim permintaan ke /api/cart dengan userId:", userId);
                        const res = await axios.get(`/api/cart/${userId}`);
                        // Pastikan backend mengembalikan array cart items
                        setCart(res.data.items || []);
                        console.log("Cart fetched from server:", res.data.items);
                    } catch {
                        setCart([]);
                    }
                } else {
                    setCart([]);
                }
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Hitung total harga
    const total = cart.reduce(
        (sum, item) => sum + (item.price * item.qty),
        0
    );

    // Hapus item dari cart
    const handleRemove = (id) => {
        const newCart = cart.filter((item) => item.id !== id);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // Ubah qty
    const handleQtyChange = (id, qty) => {
        if (qty < 1) return;
        const newCart = cart.map((item) =>
            item.id === id ? { ...item, qty } : item
        );
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50 dark:bg-green-900">
                <span className="text-green-700 dark:text-green-100 text-xl font-semibold">Memuat keranjang...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-10">
            <div className="max-w-4xl mx-auto bg-white dark:bg-green-900 rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-8 text-center">Keranjang Belanja</h1>
                {cart.length === 0 ? (
                    <div className="text-center text-green-700 dark:text-green-100 py-12">
                        Keranjang kosong.<br />
                        <Link href="/" className="text-green-600 hover:underline font-semibold">Belanja Sekarang</Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto mb-6">
                                <thead>
                                    <tr className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100">
                                        <th className="px-4 py-3 text-left rounded-tl-xl">Produk</th>
                                        <th className="px-4 py-3 text-center">Harga</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-center">Subtotal</th>
                                        <th className="px-4 py-3 text-center rounded-tr-xl">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => {
                                        // Ambil data produk dari backend (item.product) atau localStorage (item langsung)
                                        const product = item.product || item;
                                        return (
                                            <tr key={item.id} className="border-b border-green-100 dark:border-green-800">
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <img
                                                        src={
                                                            product.imageUrl?.startsWith("http")
                                                                ? product.imageUrl
                                                                : `http://localhost:5000${product.imageUrl || ""}`
                                                        }
                                                        alt={product.name || "Produk"}
                                                        className="w-14 h-14 object-cover rounded-lg border border-green-200 dark:border-green-700 bg-green-50"
                                                    />
                                                    <span className="font-semibold">{product.name || "Produk"}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center text-green-800 dark:text-green-200 font-bold">
                                                    Rp {product.price?.toLocaleString("id-ID") || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.qty}
                                                        onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
                                                        className="w-16 px-2 py-1 rounded border border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-700 text-center"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center text-green-800 dark:text-green-200 font-semibold">
                                                    Rp {(product.price * item.qty).toLocaleString("id-ID")}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handleRemove(item.id)}
                                                        className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
                                                        title="Hapus"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-xl font-bold text-green-800 dark:text-green-100">
                                Total: <span className="text-green-700 dark:text-green-200">Rp {cart.reduce((sum, item) => {
                                    const product = item.product || item;
                                    return sum + (product.price * item.qty);
                                }, 0).toLocaleString("id-ID")}</span>
                            </div>
                            <a
                                href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20memesan%20produk%20dari%20keranjang%20saya."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Checkout via WhatsApp
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}