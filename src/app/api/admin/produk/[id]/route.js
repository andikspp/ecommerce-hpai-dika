import axios from "axios";

export async function GET(request, { params }) {
    const { id } = params;
    if (!id) {
        return new Response(JSON.stringify({ error: "ID produk wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const res = await axios.get(`http://localhost:5000/api/admin/produk/${id}`);
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

export async function PUT(request, { params }) {
    const { id } = params;
    try {
        const formData = await request.formData();
        // Kirim FormData ke backend
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
        return new Response(JSON.stringify({ error: "Gagal update produk" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    if (!id) {
        return new Response(JSON.stringify({ error: "ID produk wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const res = await axios.delete(`http://localhost:5000/api/admin/produk/${id}`);
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