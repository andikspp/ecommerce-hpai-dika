import axios from "axios";

export async function POST(request) {
    try {
        console.log("API@create-transaction berjalan di blok try", request);
        const body = await request.json();
        console.log("API@create-transaction body:", body);
        const response = await axios.post("http://localhost:5000/api/create-transaction", body);
        const { snapToken } = response.data;

        return new Response(JSON.stringify({ snapToken }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}