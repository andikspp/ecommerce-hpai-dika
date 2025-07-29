"use client";
import React from "react";
import { FaChartBar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AdminSidebar from "@/components/AdminSidebar";

const dataBar = [
    { name: "Jan", produk: 40 },
    { name: "Feb", produk: 30 },
    { name: "Mar", produk: 20 },
    { name: "Apr", produk: 27 },
    { name: "Mei", produk: 18 },
    { name: "Jun", produk: 23 },
];

const dataPie = [
    { name: "Produk", value: 400 },
    { name: "Kategori", value: 300 },
    { name: "Pengguna", value: 300 },
];

const COLORS = ["#22c55e", "#16a34a", "#bbf7d0"];

export default function AdminDashboardPage() {
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

    const username = typeof window !== "undefined" ? localStorage.getItem("adminUsername") || "Admin" : "Admin";

    // Fungsi logout
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login"; // Ganti sesuai route login Anda
    };

    if (isChecking) {
        // Bisa diganti dengan spinner/loading lain
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-green-900">
                <span className="text-green-700 dark:text-green-100 text-xl font-semibold">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
            {/* Sidebar */}
            <AdminSidebar handleLogout={handleLogout} />
            {/* Main Content */}
            <main className="flex-1 p-10">
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-2">Dashboard Admin</h1>
                <p className="text-green-700 dark:text-green-200 mb-8">
                    Selamat datang, <span className="font-semibold">{username}</span>! Berikut ringkasan data aplikasi.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bar Chart */}
                    <div className="bg-white dark:bg-green-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-green-700 dark:text-green-100 mb-4 flex items-center gap-2">
                            <FaChartBar /> Produk Masuk per Bulan
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={dataBar}>
                                <XAxis dataKey="name" stroke="#16a34a" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="produk" fill="#22c55e" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Pie Chart */}
                    <div className="bg-white dark:bg-green-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-green-700 dark:text-green-100 mb-4 flex items-center gap-2">
                            <FaChartBar /> Komposisi Data
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={dataPie}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {dataPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}