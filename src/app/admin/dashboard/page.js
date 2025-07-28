"use client";
import React from "react";

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 flex items-center justify-center">
            <div className="bg-white dark:bg-green-900 shadow-2xl rounded-2xl p-8 max-w-xl w-full">
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-4 text-center">
                    Dashboard Admin
                </h1>
                <p className="text-green-700 dark:text-green-200 text-center mb-8">
                    Selamat datang di halaman dashboard admin. Anda dapat mengelola produk, kategori, dan pengguna dari sini.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <a
                        href="/admin/produk"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 flex flex-col items-center transition shadow-md"
                    >
                        <span className="text-2xl mb-2">📦</span>
                        <span className="font-semibold">Kelola Produk</span>
                    </a>
                    <a
                        href="/admin/kategori"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 flex flex-col items-center transition shadow-md"
                    >
                        <span className="text-2xl mb-2">🗂️</span>
                        <span className="font-semibold">Kelola Kategori</span>
                    </a>
                    <a
                        href="/admin/user"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 flex flex-col items-center transition shadow-md"
                    >
                        <span className="text-2xl mb-2">👤</span>
                        <span className="font-semibold">Kelola Pengguna</span>
                    </a>
                </div>
            </div>
        </div>
    );
}