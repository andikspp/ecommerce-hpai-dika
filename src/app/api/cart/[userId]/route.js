import axios from "axios";

export async function GET(request, { params }) {
    const { userId } = params;
    console.log("Request to /api/cart/[userId] received, userId:", userId);
    if (!userId) {
        return new Response(JSON.stringify({ error: "User ID harus diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const url = `http://localhost:5000/api/cart/${userId}`;
        const res = await axios.get(url);
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
