import axios from "axios";

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Request body:", body);
        const { origin, destination, weight, courier, kota, kecamatan, provinsi } = body;
        const res = await axios.post("http://localhost:5000/api/ongkir", {
            origin,
            destination,
            weight,
            courier,
            kota,       // tambahkan field kota
            kecamatan,   // tambahkan field kecamatan
            provinsi
        });
        console.log("Response from backend:", res.data);
        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        const message = err?.response?.data?.error || err?.message || "Gagal mengambil ongkir";
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}