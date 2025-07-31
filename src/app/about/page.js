import React from "react";

export const metadata = {
    title: "Tentang Kami",
    description: "Pelajari lebih lanjut tentang Distributor HPAI Ika dan komitmen kami terhadap kesehatan Anda.",
};

export default function aboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-green-900 shadow-lg rounded-xl p-8">
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-4">Tentang Kami</h1>
                <p className="text-green-600 dark:text-green-200 mb-6">
                    Distributor HPAI Ika adalah toko herbal terpercaya menyediakan produk-produk HPAI yang berkualitas tinggi untuk
                    kesehatan Anda. Kami berkomitmen untuk memberikan pelayanan terbaik dan produk herbal yang aman
                    serta efektif.
                </p>
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-100 mb-2">Visi Kami</h2>
                <p className="text-green-600 dark:text-green-200 mb-4">
                    Menjadi Distributor herbal yang menyediakan produk berkualitas tinggi untuk meningkatkan kesehatan
                    masyarakat.
                </p>
                <h2 className="text-xl font-semibold text-green-700 dark:text-green-100 mb-2">Misi Kami</h2>
                <ul className="list-disc list-inside text-green-600 dark:text-green-200">
                    <li>Menyediakan produk herbal yang aman dan berkualitas.</li>
                    <li>Memberikan edukasi tentang manfaat herbal untuk kesehatan.</li>
                    <li>Membangun kepercayaan dan kepuasan pelanggan.</li>
                </ul>
            </div>
        </div>
    );
}