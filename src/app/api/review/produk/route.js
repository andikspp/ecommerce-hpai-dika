import axios from "axios";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("id");

        if (!productId) {
            return new Response(JSON.stringify({
                success: false,
                message: "Product ID diperlukan"
            }), { status: 400 });
        }

        // Panggil backend Express API
        const response = await axios.get(
            `http://localhost:5000/api/reviews/product/${productId}`
        );
        return new Response(JSON.stringify(response.data), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: error.message
        }), { status: 500 });
    }
}