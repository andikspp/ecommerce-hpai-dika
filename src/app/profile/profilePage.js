"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const PROFILE_FIELDS = [
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
        return <div className="text-center py-8">Memuat data profil...</div>;
    }

    if (!user) {
        return null;
    }

    const completion = getProfileCompletion(user);

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-green-900 shadow-2xl rounded-2xl p-8 relative overflow-hidden">
            {/* Avatar & Username */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-3">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-100 mb-1">{user.username}</h2>
                <span className="text-gray-500 dark:text-gray-300">{user.email}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-green-700 dark:text-green-200">Kelengkapan Profil</span>
                    <span className="text-sm font-medium text-green-700 dark:text-green-200">{completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-green-800">
                    <div
                        className="bg-gradient-to-r from-green-400 to-green-700 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                    ></div>
                </div>
            </div>

            {/* Data Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ProfileField label="Telepon" value={user.Telepon} />
                <ProfileField label="Alamat" value={user.alamat} />
                <ProfileField label="Kelurahan" value={user.kelurahan} />
                <ProfileField label="Kecamatan" value={user.kecamatan} />
                <ProfileField label="Kota/Kabupaten" value={user.kota} />
                <ProfileField label="Provinsi" value={user.provinsi} />
                <ProfileField label="Kode Pos" value={user.kodePos} />
            </div>

            {/* Edit Button */}
            <div className="flex justify-center">
                <a
                    href="/profile/edit"
                    className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
                >
                    Edit Profil
                </a>
            </div>
        </div>
    );
}

function ProfileField({ label, value }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-300">{label}</span>
            <span className="font-medium text-green-900 dark:text-green-100">
                {value && value !== "" ? value : <span className="italic text-gray-400">Tidak ada</span>}
            </span>
        </div>
    );
}