"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "./CartContext";
import Link from "next/link";

function Navbar({ isLoggedIn, user, onLogout }) {
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const { cartCount, setCartCount } = useCart();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
    }, [pathname, setCartCount]);

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

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: "/", label: "Beranda", isActive: pathname === "/" },
        { href: "/product", label: "Produk", isActive: pathname === "/product" },
        { href: "/about", label: "Tentang", isActive: pathname === "/about" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-green-100 dark:border-green-800'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-18">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className={`flex items-center space-x-2 font-bold text-xl lg:text-2xl tracking-wide transition-colors duration-300 ${scrolled
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-white'
                                    }`}
                            >
                                <span className="hidden sm:block">Stokis HNI & HPAI Ika</span>
                                <span className="sm:hidden">HPAI Ika</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 lg:px-4 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-200 ${link.isActive
                                        ? scrolled
                                            ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                                            : 'bg-white/20 text-white backdrop-blur-sm'
                                        : scrolled
                                            ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300'
                                            : 'text-white/90 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Cart & User Actions */}
                        <div className="flex items-center space-x-2 lg:space-x-4">
                            {/* Cart */}
                            <a
                                href="/cart"
                                className={`relative p-2 lg:p-3 rounded-full transition-all duration-200 ${scrolled
                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                                aria-label="Keranjang"
                            >
                                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.7L21 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-medium shadow-lg">
                                        {cartCount}
                                    </span>
                                )}
                            </a>

                            {/* User Authentication */}
                            {!isLoggedIn ? (
                                <a
                                    href="/login"
                                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-medium text-sm lg:text-base transition-all duration-200 ${scrolled
                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm'
                                        }`}
                                >
                                    Masuk
                                </a>
                            ) : (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className={`flex items-center space-x-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-full font-medium text-sm lg:text-base transition-all duration-200 ${scrolled
                                            ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900'
                                            : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm ${scrolled
                                            ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                                            : 'bg-white/20 text-white'
                                            }`}>
                                            {user?.username?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <span className="hidden sm:block">{user?.username || "User"}</span>
                                        <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Selamat datang kembali!</p>
                                            </div>
                                            <a
                                                href="/orders"
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                Pesanan Saya
                                            </a>
                                            <a
                                                href="/profile"
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profil
                                            </a>
                                            <button
                                                onClick={() => { setDropdownOpen(false); onLogout(); }}
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Keluar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${scrolled
                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${link.isActive
                                        ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            {!isLoggedIn && (
                                <a
                                    href="/login"
                                    className="block px-4 py-3 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium text-center transition-colors"
                                >
                                    Masuk
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer to prevent content overlap */}
            <div className="h-16 lg:h-18"></div>
        </>
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
        "/admin/order",
        "/admin/produk/detail",
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
                    await axios.put(`/api/cart/${userId}`, { cart: cartToSave });
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