"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Navbar({ isLoggedIn, user, onLogout }) {
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        let userId = null;
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userId = payload.id;
            } catch { }
        }

        // Ambil cart dari localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length > 0) {
            // Jika ada di localStorage, pakai itu
            const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
            setCartCount(totalQty);
        } else if (userId) {
            // Jika tidak ada di localStorage, fetch dari database
            axios.get(`/api/cart/${userId}`)
                .then(res => {
                    const items = res.data?.items || [];
                    const totalQty = items.reduce((sum, item) => sum + (item.qty || 1), 0);
                    setCartCount(totalQty);
                })
                .catch(() => setCartCount(0));
        } else {
            setCartCount(0);
        }
    }, [pathname]);

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="w-full bg-green-700 dark:bg-green-900 text-white px-6 py-4 flex items-center justify-between shadow">
            <a href="/" className="font-bold text-xl tracking-wide">Distributor HPAI Ika</a>
            <div className="flex gap-3 items-center text-sm">
                <a
                    href="/cart"
                    className="relative flex items-center hover:bg-green-800 rounded-full px-2 py-1 transition"
                    aria-label="Keranjang"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.7L21 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                            {cartCount}
                        </span>
                    )}
                </a>
                <a href="/about" className="hover:bg-green-800 rounded-full px-2 py-1 transition">Tentang</a>
                {!isLoggedIn ? (
                    <a href="/login" className="hover:bg-green-800 rounded-full px-2 py-1 transition">Login</a>
                ) : (
                    <>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((open) => !open)}
                                className="flex items-center gap-1 font-semibold hover:bg-green-800 px-2 py-1 rounded transition"
                            >
                                Hi, {user?.username || "User"}
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-36 bg-white text-green-900 rounded shadow-lg z-50">
                                    <a
                                        href="/profile"
                                        className="block px-4 py-2 hover:bg-green-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Profil
                                    </a>
                                    <button
                                        onClick={() => { setDropdownOpen(false); onLogout(); }}
                                        className="w-full text-left px-4 py-2 hover:bg-green-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
export default function NavbarClient() {
    const pathname = usePathname();
    const hideNavbar = [
        "/login",
        "/register",
        "/forgot-password",
        "/verification-code",
        "/admin/login",
        "/admin/dashboard",
        "/admin/user",
        "/admin/kategori",
        "/admin/produk",
        "/admin/produk/tambah",
        "/admin/kategori/tambah",
        "/admin/kategori/edit",
        "/admin/produk/edit",
    ].includes(pathname);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({ username: payload.username });
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [pathname]);

    const handleLogout = async () => {
        // 1. Ambil cart dari localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const token = localStorage.getItem("token");
        let userId = null;
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userId = payload.id; // pastikan payload ada id user
            } catch { }
        }

        // 2. Simpan atau update cart ke database hanya jika ada userId dan cart tidak kosong
        if (userId && cart.length > 0) {
            try {
                // Cek apakah cart sudah ada di database
                const check = await axios.get(`/api/cart/${userId}`);
                if (check.data && check.data.id) {
                    // Jika sudah ada, update dengan PUT
                    console.log("Updating existing cart for user:", userId, cart);
                    const cartToSave = cart.map(item => ({
                        productId: item.productId || item.id,
                        qty: item.qty,
                    }));
                    await axios.put("/api/cart/save", { userId, cart: cartToSave });
                } else {
                    // Jika belum ada, buat baru dengan POST
                    console.log('Create cart for user:', userId)
                    await axios.post("/api/cart/save", { userId, cart });
                }
            } catch (e) {
                console.error("Gagal menyimpan cart:", e);
                await Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat menyimpan cart.",
                });
                return; // Hentikan proses logout jika gagal simpan cart
            }
        }

        // 3. Bersihkan cart dari localStorage
        localStorage.removeItem("cart");

        // 4. Lanjutkan proses logout
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        window.location.href = "/login";
    };

    if (hideNavbar) return null;
    return <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />;
}