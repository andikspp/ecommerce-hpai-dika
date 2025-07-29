"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";

export default function AdminProdukPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                window.location.href = "/admin/login";
            } else {
                setIsChecking(false);
            }
        }
    }, []);

    useEffect(() => {
        if (isChecking) return;
        const fetchProducts = async () => {
            try {
                const res = await axios.get("/api/admin/produk");
                setProducts(res.data || []);
            } catch (err) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [isChecking]);

    const handleAdd = () => {
        // gunakan useRouter
        router.push("/admin/produk/tambah");
    };

    const handleEdit = (id) => {
        // gunakan useRouter
        router.push(`/admin/produk/edit?id=${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Hapus produk ini?",
            text: "Aksi ini tidak dapat dibatalkan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/admin/produk/${id}`);
                setProducts(products => products.filter(prod => prod.id !== id));
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Produk berhasil dihapus.",
                    timer: 1200,
                    showConfirmButton: false,
                });
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: err.response?.data?.error || "Gagal menghapus produk.",
                });
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const result = await Swal.fire({
            title: currentStatus ? "Nonaktifkan produk ini?" : "Aktifkan produk ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: currentStatus ? "Nonaktifkan" : "Aktifkan",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.patch(`/api/admin/produk?id=${id}`, {
                    isActive: !currentStatus,
                });
                // Update state produk di frontend
                setProducts(products =>
                    products.map(prod =>
                        prod.id === id ? { ...prod, isActive: !currentStatus } : prod
                    )
                );
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: `Status produk berhasil diubah.`,
                    timer: 1200,
                    showConfirmButton: false,
                });
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Gagal mengubah status produk.",
                });
            }
        }
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-green-900">
                <span className="text-green-700 dark:text-green-100 text-xl font-semibold">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-100">
                        Kelola Produk
                    </h1>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
                    >
                        <FaPlus /> Tambah Produk
                    </button>
                </div>
                <div className="bg-white dark:bg-green-900 rounded-2xl shadow-lg p-6 overflow-x-auto">
                    {/* ...tabel produk... */}
                </div>
                <div className="bg-white dark:bg-green-900 rounded-2xl shadow-lg p-6 overflow-x-auto">
                    {loading ? (
                        <div className="text-center text-green-700 dark:text-green-100 py-8">
                            Memuat data produk...
                        </div>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100">
                                    <th className="px-4 py-3 text-left rounded-tl-xl">No</th>
                                    <th className="px-4 py-3 text-left">Nama Produk</th>
                                    <th className="px-4 py-3 text-left">Kategori</th>
                                    <th className="px-4 py-3 text-left">Harga</th>
                                    <th className="px-4 py-3 text-left">Stok</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left rounded-tr-xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((prod, idx) => (
                                    <tr
                                        key={prod.id}
                                        className="border-b border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                    >
                                        <td className="px-4 py-3">{idx + 1}</td>
                                        <td className="px-4 py-3 font-semibold">{prod.name}</td>
                                        <td className="px-4 py-3">{prod.category?.name || "-"}</td>
                                        <td className="px-4 py-3">Rp {prod.price.toLocaleString()}</td>
                                        <td className="px-4 py-3">{prod.stock}</td>
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(prod.id, prod.isActive)}
                                                className="focus:outline-none"
                                                title={prod.isActive ? "Nonaktifkan" : "Aktifkan"}
                                            >
                                                {prod.isActive ? (
                                                    <FaToggleOn className="text-green-500 text-2xl" />
                                                ) : (
                                                    <FaToggleOff className="text-gray-400 text-2xl" />
                                                )}
                                            </button>
                                            <span className={`text-xs font-bold ${prod.isActive ? "text-green-600" : "text-gray-400"}`}>
                                                {prod.isActive ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td className="">
                                            <button
                                                onClick={() => handleEdit(prod.id)}
                                                className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(prod.id)}
                                                className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
                                                title="Hapus"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && products.length === 0 && (
                        <div className="text-center text-green-700 dark:text-green-100 py-8">
                            Tidak ada produk.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
