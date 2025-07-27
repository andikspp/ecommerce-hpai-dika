// gunakan axios
import axios from "axios";

export async function GET(request) {
    try {
        // Ambil token dari header
        const token = request.headers.get("Authorization")?.split(" ")[1];

        // Kirim permintaan ke backend untuk mendapatkan profil pengguna
        const res = await axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Kembalikan response dari backend ke frontend
        return new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { error: "Terjadi kesalahan pada server Next.js" };
        return new Response(JSON.stringify(data), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
