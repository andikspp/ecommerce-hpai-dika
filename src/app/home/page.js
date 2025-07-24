export const metadata = {
    title: "Beranda - Agen HPAI Ika",
    description: "Selamat datang di toko herbal HPAI terpercaya.",
};

export default function Homepage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4">
            <div className="bg-white dark:bg-green-900 shadow-lg rounded-xl p-8 w-full max-w-2xl flex flex-col items-center">
                <div className="mb-4">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="32" fill="#22c55e" />
                        <path d="M32 18c-6 9-12 12-12 18a12 12 0 0024 0c0-6-6-9-12-18z" fill="#fff" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-green-700 dark:text-green-100 mb-2 text-center">
                    Selamat Datang di Agen HPAI Ika
                </h1>
                <p className="text-green-600 dark:text-green-200 text-center text-base mb-6">
                    Toko herbal HPAI terpercaya. Temukan produk herbal asli, aman, dan berkualitas untuk kesehatan Anda.
                </p>
                <a
                    href="/produk"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    Lihat Produk Herbal
                </a>
            </div>
        </div>
    );
}