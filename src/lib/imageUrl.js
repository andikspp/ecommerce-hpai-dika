// URL gambar produk untuk atribut src.
// - URL lengkap (https://..., dari object storage S3/R2): dipakai apa adanya.
// - Path lama "/uploads/...": disajikan backend, jadi digabung dengan NEXT_PUBLIC_API_URL.
// - Kosong: gambar placeholder.
const PLACEHOLDER = "/file.svg";

export function productImageSrc(url) {
    if (!url) return PLACEHOLDER;
    if (/^https?:\/\//.test(url)) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || ""}${url}`;
}
