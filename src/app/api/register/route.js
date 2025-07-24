import axios from "axios";

export async function POST(request) {
    try {
        const body = await request.json();
        // Kirim data ke backend Express
        const res = await axios.post("http://localhost:5000/api/register", body);
        return new Response(JSON.stringify(res.data), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMsg = error.response?.data?.error || "Registrasi gagal!";
        return new Response(JSON.stringify({ error: errorMsg }), {
            status: error.response?.status || 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
