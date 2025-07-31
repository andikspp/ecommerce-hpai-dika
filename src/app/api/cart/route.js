import axios from "axios";

export async function GET(request) {
    console.log("Request to /api/cart received");
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        let url = "http://localhost:5000/api/cart";
        if (userId) {
            url += `/${userId}`;
        }
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