import axios from "axios";

export async function GET(request) {
    try {
        console.log("Received GET /api/review/order request");
        // Ambil orderId dari query parameter (?orderId=...)
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return new Response(JSON.stringify({ success: false, message: "orderId diperlukan" }), { status: 400 });
        }

        // Panggil backend utama untuk ambil review berdasarkan orderId
        const response = await axios.get(`http://localhost:5000/api/reviews/order/${orderId}`);

        if (response.data && response.data.success) {
            return new Response(JSON.stringify({
                success: true,
                reviews: response.data.reviews
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                success: false,
                message: response.data?.message || "Gagal mengambil data review"
            }), { status: 500 });
        }
    } catch (err) {
        console.error("Error in GET /api/review/order:", err);
        return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
    }
}