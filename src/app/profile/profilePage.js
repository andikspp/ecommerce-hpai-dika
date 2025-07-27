"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ambil token di client-side
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
                setUser(response.data); // langsung gunakan response.data
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

    return (
        <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h2>Profil Pengguna</h2>
            <div style={{ marginBottom: 16 }}>
                <strong>Username:</strong> <span>{user.username}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
                <strong>Email:</strong> <span>{user.email}</span>
            </div>
            <button style={{ padding: "8px 16px", background: "#0070f3", color: "#fff", border: "none", borderRadius: 4 }}>
                Edit Profil
            </button>
        </div>
    );
}