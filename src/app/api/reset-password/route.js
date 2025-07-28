import axios from "axios";

export async function POST(request) {
    // kirim password baru dan token reset ke backend untuk mengubah password
    try {
        const { password, token } = await request.json();
        const res = await axios.post("http://localhost:5000/api/reset-password", { password, token });

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