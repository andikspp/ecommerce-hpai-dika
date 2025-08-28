import axios from "axios";

export async function POST(request) {
    try {
        console.log("API@create-order berjalan di blok try", request);
        const body = await request.json();
        console.log('Creating order with data:', body);

        const response = await axios.post('http://localhost:5000/api/orders', body);

        console.log('Order created successfully:', response.data);

        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (err) {
        console.error("Error in POST request:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const orderId = url.searchParams.get("id");
        const userId = url.searchParams.get("userId");
        if (orderId) {
            // Jika ada id, panggil endpoint GET_ORDER_BY_ID
            console.log(`API@get-order-by-id berjalan di blok try untuk ID: ${orderId}`);
            const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
            console.log('Order fetched successfully:', response.data);
            return new Response(JSON.stringify(response.data), { status: response.status });
        } else if (userId) {
            // Jika ada userId, panggil endpoint GET_ORDER_BY_USER_ID
            console.log(`API@get-orders-by-user berjalan di blok try untuk userId: ${userId}`);
            const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
            console.log('Orders by user fetched successfully:', response.data);
            return new Response(JSON.stringify(response.data), { status: response.status });
        }
        else {
            // Jika tidak ada id, ambil semua order
            console.log("API@get-orders berjalan di blok try", request);
            const response = await axios.get('http://localhost:5000/api/orders');
            console.log('Orders fetched successfully:', response.data);
            return new Response(JSON.stringify(response.data), { status: response.status });
        }
    } catch (err) {
        console.error("Error in GET request:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const url = new URL(request.url);
        const orderId = url.searchParams.get("id");

        const body = await request.json();
        // Kirim PUT ke backend
        const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, body);

        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (err) {
        console.error("Error in PATCH request:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}