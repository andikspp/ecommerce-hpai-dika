"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [shippingMethod, setShippingMethod] = useState("jne");
    const [ongkir, setOngkir] = useState(20000);

    useEffect(() => {
        // Ambil cart dari localStorage
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(localCart);
        // Ambil user dari token jika ada
        const token = localStorage.getItem("token");
        if (token) {
            // Ambil user detail dari backend pakai endpoint /api/profile
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

    // Ambil ongkir dinamis jika user dan shippingMethod sudah ada
    useEffect(() => {
        async function fetchOngkir() {
            if (!user || !user.kota || !user.provinsi) return;
            setOngkir(null);
            try {
                const res = await axios.post("/api/ongkir", {
                    origin: "1", // contoh id kota asal (ubah sesuai kebutuhan)
                    destination: "2", // asumsikan user.kota adalah id kota tujuan
                    weight: 1000, // 1kg
                    courier: shippingMethod
                });
                const data = res.data.data; // <-- ambil array ongkir
                console.log("Ongkir data cost:", data);
                if (Array.isArray(data) && data.length > 0) {
                    const minOngkir = data.reduce((min, curr) => curr.cost < min.cost ? curr : min, data[0]);
                    setOngkir(minOngkir.cost);
                } else {
                    setOngkir(0);
                }
            } catch {
                setOngkir(0);
            }
        }
        fetchOngkir();
    }, [user, shippingMethod]);

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50 dark:bg-green-900">
                <span className="text-green-700 dark:text-green-100 text-xl font-semibold">Memuat checkout...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-10">
            <div className="max-w-3xl mx-auto bg-white dark:bg-green-900 rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-8 text-center">Checkout</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Informasi Pembeli */}
                    <div className="bg-green-50 dark:bg-green-800 rounded-xl p-6 shadow">
                        <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-100">Informasi Pembeli</h2>
                        <div className="mb-2">
                            <span className="font-semibold">Nama:</span> {user?.name || <span className="italic text-gray-400">Guest</span>}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Email:</span> {user?.email || <span className="italic text-gray-400">-</span>}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Alamat:</span> {user?.alamat ? (
                                <span className="ml-1">{user.alamat}</span>
                            ) : (
                                <span className="italic text-gray-400 ml-1">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Kelurahan:</span> {user?.kelurahan ? (
                                <span className="ml-1">{user.kelurahan}</span>
                            ) : (
                                <span className="italic text-gray-400 ml-1">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Kecamatan:</span> {user?.kecamatan ? (
                                <span className="ml-1">{user.kecamatan}</span>
                            ) : (
                                <span className="italic text-gray-400 ml-1">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Kota/Kabupaten:</span> {user?.kota ? (
                                <span className="ml-1">{user.kota}</span>
                            ) : (
                                <span className="italic text-gray-400 ml-1">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Provinsi:</span> {user?.provinsi ? (
                                <span className="ml-1">{user.provinsi}</span>
                            ) : (
                                <span className="italic text-gray-400 ml-1">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Metode Pengiriman:</span>
                            <select
                                className="w-full mt-1 px-3 py-2 rounded border border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
                                value={shippingMethod}
                                onChange={e => setShippingMethod(e.target.value)}
                            >
                                <option value="jne">JNE</option>
                                <option value="jnt">J&T</option>
                                <option value="sicepat">SiCepat</option>
                                <option value="anteraja">AnterAja</option>
                                <option value="pos">POS Indonesia</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Catatan:</span> <input type="text" className="w-full mt-1 px-3 py-2 rounded border border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700" placeholder="Catatan untuk penjual (opsional)" />
                        </div>
                    </div>
                    {/* Ringkasan Pesanan */}
                    <div className="bg-green-50 dark:bg-green-800 rounded-xl p-6 shadow flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-100">Ringkasan Pesanan</h2>
                            <ul className="divide-y divide-green-200 dark:divide-green-700 mb-4">
                                {cart.map((item) => {
                                    const product = item.product || item;
                                    return (
                                        <li key={item.id} className="py-2 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.imageUrl?.startsWith("http") ? product.imageUrl : `http://localhost:5000${product.imageUrl || ""}`}
                                                    alt={product.name || "Produk"}
                                                    className="w-12 h-12 object-cover rounded border border-green-200 dark:border-green-700 bg-green-50"
                                                />
                                                <div>
                                                    <div className="font-semibold">{product.name || "Produk"}</div>
                                                    <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-green-700 dark:text-green-100">Rp {(product.price * item.qty).toLocaleString("id-ID")}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Subtotal</span>
                                <span className="text-green-700 dark:text-green-200">Rp {total.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between items-center text-base font-semibold mt-2">
                                <span>Ongkir</span>
                                <span className="text-green-700 dark:text-green-200">
                                    {ongkir === null ? 'Memuat...' : `Rp ${ongkir.toLocaleString('id-ID')}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold mt-2 border-t border-green-200 dark:border-green-700 pt-2">
                                <span>Total Harga</span>
                                <span className="text-green-900 dark:text-green-100">
                                    Rp {(total + (ongkir || 0)).toLocaleString("id-ID")}
                                </span>
                            </div>
                            {/*
                                Rekomendasi data lain yang bisa ditampilkan di bagian ini:
                                - Estimasi waktu pengiriman (misal: 2-3 hari)
                                - Diskon/kupon jika ada
                                - Asuransi pengiriman (jika user memilih)
                                - Total berat barang
                                - Informasi tracking (jika sudah tersedia)
                                - Rincian biaya lain (biaya admin, packing, dll)
                                - Pilihan pickup point (jika tersedia)
                            */}
                        </div>
                        <button className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition text-lg shadow-lg">
                            Konfirmasi &amp; Bayar
                        </button>
                        <Link href="/cart" className="block mt-4 text-green-600 hover:underline text-center">Kembali ke Keranjang</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

