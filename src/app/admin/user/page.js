"use client";
import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

const dummyUsers = [
    { id: 1, name: "Ahmad Fauzi", email: "ahmad@hpai.com", role: "Admin" },
    { id: 2, name: "Siti Aminah", email: "siti@hpai.com", role: "User" },
    { id: 3, name: "Budi Santoso", email: "budi@hpai.com", role: "User" },
    { id: 4, name: "Rina Marlina", email: "rina@hpai.com", role: "Moderator" },
];

export default function AdminUserPage() {
    const handleAddUser = () => {
        alert("Fitur tambah user belum tersedia (dummy)");
    };

    const handleEdit = (id) => {
        alert(`Edit user dengan ID: ${id} (dummy)`);
    };

    const handleDelete = (id) => {
        if (window.confirm("Yakin ingin menghapus user ini?")) {
            alert(`User dengan ID: ${id} dihapus (dummy)`);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            <AdminSidebar />
            <main className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-100">Kelola User</h1>
                    <button
                        onClick={handleAddUser}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
                    >
                        <FaUserPlus /> Tambah User
                    </button>
                </div>
                <div className="bg-white dark:bg-green-900 rounded-2xl shadow-lg p-6 overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100">
                                <th className="px-4 py-3 text-left rounded-tl-xl">No</th>
                                <th className="px-4 py-3 text-left">Nama</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-center rounded-tr-xl">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyUsers.map((user, idx) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-800 transition"
                                >
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3 font-semibold">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold
                                            ${user.role === "Admin"
                                                ? "bg-green-200 text-green-800"
                                                : user.role === "Moderator"
                                                    ? "bg-yellow-200 text-yellow-800"
                                                    : "bg-gray-200 text-gray-800"
                                            }`
                                        }>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(user.id)}
                                            className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
                                            title="Edit"
                                        >
                                            <FaEdit />
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
                    {dummyUsers.length === 0 && (
                        <div className="text-center text-green-700 dark:text-green-100 py-8">
                            Tidak ada user.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}