"use client";
import { usePathname } from "next/navigation";

function Footer() {
    return (
        <footer className="w-full bg-green-700 dark:bg-green-900 text-white py-4 text-center mt-12">
            &copy; {new Date().getFullYear()} Agen HPAI Ika &mdash; Toko Herbal Terpercaya
        </footer>
    );
}

export default function FooterClient() {
    const pathname = usePathname();
    const hideFooter = [
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

    if (hideFooter) return null;
    return <Footer />;
}
