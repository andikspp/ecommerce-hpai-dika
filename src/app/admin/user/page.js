"use client";
import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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
            title: "Konfirmasi Hapus",
            text: "Apakah Anda yakin ingin menghapus user ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/api/admin/user?id=${id}`);
                    if (response.status === 200) {
                        setUsers(users.filter((user) => user.id !== id));
                        Swal.fire("Berhasil", "User berhasil dihapus.", "success");
                    }
                } catch (error) {
                    Swal.fire("Gagal", "Gagal menghapus user.", "error");
                }
            }
        });
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
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-100">Kelola User</h1>
                </div>
                <div className="bg-white dark:bg-green-900 rounded-2xl shadow-lg p-6 overflow-x-auto">
                    {loading ? (
                        <div className="text-center text-green-700 dark:text-green-100 py-8">
                            Memuat data user...
                        </div>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100">
                                    <th className="px-4 py-3 text-left rounded-tl-xl">No</th>
                                    <th className="px-4 py-3 text-left">Username</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Email Terverifikasi</th>
                                    <th className="px-4 py-3 text-center rounded-tr-xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, idx) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                    >
                                        <td className="px-4 py-3">{idx + 1}</td>
                                        <td className="px-4 py-3 font-semibold">{user.username}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">
                                            {user.isVerified ? (
                                                <span className="text-green-600 dark:text-green-300">Ya</span>
                                            ) : (
                                                <span className="text-red-600 dark:text-red-300">Tidak</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleDetail(user)}
                                                className="p-2 rounded bg-green-500 hover:bg-green-600 text-white transition"
                                                title="Detail"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
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
                    {!loading && users.length === 0 && (
                        <div className="text-center text-green-700 dark:text-green-100 py-8">
                            Tidak ada user.
                        </div>
                    )}
                </div>

                {showDetail && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white dark:bg-green-900 rounded-xl shadow-lg p-8 min-w-[320px] max-w-xs relative">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                                title="Tutup"
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-100 text-center">
                                Detail User
                            </h2>
                            <div className="mb-2">
                                <span className="font-semibold">Username:</span> {selectedUser.username}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Email:</span> {selectedUser.email}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Telepon:</span> {selectedUser.Telepon || "Tidak ada"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Alamat:</span> {selectedUser.alamat || "Tidak ada"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Kelurahan:</span> {selectedUser.kelurahan || "Tidak ada"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Kecamatan:</span> {selectedUser.kecamatan || "Tidak ada"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Kota/Kabupaten:</span> {selectedUser.kota || "Tidak ada"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Provinsi:</span> {selectedUser.provinsi || "Tidak ada"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Kode Pos:</span> {selectedUser.kodePos || "Tidak ada"}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}