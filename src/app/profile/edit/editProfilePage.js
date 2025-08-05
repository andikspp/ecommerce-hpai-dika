"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditProfilePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        Telepon: "",
        alamat: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kelurahan: "",
        kodePos: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            router.replace("/login");
            return;
        }
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Profile data:", res.data);

                setForm({
                    name: res.data.name || "",
                    username: res.data.username || "",
                    email: res.data.email || "",
                    Telepon: res.data.Telepon || "",
                    alamat: res.data.alamat || "",
                    provinsi: res.data.provinsi || "",
                    kota: res.data.kota || "",
                    kecamatan: res.data.kecamatan || "",
                    kelurahan: res.data.kelurahan || "",
                    kodePos: res.data.kodePos || "",
                });
            } catch {
                setError("Gagal mengambil data profil");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const token = localStorage.getItem("token");

        const dataToSend = {
            ...form,
            alamat: form.alamat.toUpperCase(),
            provinsi: form.provinsi.toUpperCase(),
            kota: form.kota.toUpperCase(),
            kecamatan: form.kecamatan.toUpperCase(),
            kelurahan: form.kelurahan.toUpperCase(),
        };

        try {
            await axios.put("/api/profile", dataToSend, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess("Profil berhasil diperbarui!");
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Profil berhasil diperbarui!",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                router.push("/profile");
            });
        } catch {
            setError("Gagal update profil");
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal update profil",
            });
        }
    };

    if (loading) {
        return <div className="text-center py-8">Memuat data...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-green-900 shadow-2xl rounded-2xl p-8 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700 dark:text-green-100">Edit Profil</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section Data Diri */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-200">Data Diri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-semibold">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-semibold">Telepon</label>
                            <input
                                type="number"
                                name="Telepon"
                                value={form.Telepon}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                </div>
                {/* Section Alamat */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-200">Alamat</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        <span className="font-medium text-red-600">*</span> Untuk melakukan pemesanan, Anda harus melengkapi data alamat dengan benar.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-semibold">Alamat</label>
                            <input
                                type="text"
                                name="alamat"
                                value={form.alamat}
                                onChange={handleChange}
                                placeholder="Contoh: Jl. Melati No. 10, RT 02, RW 03"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Provinsi</label>
                            <input
                                type="text"
                                name="provinsi"
                                value={form.provinsi}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Kota/Kabupaten</label>
                            <input
                                type="text"
                                name="kota"
                                value={form.kota}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Kecamatan</label>
                            <input
                                type="text"
                                name="kecamatan"
                                value={form.kecamatan}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Kelurahan</label>
                            <input
                                type="text"
                                name="kelurahan"
                                value={form.kelurahan}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Kode Pos</label>
                            <input
                                type="number"
                                name="kodePos"
                                value={form.kodePos}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transition"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}