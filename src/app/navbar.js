"use client";
import { usePathname } from "next/navigation";

function Navbar() {
    return (
        <nav className="w-full bg-green-700 dark:bg-green-900 text-white px-6 py-4 flex items-center justify-between shadow">
            <a href="/home" className="font-bold text-xl tracking-wide">Agen HPAI Ika</a>
            <div className="flex gap-6 items-center text-sm">
                <a href="/produk" className="hover:underline">Produk</a>
                <a href="/about" className="hover:underline">Tentang</a>
                <a href="/cart" className="ml-4 flex items-center hover:bg-green-800 rounded-full px-3 py-1 transition">
                    {/* Keranjang Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.7L21 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" />
                    </svg>
                    <span>Cart</span>
                </a>
                <a href="/login" className="hover:underline">Login</a>
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
    ].includes(pathname);

    if (hideNavbar) return null;
    return <Navbar />;
}