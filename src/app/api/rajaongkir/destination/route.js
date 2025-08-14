import axios from "axios";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    console.log("API Key:", process.env.RAJAONGKIR_API_KEY); // Jangan untuk production

    try {
        const res = await axios.get(
            `https://api-sandbox.collaborator.komerce.id/tariff/api/v1/destination/search?keyword=${encodeURIComponent(keyword)}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.RAJAONGKIR_API_KEY}`,
                },
            }
        );

        console.log("respon dari rajaongkir:", res.data);

        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error dari Komerce API:", err);
        return new Response(JSON.stringify({ error: "Gagal fetch destination", detail: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
