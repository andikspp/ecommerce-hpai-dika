"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import {
    FaArrowLeft,
    FaSave,
    FaBox,
    FaDollarSign,
    FaWarehouse,
    FaLayerGroup,
    FaImage,
    FaAlignLeft,
    FaToggleOn,
    FaToggleOff,
    FaUpload,
    FaTimes,
    FaEdit
} from "react-icons/fa";

export default function EditProdukPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
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

    // Ambil data produk berdasarkan id
    useEffect(() => {
        if (isChecking) return;
        const fetchProduk = async () => {
            if (!id) return;
            try {
                // Ambil produk by id
                const res = await axios.get(`/api/admin/produk/${id}`);
                const produk = res.data;
                setName(produk.name ?? "");
                setPrice(produk.price ?? "");
                setStock(produk.stock ?? "");
                setDescription(produk.description ?? "");
                setCategoryId(produk.categoryId ?? "");
                setImageUrl(produk.imageUrl ?? "");
                setIsActive(produk.isActive ?? true);

                // Ambil daftar kategori
                const kategoriRes = await axios.get("/api/admin/kategori");
                setCategories(Array.isArray(kategoriRes.data) ? kategoriRes.data : []);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Gagal mengambil data produk.",
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
                router.push("/admin/produk");
            }
        };
        fetchProduk();
    }, [id, router, isChecking]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        document.getElementById('image-input').value = '';
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

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
            if (imageFile) {
                formData.append("image", imageFile);
            }

            await axios.put(`/api/admin/produk/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Produk berhasil diperbarui!",
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
            router.push("/admin/produk");
        } catch (err) {
            await Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.error || "Gagal memperbarui produk.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Memuat Data Produk...</span>
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
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.push("/admin/produk")}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FaEdit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Edit Produk
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Perbarui informasi produk yang sudah ada
                    </p>
                </div>

                {/* Form Container */}
                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <FaBox className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Informasi Dasar
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nama Produk *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Masukkan nama produk"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                        <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Harga *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={0}
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="0"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                        />
                                        <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Masukkan harga dalam Rupiah
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Stok *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min={0}
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="0"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            required
                                        />
                                        <FaWarehouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Jumlah produk yang tersedia
                                    </p>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kategori *
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
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
                                        <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <FaImage className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Gambar Produk
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Current Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gambar Saat Ini
                                    </label>
                                    <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl.startsWith("http") ? imageUrl : `http://localhost:5000${imageUrl}`}
                                                alt="Gambar Produk"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Tidak ada gambar
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload New Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Upload Gambar Baru
                                    </label>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input
                                                id="image-input"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                            <label
                                                htmlFor="image-input"
                                                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
                                            >
                                                <FaUpload className="w-6 h-6 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Klik untuk upload gambar baru
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    PNG, JPG, GIF hingga 5MB
                                                </span>
                                            </label>
                                        </div>

                                        {/* New Image Preview */}
                                        {imagePreview && (
                                            <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview Baru"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <FaTimes className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                                    Preview Baru
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Kosongkan jika tidak ingin mengganti gambar
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <FaAlignLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Deskripsi Produk
                                </h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Deskripsi Detail
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    placeholder="Masukkan deskripsi lengkap produk..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Jelaskan detail produk, fitur, dan keunggulan
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push("/admin/produk")}
                                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Memperbarui...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="w-4 h-4" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}