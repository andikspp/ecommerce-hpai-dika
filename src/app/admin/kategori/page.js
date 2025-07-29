"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminKategoriPage() {
    const router = useRouter();
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [isChecking, setIsChecking] = React.useState(true);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                window.location.href = "/admin/login";
            } else {
                setIsChecking(false);
            }
        }
    }, []);

    React.useEffect(() => {
        if (isChecking) return;
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/admin/kategori");
                setCategories(res.data || []); // Pastikan sesuai struktur respons backend
            } catch (err) {
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [isChecking]);

    const handleEdit = (id) => {
        router.push(`/admin/kategori/edit?id=${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Kategori yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        });

        if (!result.isConfirmed) return;

        try {
            await axios.delete(`/api/admin/kategori?id=${id}`);
            setCategories(categories.filter(cat => cat.id !== id));
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Kategori berhasil dihapus!",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            await Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.error || "Terjadi kesalahan."
            });
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
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-100">Kelola Kategori</h1>
                    <button
                        onClick={() => router.push("/admin/kategori/tambah")}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
                    >
                        <FaPlus /> Tambah Kategori
                    </button>
                </div>
                <div className="bg-white dark:bg-green-900 rounded-2xl shadow-lg p-6 overflow-x-auto">
                    {loading ? (
                        <div className="text-center text-green-700 dark:text-green-100 py-8">
                            Memuat data kategori...
                        </div>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100">
                                    <th className="px-4 py-3 text-left rounded-tl-xl">No</th>
                                    <th className="px-4 py-3 text-left">Nama Kategori</th>
                                    <th className="px-4 py-3 text-center rounded-tr-xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => (
                                    <tr
                                        key={cat.id}
                                        className="border-b border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                    >
                                        <td className="px-4 py-3">{idx + 1}</td>
                                        <td className="px-4 py-3 font-semibold">{cat.name}</td>
                                        <td className="px-4 py-3 flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleEdit(cat.id)}
                                                className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
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
                    {!loading && categories.length === 0 && (
                        <div className="text-center text-green-700 dark:text-green-100 py-8">
                            Tidak ada kategori.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}