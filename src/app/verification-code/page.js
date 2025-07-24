export const metadata = {
  title: "Verifikasi Email - Agen HPAI Ika",
  description: "Masukkan kode verifikasi yang dikirim ke email Anda.",
};

export default function VerificationCodePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800">
      <div className="bg-white dark:bg-green-900 shadow-lg rounded-xl p-8 w-full max-w-sm flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-700 dark:text-green-100">
          Verifikasi Email
        </h1>
        <p className="mb-6 text-center text-sm text-green-600 dark:text-green-200">
          Masukkan kode verifikasi yang telah dikirim ke email Anda untuk melanjutkan proses pendaftaran.
        </p>
        <form className="flex flex-col gap-4 w-full max-w-xs">
          <input
            type="text"
            maxLength={6}
            placeholder="Kode Verifikasi"
            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-green-800 dark:text-green-100 text-center tracking-widest text-lg font-mono"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Verifikasi
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-green-700 dark:text-green-200">
          Tidak menerima kode? <a href="#" className="text-green-600 hover:underline">Kirim ulang</a>
        </div>
      </div>
    </div>
  );
}