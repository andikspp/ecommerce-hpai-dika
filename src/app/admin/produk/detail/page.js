"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaBox,
    FaDollarSign,
    FaWarehouse,
    FaLayerGroup,
    FaImage,
    FaAlignLeft,
    FaToggleOn,
    FaToggleOff,
    FaCalendarAlt,
    FaInfoCircle,
    FaChartLine,
    FaEye,
    FaHashtag
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function DetailProdukPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);

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
        if (isChecking || !id) return;
        fetchProduct();
    }, [id, isChecking]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/admin/produk/${id}`);
            setProduct(response.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Produk tidak ditemukan atau terjadi kesalahan.",
                customClass: {
                    popup: 'rounded-2xl'
                }
            }).then(() => {
                router.push("/admin/produk");
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    const handleEdit = () => {
        router.push(`/admin/produk/edit?id=${id}`);
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Hapus Produk",
            text: "Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak dapat dibatalkan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg',
                cancelButton: 'rounded-lg'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/admin/produk/${id}`);
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Produk berhasil dihapus.",
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
                router.push("/admin/produk");
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: err.response?.data?.error || "Gagal menghapus produk.",
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
            }
        }
    };

    const handleToggleStatus = async () => {
        if (!product) return;

        const result = await Swal.fire({
            title: product.isActive ? "Nonaktifkan Produk" : "Aktifkan Produk",
            text: `Apakah Anda yakin ingin ${product.isActive ? 'menonaktifkan' : 'mengaktifkan'} produk ini?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: product.isActive ? "#f59e0b" : "#22c55e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: product.isActive ? "Nonaktifkan" : "Aktifkan",
            cancelButtonText: "Batal",
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg',
                cancelButton: 'rounded-lg'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.patch(`/api/admin/produk?id=${id}`, {
                    isActive: !product.isActive,
                });
                setProduct(prev => ({ ...prev, isActive: !prev.isActive }));
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: `Produk berhasil ${product.isActive ? 'dinonaktifkan' : 'diaktifkan'}.`,
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Gagal mengubah status produk.",
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Habis', color: 'red' };
        if (stock < 10) return { text: 'Stok Rendah', color: 'orange' };
        return { text: 'Tersedia', color: 'green' };
    };

    if (isChecking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Memuat Detail Produk...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <FaBox className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Produk Tidak Ditemukan</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Produk yang Anda cari tidak dapat ditemukan.</p>
                    <button
                        onClick={() => router.push("/admin/produk")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Kembali ke Daftar Produk
                    </button>
                </div>
            </div>
        );
    }

    const stockStatus = getStockStatus(product.stock);

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
                            Kembali ke Daftar Produk
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FaEye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Detail Produk
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Informasi lengkap tentang produk ini
                    </p>
                </div>

                {/* Product Details */}
                <div className="max-w-7xl">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Product Image */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaImage className="w-5 h-5 text-purple-600" />
                                    Gambar Produk
                                </h2>
                                <div className="relative">
                                    <div className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                        {product.imageUrl ? (
                                            <>
                                                {imageLoading && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                                    </div>
                                                )}
                                                <img
                                                    src={product.imageUrl.startsWith("http") ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onLoad={() => setImageLoading(false)}
                                                    onError={() => setImageLoading(false)}
                                                />
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <FaImage className="w-16 h-16 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Tidak ada gambar
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FaInfoCircle className="w-5 h-5 text-blue-600" />
                                        Informasi Produk
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            <FaEdit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Product Name */}
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {product.name}
                                        </h1>
                                        <div className="flex items-center gap-2">
                                            <FaHashtag className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                ID: {product.id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleToggleStatus}
                                            className="flex items-center gap-2 focus:outline-none group"
                                        >
                                            {product.isActive ? (
                                                <>
                                                    <FaToggleOn className="text-green-500 text-3xl group-hover:text-green-600 transition-colors" />
                                                    <span className="text-sm font-medium text-green-600">Produk Aktif</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaToggleOff className="text-gray-400 text-3xl group-hover:text-gray-500 transition-colors" />
                                                    <span className="text-sm font-medium text-gray-400">Produk Nonaktif</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FaDollarSign className="w-4 h-4 text-green-600" />
                                                <span className="text-xs font-medium text-green-600 dark:text-green-400">Harga</span>
                                            </div>
                                            <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                                Rp {product.price?.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        <div className={`rounded-lg p-4 ${stockStatus.color === 'red' ? 'bg-red-50 dark:bg-red-900/20' :
                                                stockStatus.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20' :
                                                    'bg-green-50 dark:bg-green-900/20'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <FaWarehouse className={`w-4 h-4 ${stockStatus.color === 'red' ? 'text-red-600' :
                                                        stockStatus.color === 'orange' ? 'text-orange-600' :
                                                            'text-green-600'
                                                    }`} />
                                                <span className={`text-xs font-medium ${stockStatus.color === 'red' ? 'text-red-600 dark:text-red-400' :
                                                        stockStatus.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                                            'text-green-600 dark:text-green-400'
                                                    }`}>Stok</span>
                                            </div>
                                            <p className={`text-lg font-bold ${stockStatus.color === 'red' ? 'text-red-700 dark:text-red-300' :
                                                    stockStatus.color === 'orange' ? 'text-orange-700 dark:text-orange-300' :
                                                        'text-green-700 dark:text-green-300'
                                                }`}>
                                                {product.stock} unit
                                            </p>
                                            <p className={`text-xs ${stockStatus.color === 'red' ? 'text-red-600 dark:text-red-400' :
                                                    stockStatus.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                                        'text-green-600 dark:text-green-400'
                                                }`}>
                                                {stockStatus.text}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FaLayerGroup className="w-4 h-4 text-blue-600" />
                                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Kategori</span>
                                            </div>
                                            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                                {product.category?.name || 'Tidak ada'}
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FaChartLine className="w-4 h-4 text-purple-600" />
                                                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Nilai Stok</span>
                                            </div>
                                            <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                                                Rp {((product.price || 0) * (product.stock || 0)).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaAlignLeft className="w-5 h-5 text-green-600" />
                                Deskripsi Produk
                            </h2>
                            <div className="prose dark:prose-invert max-w-none">
                                {product.description ? (
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {product.description}
                                    </p>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 italic">
                                        Tidak ada deskripsi untuk produk ini.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaCalendarAlt className="w-5 h-5 text-orange-600" />
                                Informasi Tambahan
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dibuat pada:</span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {formatDate(product.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Terakhir diperbarui:</span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {formatDate(product.updatedAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status publikasi:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                        }`}>
                                        {product.isActive ? 'Dipublikasikan' : 'Draft'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total nilai inventory:</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        Rp {((product.price || 0) * (product.stock || 0)).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Aksi Cepat
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit Produk
                            </button>
                            <button
                                onClick={handleToggleStatus}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 ${product.isActive
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                            >
                                {product.isActive ? <FaToggleOff className="w-4 h-4" /> : <FaToggleOn className="w-4 h-4" />}
                                {product.isActive ? 'Nonaktifkan' : 'Aktifkan'} Produk
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                                <FaTrash className="w-4 h-4" />
                                Hapus Produk
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}