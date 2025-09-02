import axios from "axios";

export async function POST(request) {
    const body = await request.json();
    console.log("Request body di route:", body);
    try {
        // Kirim ke backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.post(`${apiUrl}/api/cart/save`, body);
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { error: "Gagal simpan cart ke database" };
        return new Response(JSON.stringify(data), { status });
    }
}

export async function PUT(request) {
    console.log("Request to /api/cart/save received");
    const body = await request.json();
    console.log("Request body di PUT /api/cart/save:", body);
    const { userId, cart } = body;
    if (!userId) {
        return new Response(JSON.stringify({ error: "User ID harus diisi" }), { status: 400 });
    }
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const url = `${apiUrl}/api/cart/${userId}`;
        const res = await axios.put(url, { cart });
        return new Response(JSON.stringify(res.data), { status: res.status });
    } catch (error) {
        const status = error.response?.status || 500;
        const data = error.response?.data || { error: "Terjadi kesalahan pada server Next.js" };
        return new Response(JSON.stringify(data), { status });
    }
}