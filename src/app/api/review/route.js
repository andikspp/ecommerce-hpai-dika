import axios from "axios";

export async function POST(request) {
    try {
        console.log("Received POST /api/review request");
        const body = await request.json();
        const { orderId, productId, rating, review, userId } = body;

        // Validasi data wajib
        if (!orderId || !productId || !rating || !review || !userId) {
            return new Response(JSON.stringify({ success: false, message: "Data tidak lengkap" }), { status: 400 });
        }

        const response = await axios.post("http://localhost:5000/api/reviews", {
            orderId,
            productId,
            rating,
            review,
            userId
        });

        if (response.data && response.data.success) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, message: response.data?.message || "Gagal menyimpan review" }), { status: 500 });
        }
    } catch (err) {
        console.error("Error in POST /api/review:", err);
        console.log("Error message:", err.message);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}