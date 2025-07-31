import axios from "axios";

export async function POST(request) {
    const body = await request.json();
    console.log("Request body di route:", body);
    try {
        // Kirim ke backend
        const res = await axios.post("http://localhost:5000/api/cart/save", body);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { error: "Gagal simpan cart ke database" };
        return new Response(JSON.stringify(data), { status });
    }
}