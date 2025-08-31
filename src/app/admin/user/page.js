"use client";
import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
    FaTrash,
    FaEye,
    FaUsers,
    FaUserCheck,
    FaUserTimes,
    FaSearch,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaHashtag,
    FaTimes,
    FaShieldAlt
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isChecking, setIsChecking] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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
        const fetchUsers = async () => {
            try {
                const res = await axios.get("/api/admin/user");
                setUsers(res.data || []);
            } catch (err) {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [isChecking]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    const handleDetail = (user) => {
        setSelectedUser(user);
        setShowDetail(true);
    };

    const handleCloseModal = () => {
        setShowDetail(false);
        setSelectedUser(null);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus User",
            text: "Apakah Anda yakin ingin menghapus user ini? Aksi ini tidak dapat dibatalkan!",
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/api/admin/user?id=${id}`);
                    if (response.status === 200) {
                        setUsers(users.filter((user) => user.id !== id));
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil!",
                            text: "User berhasil dihapus.",
                            timer: 2000,
                            showConfirmButton: false,
                            customClass: {
                                popup: 'rounded-2xl'
                            }
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal!",
                        text: "Gagal menghapus user.",
                        customClass: {
                            popup: 'rounded-2xl'
                        }
                    });
                }
            }
        });
    };

    const filteredUsers = users.filter(user => {
        const matchSearch = user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" ||
            (statusFilter === "verified" && user.isVerified) ||
            (statusFilter === "unverified" && !user.isVerified);
        return matchSearch && matchStatus;
    });

    const verifiedCount = users.filter(user => user.isVerified).length;
    const unverifiedCount = users.filter(user => !user.isVerified).length;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Memuat Data...</span>
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
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Kelola User
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Mengelola semua pengguna yang terdaftar dalam sistem
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total User</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Terverifikasi</p>
                                <p className="text-2xl font-bold text-green-600">{verifiedCount}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FaUserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Belum Verifikasi</p>
                                <p className="text-2xl font-bold text-orange-600">{unverifiedCount}</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FaUserTimes className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hasil Pencarian</p>
                                <p className="text-2xl font-bold text-purple-600">{filteredUsers.length}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <FaSearch className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="relative w-full lg:w-80">
                            <input
                                type="text"
                                placeholder="Cari username atau email..."
                                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="flex gap-4 items-center">
                            <select
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="verified">Terverifikasi</option>
                                <option value="unverified">Belum Verifikasi</option>
                            </select>

                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {filteredUsers.length} dari {users.length} user
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Memuat data user...</span>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Terdaftar
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <FaUsers className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                        {search || statusFilter !== "all" ? 'User tidak ditemukan' : 'Belum ada user'}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        {search || statusFilter !== "all"
                                                            ? 'Coba sesuaikan kata kunci pencarian atau filter Anda.'
                                                            : 'Belum ada user yang terdaftar dalam sistem.'
                                                        }
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user, idx) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                                            <FaUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {user.username}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                                <FaHashtag className="w-3 h-3" />
                                                                ID: {user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FaEnvelope className="w-3 h-3 text-gray-400" />
                                                        <span className="text-sm text-gray-900 dark:text-white">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.isVerified ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                            <FaShieldAlt className="w-3 h-3 mr-1" />
                                                            Terverifikasi
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                            <FaUserTimes className="w-3 h-3 mr-1" />
                                                            Belum Verifikasi
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(user.createdAt)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleDetail(user)}
                                                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 transition-colors"
                                                            title="Detail User"
                                                        >
                                                            <FaEye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300 transition-colors"
                                                            title="Hapus User"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Detail Modal */}
                {showDetail && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Detail User
                                        </h2>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Tutup"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Informasi Akun
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <FaHashtag className="w-4 h-4 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ID User</p>
                                                    <p className="text-gray-900 dark:text-white">{selectedUser.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FaUsers className="w-4 h-4 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</p>
                                                    <p className="text-gray-900 dark:text-white">{selectedUser.username}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FaEnvelope className="w-4 h-4 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</p>
                                                    <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FaShieldAlt className="w-4 h-4 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status Verifikasi</p>
                                                    {selectedUser.isVerified ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                            <FaUserCheck className="w-3 h-3 mr-1" />
                                                            Terverifikasi
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                            <FaUserTimes className="w-3 h-3 mr-1" />
                                                            Belum Verifikasi
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Informasi Kontak
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <FaPhone className="w-4 h-4 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Telepon</p>
                                                    <p className="text-gray-900 dark:text-white">
                                                        {selectedUser.Telepon || "Tidak ada"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FaCalendarAlt className="w-4 h-4 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Terdaftar pada</p>
                                                    <p className="text-gray-900 dark:text-white">
                                                        {formatDate(selectedUser.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Info */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                                        Informasi Alamat
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alamat</p>
                                            <p className="text-gray-900 dark:text-white">{selectedUser.alamat || "Tidak ada"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kelurahan</p>
                                            <p className="text-gray-900 dark:text-white">{selectedUser.kelurahan || "Tidak ada"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kecamatan</p>
                                            <p className="text-gray-900 dark:text-white">{selectedUser.kecamatan || "Tidak ada"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kota/Kabupaten</p>
                                            <p className="text-gray-900 dark:text-white">{selectedUser.kota || "Tidak ada"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Provinsi</p>
                                            <p className="text-gray-900 dark:text-white">{selectedUser.provinsi || "Tidak ada"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kode Pos</p>
                                            <p className="text-gray-900 dark:text-white">{selectedUser.kodePos || "Tidak ada"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}