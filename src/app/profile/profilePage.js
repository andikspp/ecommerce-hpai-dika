"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const PROFILE_FIELDS = [
    "name",
    "username",
    "email",
    "Telepon",
    "alamat",
    "kelurahan",
    "kecamatan",
    "kota",
    "provinsi",
    "kodePos",
];

function getProfileCompletion(user) {
    if (!user) return 0;
    let filled = 0;
    PROFILE_FIELDS.forEach((field) => {
        if (user[field] && user[field].toString().trim() !== "") filled++;
    });
    return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            router.replace("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get("/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error(error);
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat data profil...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const completion = getProfileCompletion(user);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                            Profil Saya
                        </h1>
                        <p className="text-green-100">
                            Kelola informasi pribadi dan preferensi akun Anda
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">

                    {/* Profile Header */}
                    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-12">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-2xl border-4 border-white/30">
                                    {user.username?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="text-center md:text-left text-white">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                    {user.name || user.username}
                                </h2>
                                <p className="text-green-100 text-lg mb-1">@{user.username}</p>
                                <p className="text-green-200">{user.email}</p>

                                {/* Profile Completion */}
                                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-100">Kelengkapan Profil</span>
                                        <span className="text-sm font-bold text-white">{completion}%</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-300 to-emerald-300 h-2 rounded-full transition-all duration-500 shadow-sm"
                                            style={{ width: `${completion}%` }}
                                        ></div>
                                    </div>
                                    {completion < 100 && (
                                        <p className="text-xs text-green-200 mt-2">
                                            Lengkapi profil Anda untuk pengalaman yang lebih baik
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8">

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <a
                                href="/profile/edit"
                                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-xl transition-colors duration-200 group"
                            >
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">Edit Profil</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Perbarui informasi</p>
                                </div>
                            </a>

                            <a
                                href="/orders"
                                className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors duration-200 group"
                            >
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">Pesanan</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Riwayat belanja</p>
                                </div>
                            </a>

                            <a
                                href="/cart"
                                className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-xl transition-colors duration-200 group"
                            >
                                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.7L21 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white">Keranjang</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Lihat keranjang</p>
                                </div>
                            </a>
                        </div>

                        {/* Profile Information */}
                        <div className="grid md:grid-cols-2 gap-8">

                            {/* Personal Information */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Informasi Pribadi
                                </h3>
                                <div className="space-y-4">
                                    <ProfileField
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                                        label="Nama Lengkap"
                                        value={user.name}
                                    />
                                    <ProfileField
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
                                        label="Email"
                                        value={user.email}
                                    />
                                    <ProfileField
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                                        label="Telepon"
                                        value={user.Telepon}
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Alamat
                                </h3>
                                <div className="space-y-4">
                                    <ProfileField
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                                        label="Alamat Lengkap"
                                        value={user.alamat}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <ProfileField label="Kelurahan" value={user.kelurahan} />
                                        <ProfileField label="Kecamatan" value={user.kecamatan} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ProfileField label="Kota/Kabupaten" value={user.kota} />
                                        <ProfileField label="Provinsi" value={user.provinsi} />
                                    </div>
                                    <ProfileField
                                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
                                        label="Kode Pos"
                                        value={user.kodePos}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Statistik Akun</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Kepuasan</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Pesanan</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2024</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Bergabung</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{completion}%</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Profil Lengkap</div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        <div className="mt-8 text-center">
                            <a
                                href="/profile/edit"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profil Lengkap
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileField({ icon, label, value }) {
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="text-green-600 dark:text-green-400">
                            {icon}
                        </div>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</span>
                    <span className="block font-semibold text-gray-900 dark:text-white">
                        {value && value !== "" ? (
                            value
                        ) : (
                            <span className="italic text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.992-.833-2.762 0L3.052 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Belum diisi
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}