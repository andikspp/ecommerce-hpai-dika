import axios from "axios";

export async function GET(request) {
    // Ambil data produk dari backend
    try {
        const res = await axios.get("http://localhost:5000/api/admin/produk");

        // Kembalikan response dari backend ke frontend
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

export async function POST(request) {
    try {
        const formData = await request.formData();

        // Debug: tampilkan semua field yang akan dikirim ke backend
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // Kirim FormData ke backend
        const res = await fetch("http://localhost:5000/api/admin/produk", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Terjadi kesalahan pada server Next.js" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// update produk status
export async function PATCH(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "ID produk wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { isActive } = await request.json();
        const res = await axios.patch(`http://localhost:5000/api/admin/produk/${id}/status`, { isActive });

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

export async function PUT(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "ID produk wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const formData = await request.formData();
        const res = await fetch(`http://localhost:5000/api/admin/produk/${id}`, {
            method: "PUT",
            body: formData,
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Terjadi kesalahan pada server Next.js" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}