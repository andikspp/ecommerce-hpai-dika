import React from "react";
import { FaBoxOpen, FaFolderOpen, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminSidebar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        Swal.fire({
            icon: "success",
            title: "Logout berhasil",
            timer: 1000,
            showConfirmButton: false,
        }).then(() => {
            router.push("/admin/login");
        });
    };

    return (
        <aside className="w-64 bg-white dark:bg-green-950 shadow-lg flex flex-col justify-between py-8 px-4">
            <div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-100 mb-10 text-center">Admin Panel</h2>
                <nav className="flex flex-col gap-4">
                    <a href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition text-green-700 dark:text-green-100">
                        <FaBoxOpen /> Dashboard
                    </a>
                    <a href="/admin/produk" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition text-green-700 dark:text-green-100">
                        <FaBoxOpen /> Kelola Produk
                    </a>
                    <a href="/admin/kategori" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition text-green-700 dark:text-green-100">
                        <FaFolderOpen /> Kelola Kategori
                    </a>
                    <a href="/admin/user" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition text-green-700 dark:text-green-100">
                        <FaUsers /> Kelola Pengguna
                    </a>
                    <a href="#" onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 dark:hover:bg-green-900 transition text-red-600 dark:text-red-300 mt-10">
                        <FaSignOutAlt /> Logout
                    </a>
                </nav>
            </div>
            <div className="text-xs text-green-400 text-center mt-10">© 2025 HPAI Admin</div>
        </aside>
    );
}