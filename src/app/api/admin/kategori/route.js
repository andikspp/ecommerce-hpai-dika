import axios from "axios";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    try {
        let res;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        if (id) {
            // Ambil kategori by id
            res = await axios.get(`${apiUrl}/api/kategori/${id}`);
        } else {
            // Ambil semua kategori
            res = await axios.get(`${apiUrl}/api/kategori`);
        }

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
    // Kirim data kategori baru ke backend
    try {
        const { nama } = await request.json();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.post(`${apiUrl}/api/kategori`, { nama });

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

export async function PUT(request) {
    const { pathname } = new URL(request.url);
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1] || null;
    const { name, description, isActive } = await request.json();

    if (!id || id === "kategori") {
        return new Response(JSON.stringify({ error: "ID kategori wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.put(`${apiUrl}/api/kategori/${id}`, { name, description, isActive });
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

export async function DELETE(request) {
    // Ambil id dari path
    const { pathname } = new URL(request.url);
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1] || null;

    if (!id || id === "kategori") {
        return new Response(JSON.stringify({ error: "ID kategori wajib diisi" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.delete(`${apiUrl}/api/kategori/${id}`);
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