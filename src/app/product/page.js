import Link from "next/link";
import { backendGet } from "@/lib/serverApi";
import CatalogFilters from "./CatalogFilters";
import ProductGrid from "./ProductGrid";

// Server Component: katalog dirender di server (bagus untuk SEO dan tampilan pertama yang cepat).
// Pencarian, filter, urutan, dan halaman dikerjakan backend; state-nya ada di URL.

export const metadata = {
    title: "Katalog Produk | Distributor HPAI Ika",
    description: "Temukan produk herbal HPAI pilihan terbaik untuk kesehatan Anda: madu, kapsul, minyak herbal, kosmetik, dan lainnya.",
};

const PAGE_SIZE = 12;
const SORTS = ["name", "price-low", "price-high", "newest"];

// Nilai dari URL bisa apa saja; rapikan sebelum dikirim ke backend
function readParams(searchParams) {
    const pick = (key) => (typeof searchParams[key] === "string" ? searchParams[key] : "");
    const page = Number.parseInt(pick("page"), 10);
    const kategori = /^\d+$/.test(pick("kategori")) ? pick("kategori") : "";
    return {
        page: Number.isInteger(page) && page > 0 && page <= 10000 ? page : 1,
        q: pick("q").trim().slice(0, 100),
        kategori,
        sort: SORTS.includes(pick("sort")) ? pick("sort") : "name",
    };
}

function pageHref({ q, kategori, sort }, page) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", kategori);
    if (sort !== "name") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/product?${query}` : "/product";
}

// Nomor halaman yang ditampilkan: 1 … (sekitar halaman aktif) … terakhir
function pageNumbers(current, total) {
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) result.push("…");
        result.push(p);
    });
    return result;
}

function Pagination({ filters, page, totalPages }) {
    if (totalPages <= 1) return null;
    const base = "min-w-10 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
    const idle = `${base} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 shadow`;
    const disabled = `${base} bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed`;
    return (
        <nav aria-label="Halaman produk" className="flex flex-wrap justify-center items-center gap-2 mt-10">
            {page > 1 ? (
                <Link href={pageHref(filters, page - 1)} className={idle} rel="prev">‹ Sebelumnya</Link>
            ) : (
                <span className={disabled} aria-disabled="true">‹ Sebelumnya</span>
            )}
            {pageNumbers(page, totalPages).map((p, i) =>
                p === "…" ? (
                    <span key={`gap-${i}`} className="px-2 text-gray-500">…</span>
                ) : p === page ? (
                    <span key={p} aria-current="page" className={`${base} bg-green-600 text-white shadow`}>{p}</span>
                ) : (
                    <Link key={p} href={pageHref(filters, p)} className={idle}>{p}</Link>
                )
            )}
            {page < totalPages ? (
                <Link href={pageHref(filters, page + 1)} className={idle} rel="next">Berikutnya ›</Link>
            ) : (
                <span className={disabled} aria-disabled="true">Berikutnya ›</span>
            )}
        </nav>
    );
}

export default async function ProdukPage({ searchParams }) {
    const filters = readParams(await searchParams);

    let katalog = null;
    let categories = [];
    try {
        [katalog, categories] = await Promise.all([
            backendGet("/produk", {
                query: { page: filters.page, limit: PAGE_SIZE, q: filters.q, categoryId: filters.kategori, sort: filters.sort },
            }),
            backendGet("/kategori", { revalidate: 300 }),
        ]);
    } catch {
        katalog = null; // ditampilkan sebagai pesan gagal memuat di bawah
    }

    const items = katalog?.items || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Katalog Produk HPAI
                        </h1>
                        <p className="text-xl text-green-100 max-w-2xl mx-auto">
                            Temukan produk herbal HPAI pilihan terbaik untuk kesehatan Anda
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter & Search Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                    <CatalogFilters
                        categories={categories}
                        q={filters.q}
                        kategori={filters.kategori}
                        sort={filters.sort}
                    />
                    {katalog && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                            {katalog.total > 0 ? (
                                <>
                                    Menampilkan{" "}
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        {(katalog.page - 1) * katalog.limit + 1}–{(katalog.page - 1) * katalog.limit + items.length}
                                    </span>{" "}
                                    dari <span className="font-semibold text-green-600 dark:text-green-400">{katalog.total}</span> produk
                                </>
                            ) : (
                                "Tidak ada produk"
                            )}
                        </div>
                    )}
                </div>

                {/* Products Section */}
                <section id="produk">
                    {!katalog ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Produk gagal dimuat
                            </h2>
                            <p className="text-gray-500">Silakan muat ulang halaman beberapa saat lagi.</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Tidak ada produk ditemukan
                            </h2>
                            <p className="text-gray-500 dark:text-gray-500 mb-6">
                                Coba ubah kata kunci pencarian atau filter kategori
                            </p>
                            {(filters.q || filters.kategori || filters.page > 1) && (
                                <Link href="/product" className="text-green-600 hover:underline font-medium">
                                    Lihat semua produk
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <ProductGrid items={items} />
                            <Pagination filters={filters} page={katalog.page} totalPages={katalog.totalPages} />
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
