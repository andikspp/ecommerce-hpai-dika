import { notFound } from "next/navigation";
import { backendGet, BackendError } from "@/lib/serverApi";
import { productImageSrc } from "@/lib/imageUrl";
import ProductDetailClient from "./ProductDetailClient";

// Server Component: data produk diambil di server sehingga nama, harga, dan deskripsi sudah
// ada di HTML (bisa diindeks mesin pencari dan tampil saat link dibagikan).

async function getProduk(id) {
    if (!/^\d+$/.test(id)) notFound();
    try {
        return await backendGet(`/produk/${id}`);
    } catch (err) {
        if (err instanceof BackendError && (err.status === 404 || err.status === 400)) notFound();
        throw err;
    }
}

async function getReviews(id) {
    try {
        const data = await backendGet(`/reviews/product/${id}`);
        return Array.isArray(data?.reviews) ? data.reviews : [];
    } catch {
        return []; // ulasan gagal dimuat tidak boleh menggagalkan halaman produk
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const produk = await getProduk(id);
    const description = (produk.description || `Beli ${produk.name} asli HPAI di Distributor HPAI Ika.`).slice(0, 160);
    const image = produk.imageUrl ? productImageSrc(produk.imageUrl) : undefined;
    return {
        title: `${produk.name} | Distributor HPAI Ika`,
        description,
        // Produk nonaktif tetap bisa dibuka (mis. dari riwayat pesanan) tapi tidak diindeks
        robots: produk.isActive ? undefined : { index: false },
        openGraph: {
            title: produk.name,
            description,
            type: "website",
            ...(image && { images: [{ url: image }] }),
        },
    };
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    const [produk, reviews] = await Promise.all([getProduk(id), getReviews(id)]);
    return <ProductDetailClient initialProduk={produk} initialReviews={reviews} />;
}
