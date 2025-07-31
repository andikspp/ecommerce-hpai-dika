import axios from "axios";

export async function GET(_, context) {
    const { id } = context.params;
    if (!id) {
        return new Response(JSON.stringify({ error: "ID produk wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const res = await axios.get(`http://localhost:5000/api/produk/${id}`);
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