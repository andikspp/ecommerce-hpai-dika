"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function TambahProdukPage() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const router = useRouter();

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
        // Ambil data kategori untuk dropdown
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/admin/kategori");
                setCategories(res.data || []);
            } catch {
                setCategories([]);
            }
        };
        fetchCategories();
    }, [isChecking]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("stock", stock);
            formData.append("description", description);
            formData.append("categoryId", categoryId);
            formData.append("isActive", isActive);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            // DEBUG: tampilkan isi FormData
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            await axios.post("/api/admin/produk", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Produk berhasil ditambahkan!",
                timer: 1500,
                showConfirmButton: false,
            });
            router.push("/admin/produk");
        } catch (err) {
            await Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.error || "Gagal menambah produk.",
            });
        } finally {
            setLoading(false);
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
            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-lg bg-white dark:bg-green-900 rounded-2xl shadow-lg p-8">
                    <button
                        onClick={() => router.push("/admin/produk")}
                        className="flex items-center gap-2 text-green-700 dark:text-green-100 mb-6 hover:underline"
                    >
                        <FaArrowLeft /> Kembali
                    </button>
                    <h1 className="text-2xl font-bold text-green-700 dark:text-green-100 mb-6 text-center">
                        Tambah Produk
                    </h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block mb-2 text-green-700 dark:text-green-100 font-semibold">
                                Nama Produk
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
                                placeholder="Masukkan nama produk"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block mb-2 text-green-700 dark:text-green-100 font-semibold">
                                    Harga
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    className="w-full px-4 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
                                    placeholder="Harga"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-2 text-green-700 dark:text-green-100 font-semibold">
                                    Stok
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    className="w-full px-4 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
                                    placeholder="Stok"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-green-700 dark:text-green-100 font-semibold">
                                Kategori
                            </label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-green-700 dark:text-green-100 font-semibold">
                                Gambar Produk
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full px-4 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
                                onChange={e => setImageFile(e.target.files[0])}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-green-700 dark:text-green-100 font-semibold">
                                Deskripsi
                            </label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-green-300 focus:border-green-600 focus:outline-none dark:bg-green-800 dark:text-green-100 dark:border-green-700"
                                placeholder="Deskripsi produk"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-green-700 dark:text-green-100 font-semibold">
                                Status Aktif
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsActive((v) => !v)}
                                className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center ${isActive ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            >
                                <span
                                    className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${isActive ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                            <span className={`text-xs font-bold ${isActive ? "text-green-600" : "text-gray-400"}`}>
                                {isActive ? "Aktif" : "Nonaktif"}
                            </span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-60"
                        >
                            <FaSave /> {loading ? "Menyimpan..." : "Simpan Produk"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}