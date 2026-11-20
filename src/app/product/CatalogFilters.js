"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Kontrol pencarian, kategori, dan urutan. Nilainya disimpan di URL (?q=&kategori=&sort=&page=),
// sehingga hasil filter bisa dibagikan/di-bookmark dan halaman dirender ulang di server.
// Tanpa JavaScript, form ini tetap berfungsi sebagai form GET biasa.
export default function CatalogFilters({ categories, q, kategori, sort }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(q);
    const [isPending, startTransition] = useTransition();
    const firstRender = useRef(true);

    // Ubah satu/lebih parameter URL; filter baru selalu kembali ke halaman 1
    const updateParams = (changes) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(changes)) {
            if (value) params.set(key, value);
            else params.delete(key);
        }
        params.delete("page");
        const query = params.toString();
        startTransition(() => {
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        });
    };

    // URL berubah dari luar (link "Lihat semua produk", tombol back): samakan isi kolom pencarian
    useEffect(() => {
        setSearch(q);
    }, [q]);

    // Pencarian dijalankan 400 ms setelah berhenti mengetik
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (search.trim() === q) return;
        const timer = setTimeout(() => updateParams({ q: search.trim() }), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white";

    return (
        <form
            action={pathname}
            method="get"
            onSubmit={(e) => {
                e.preventDefault();
                updateParams({ q: search.trim() });
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            aria-busy={isPending}
        >
            <div className="lg:col-span-2">
                <label htmlFor="cari-produk" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cari Produk
                </label>
                <div className="relative">
                    <input
                        id="cari-produk"
                        type="search"
                        name="q"
                        placeholder="Cari nama produk..."
                        value={search}
                        maxLength={100}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`${inputClass} pl-10`}
                    />
                    <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div>
                <label htmlFor="filter-kategori" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori
                </label>
                <select
                    id="filter-kategori"
                    name="kategori"
                    value={kategori}
                    onChange={(e) => updateParams({ kategori: e.target.value })}
                    className={inputClass}
                >
                    <option value="">Semua</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="urutkan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Urutkan
                </label>
                <select
                    id="urutkan"
                    name="sort"
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value === "name" ? "" : e.target.value })}
                    className={inputClass}
                >
                    <option value="name">Nama A-Z</option>
                    <option value="price-low">Harga Terendah</option>
                    <option value="price-high">Harga Tertinggi</option>
                    <option value="newest">Terbaru</option>
                </select>
            </div>

            <noscript>
                <button type="submit" className="bg-green-600 text-white px-4 py-3 rounded-lg">Terapkan</button>
            </noscript>
        </form>
    );
}
