"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

// Component yang menggunakan useSearchParams
function OrderConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || searchParams.get("id");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [finishing, setFinishing] = useState(false);
    const [ratings, setRatings] = useState({});
    const [reviews, setReviews] = useState({});
    const [submittingReview, setSubmittingReview] = useState({});
    const [userId, setUserId] = useState(null);
    const [reviewedProducts, setReviewedProducts] = useState(new Set());
    const [existingReviews, setExistingReviews] = useState([]);

    useEffect(() => {
        const fetchOrderAndReviews = async () => {
            if (!orderId) {
                setError("Order ID tidak ditemukan");
                setLoading(false);
                return;
            }

            try {
                // Fetch order data
                const orderRes = await axios.get(`/api/orders/${orderId}`);
                if (orderRes.data) {
                    setOrder(orderRes.data);
                    setUserId(orderRes.data.userId);

                    // Initialize ratings dan reviews untuk setiap item
                    const initialRatings = {};
                    const initialReviews = {};
                    orderRes.data.items?.forEach(item => {
                        initialRatings[item.product.id] = 0;
                        initialReviews[item.product.id] = '';
                    });
                    setRatings(initialRatings);
                    setReviews(initialReviews);

                    // Fetch existing reviews untuk order ini
                    try {
                        const reviewsRes = await axios.get(`/api/review/order?orderId=${orderId}`);
                        if (reviewsRes.data && reviewsRes.data.success) {
                            const reviewsData = reviewsRes.data.reviews;
                            setExistingReviews(reviewsData);

                            const reviewedProductIds = new Set(reviewsData.map(review => review.productId));
                            setReviewedProducts(reviewedProductIds);

                            console.log("Existing reviews found:", reviewsData);
                            console.log("Reviewed product IDs:", Array.from(reviewedProductIds));
                        }
                    } catch (reviewError) {
                        console.log("No existing reviews found or error fetching reviews:", reviewError);
                        setExistingReviews([]);
                    }
                }
                console.log("Order fetched successfully:", orderRes.data);
            } catch (err) {
                setError("Gagal memuat data pesanan");
                console.error("Error fetching order:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndReviews();
    }, [orderId]);

    const handleSetRating = (productId, rating) => {
        setRatings(prev => ({
            ...prev,
            [productId]: rating
        }));
    };

    const handleSetReview = (productId, review) => {
        setReviews(prev => ({
            ...prev,
            [productId]: review
        }));
    };

    const handleSubmitReview = async (item) => {
        const productId = item.product.id;
        const rating = ratings[productId];
        const review = reviews[productId];

        if (!rating || rating === 0) {
            await Swal.fire({
                icon: 'warning',
                title: 'Rating Diperlukan',
                text: 'Silakan beri rating sebelum mengirim ulasan.',
                confirmButtonColor: '#10B981'
            });
            return;
        }

        if (!review || review.trim() === '') {
            await Swal.fire({
                icon: 'warning',
                title: 'Ulasan Diperlukan',
                text: 'Silakan tulis ulasan sebelum mengirim.',
                confirmButtonColor: '#10B981'
            });
            return;
        }

        setSubmittingReview(prev => ({ ...prev, [productId]: true }));

        try {
            const res = await axios.post('/api/review', {
                orderId: order.id,
                productId: productId,
                rating: rating,
                review: review,
                userId: userId
            });

            if (res.data && res.data.success) {
                // Update set reviewedProducts
                setReviewedProducts(prev => new Set([...prev, productId]));

                // Tambahkan review baru ke existingReviews state
                const newReview = {
                    id: res.data.review?.id || Date.now(),
                    productId: productId,
                    orderId: order.id,
                    userId: userId,
                    rating: rating,
                    review: review,
                    createdAt: new Date().toISOString(),
                    user: {
                        name: res.data.review?.user?.name || 'Anda'
                    },
                    product: {
                        name: item.product.name
                    }
                };

                // Update existingReviews dengan review baru
                setExistingReviews(prev => [...prev, newReview]);

                // Reset form untuk item ini
                setRatings(prev => ({ ...prev, [productId]: 0 }));
                setReviews(prev => ({ ...prev, [productId]: '' }));

                await Swal.fire({
                    icon: 'success',
                    title: 'Terima kasih atas ulasan Anda! 🌟',
                    html: `
                    <div class="text-center">
                        <div class="text-5xl mb-4">${'⭐'.repeat(rating)}</div>
                        <p class="text-lg text-gray-700 mb-2">
                            Ulasan untuk <strong>${item.product.name}</strong> berhasil dikirim!
                        </p>
                        <p class="text-sm text-gray-500">
                            Ulasan Anda sangat membantu pembeli lain
                        </p>
                    </div>
                `,
                    confirmButtonText: 'Oke, Terima Kasih!',
                    confirmButtonColor: '#10B981',
                    timer: 3000,
                    timerProgressBar: true
                });
            } else {
                throw new Error(res.data?.message || "Gagal mengirim ulasan");
            }
        } catch (error) {
            console.error("Error submitting review:", error);

            // Handle error untuk produk yang sudah direview
            if (error?.response?.data?.message?.includes('sudah memberikan ulasan')) {
                setReviewedProducts(prev => new Set([...prev, productId]));

                try {
                    const reviewsRes = await axios.get(`/api/review/order?orderId=${order.id}`);
                    if (reviewsRes.data && reviewsRes.data.success) {
                        const reviewsData = reviewsRes.data.reviews;
                        setExistingReviews(reviewsData);

                        const reviewedProductIds = new Set(reviewsData.map(review => review.productId));
                        setReviewedProducts(reviewedProductIds);
                    }
                } catch (fetchError) {
                    console.error("Error fetching updated reviews:", fetchError);
                }

                await Swal.fire({
                    icon: 'info',
                    title: 'Produk Sudah Diulas',
                    text: 'Anda sudah memberikan ulasan untuk produk ini sebelumnya.',
                    confirmButtonColor: '#10B981'
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mengirim Ulasan',
                    text: error?.response?.data?.message || error.message || 'Terjadi kesalahan, silakan coba lagi.',
                    confirmButtonColor: '#EF4444'
                });
            }
        } finally {
            setSubmittingReview(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleFinishOrder = async () => {
        if (!order) return;
        setFinishing(true);

        try {
            const res = await axios.patch(`/api/order?id=${order.id}`, {
                status: "delivered"
            });

            if (res.data) {
                setOrder({ ...order, status: "delivered" });

                await Swal.fire({
                    icon: 'success',
                    title: 'Pesanan Selesai! 🎉',
                    html: `
                    <div class="text-center">
                        <div class="text-6xl mb-4">📦</div>
                        <p class="text-lg text-gray-600 mb-2">
                            Terima kasih telah mengonfirmasi pesanan!
                        </p>
                        <p class="text-sm text-gray-500">
                            Pesanan <strong>#${order.noOrder || order.orderId || order.id}</strong> 
                            telah diselesaikan
                        </p>
                        <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p class="text-green-700 text-sm">
                                🌟 Sekarang Anda bisa memberikan rating dan ulasan untuk produk yang dibeli!
                            </p>
                        </div>
                    </div>
                `,
                    confirmButtonText: 'Oke, Terima Kasih!',
                    confirmButtonColor: '#10B981',
                    background: '#ffffff',
                    backdrop: `
                    rgba(16, 185, 129, 0.1)
                    url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%2310B981' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")
                    left top
                    repeat
                `,
                    showClass: {
                        popup: 'animate__animated animate__bounceIn'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__bounceOut'
                    },
                    timer: 5000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    customClass: {
                        popup: 'rounded-3xl shadow-2xl',
                        title: 'text-2xl font-bold text-gray-800',
                        confirmButton: 'px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5'
                    }
                });
            }
        } catch (error) {
            console.error("Error finishing order:", error);

            await Swal.fire({
                icon: 'error',
                title: 'Oops! Ada Kesalahan 😔',
                html: `
                <div class="text-center">
                    <div class="text-6xl mb-4">⚠️</div>
                    <p class="text-lg text-gray-600 mb-2">
                        Gagal menyelesaikan pesanan
                    </p>
                    <p class="text-sm text-gray-500 mb-4">
                        Silakan coba lagi dalam beberapa saat
                    </p>
                    <div class="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p class="text-red-700 text-sm">
                            💡 Jika masalah berlanjut, hubungi customer service
                        </p>
                    </div>
                </div>
            `,
                confirmButtonText: 'Coba Lagi',
                confirmButtonColor: '#EF4444',
                showCancelButton: true,
                cancelButtonText: 'Hubungi CS',
                cancelButtonColor: '#6B7280',
                background: '#ffffff',
                customClass: {
                    popup: 'rounded-3xl shadow-2xl',
                    title: 'text-2xl font-bold text-gray-800',
                    confirmButton: 'px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 mr-2',
                    cancelButton: 'px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5'
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    window.open('https://wa.me/6282294317043?text=Halo,%20saya%20mengalami%20masalah%20dengan%20pesanan%20saya', '_blank');
                }
            });
        } finally {
            setFinishing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat konfirmasi pesanan...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
                    <div className="text-6xl mb-6">❌</div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Pesanan Tidak Ditemukan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {error || "Pesanan yang Anda cari tidak dapat ditemukan."}
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    // Status configurations
    const getStatusConfig = () => {
        if (order.paymentStatus === "pending") {
            return {
                icon: "⏳",
                title: "Menunggu Pembayaran",
                message: "Silakan selesaikan pembayaran Anda untuk memproses pesanan",
                bgGradient: "from-amber-500 to-orange-500",
                cardBg: "bg-amber-50 dark:bg-amber-900/30",
                textColor: "text-amber-800 dark:text-amber-200",
                showDetail: true,
                animation: "animate-pulse"
            };
        } else if (order.paymentStatus === "failed" || order.paymentStatus === "expired") {
            return {
                icon: "❌",
                title: "Pembayaran Gagal",
                message: "Pembayaran Anda gagal atau kadaluarsa. Silakan coba lagi",
                bgGradient: "from-red-500 to-pink-500",
                cardBg: "bg-red-50 dark:bg-red-900/30",
                textColor: "text-red-800 dark:text-red-200",
                showDetail: false,
                animation: "animate-bounce"
            };
        } else if (order.paymentStatus === "paid" && order.status === "shipped") {
            return {
                icon: "🚚",
                title: "Pesanan Sedang Dikirim",
                message: "Pesanan Anda sedang dalam perjalanan",
                bgGradient: "from-green-500 to-purple-500",
                cardBg: "bg-blue-50 dark:bg-blue-900/30",
                textColor: "text-blue-800 dark:text-blue-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        } else if (order.paymentStatus === "paid" && order.status === "delivered") {
            return {
                icon: "📦",
                title: "Pesanan Selesai",
                message: "Pesanan Anda telah sampai di tujuan",
                bgGradient: "from-emerald-500 to-green-500",
                cardBg: "bg-emerald-50 dark:bg-emerald-900/30",
                textColor: "text-emerald-800 dark:text-emerald-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        } else if (order.paymentStatus === "paid" && order.status === "rejected") {
            return {
                icon: "🚫",
                title: "Pesanan Ditolak",
                message: `Mohon maaf, pesanan ditolak: ${order.rejectedReason || 'Alasan tidak tersedia'}`,
                bgGradient: "from-red-500 to-pink-500",
                cardBg: "bg-red-50 dark:bg-red-900/30",
                textColor: "text-red-800 dark:text-red-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        } else {
            return {
                icon: "✅",
                title: "Pesanan Berhasil!",
                message: "Terima kasih! Pesanan Anda telah diterima dan sedang diproses",
                bgGradient: "from-green-500 to-emerald-500",
                cardBg: "bg-green-50 dark:bg-green-900/30",
                textColor: "text-green-800 dark:text-green-200",
                showDetail: true,
                animation: "animate-bounce"
            };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">

            {/* Header */}
            <div className={`bg-gradient-to-r ${statusConfig.bgGradient} py-12`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                            Konfirmasi Pesanan
                        </h1>
                        <p className="text-white/90">
                            Status dan detail pesanan Anda
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    ✓
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Keranjang</span>
                            </div>
                            <div className="w-12 h-0.5 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    ✓
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Checkout</span>
                            </div>
                            <div className="w-12 h-0.5 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                    3
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Konfirmasi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

                {/* Status Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className={`bg-gradient-to-r ${statusConfig.bgGradient} px-8 py-12 text-center text-white relative overflow-hidden`}>
                        {/* Background decorations */}
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10">
                            <div className={`text-6xl mb-6 ${statusConfig.animation}`}>
                                {statusConfig.icon}
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                {statusConfig.title}
                            </h2>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
                                {statusConfig.message}
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
                                <p className="text-sm font-medium">Nomor Pesanan</p>
                                <p className="text-xl font-bold">
                                    #{orderId}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    {statusConfig.showDetail && (
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">

                                {/* Order Info */}
                                <div className={`${statusConfig.cardBg} rounded-2xl p-6`}>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Informasi Pesanan
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-gray-600 dark:text-gray-400">Tanggal Pemesanan</span>
                                            <span className="font-semibold text-gray-800 dark:text-white">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric"
                                                }) : '-'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-gray-600 dark:text-gray-400">Status Pembayaran</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                order.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {order.paymentStatus === 'paid' ? 'Lunas' :
                                                    order.paymentStatus === 'pending' ? 'Menunggu' : 'Gagal'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-gray-600 dark:text-gray-400">Status Pesanan</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    order.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                        order.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                                }`}>
                                                {order.status === 'delivered' ? 'Selesai' :
                                                    order.status === 'shipped' ? 'Dikirim' :
                                                        order.status === 'accepted' ? 'Dikonfirmasi' :
                                                            order.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                            </span>
                                        </div>

                                        {order.status === 'shipped' && (
                                            <>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                                    <span className="text-gray-600 dark:text-gray-400">Jasa Pengiriman</span>
                                                    <span className="font-semibold text-gray-800 dark:text-white">
                                                        {order.shippingMethod?.toUpperCase() || '-'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-gray-600 dark:text-gray-400">No. Resi</span>
                                                    <span className="font-mono font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {order.resiNumber || '-'}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className={`${statusConfig.cardBg} rounded-2xl p-6`}>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Ringkasan Pesanan
                                    </h3>

                                    {/* Items */}
                                    <div className="space-y-3 mb-6">
                                        {order.items?.length > 0 ? order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                                                    {item.product?.imageUrl ? (
                                                        <img
                                                            src={item.product.imageUrl.startsWith("http")
                                                                ? item.product.imageUrl
                                                                : `${process.env.NEXT_PUBLIC_API_URL}${item.product.imageUrl}`}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {item.product?.name || 'Produk'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Qty: {item.quantity} × Rp {item.price?.toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-gray-400 italic text-center py-4">
                                                Detail item tidak tersedia
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Subtotal</span>
                                            <span>
                                                Rp {((order.total || 0) - (order.ongkir || 0)).toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>Ongkos Kirim</span>
                                            <span>
                                                {order.ongkir !== undefined
                                                    ? `Rp ${order.ongkir.toLocaleString('id-ID')}`
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                                            <span>Total Bayar</span>
                                            <span className="text-green-600 dark:text-green-400">
                                                Rp {order.total?.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rating & Review Section - Hanya tampil jika pesanan delivered */}
                {order.status === "delivered" && order.items?.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Beri Rating & Ulasan</h3>
                                    <p className="text-yellow-100 text-sm">Bagikan pengalaman Anda dengan produk yang dibeli</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="space-y-8">
                                {order.items.map((item) => {
                                    const isReviewed = reviewedProducts.has(item.product.id);
                                    const existingReview = existingReviews?.find(
                                        (review) => review.productId === item.product.id
                                    );

                                    return (
                                        <div
                                            key={item.product.id}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                                                    {item.product?.imageUrl ? (
                                                        <img
                                                            src={item.product.imageUrl.startsWith("http")
                                                                ? item.product.imageUrl
                                                                : `${process.env.NEXT_PUBLIC_API_URL}${item.product.imageUrl}`}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="text-2xl">📦</div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                        {item.product.name}
                                                    </h4>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        Quantity: {item.quantity} • Harga: Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                                {isReviewed && (
                                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                                                        ✓ Sudah Diulas
                                                    </div>
                                                )}
                                            </div>

                                            {!isReviewed ? (
                                                <div>
                                                    {/* Rating Stars */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Rating Produk
                                                        </label>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => handleSetRating(item.product.id, star)}
                                                                    className={`text-3xl transition-all duration-200 hover:scale-110 ${ratings[item.product.id] >= star
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-300 hover:text-yellow-300"
                                                                        }`}
                                                                >
                                                                    ★
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {ratings[item.product.id] > 0 && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {ratings[item.product.id]} dari 5 bintang
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Review Text */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Ulasan Anda
                                                        </label>
                                                        <textarea
                                                            className="w-full rounded-lg border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:text-white p-3 min-h-[100px] resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                            rows={4}
                                                            placeholder="Ceritakan pengalaman Anda menggunakan produk ini..."
                                                            value={reviews[item.product.id] || ""}
                                                            onChange={(e) => handleSetReview(item.product.id, e.target.value)}
                                                        />
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button
                                                        onClick={() => handleSubmitReview(item)}
                                                        disabled={submittingReview[item.product.id]}
                                                        className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none"
                                                    >
                                                        {submittingReview[item.product.id] ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Mengirim...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                                </svg>
                                                                Kirim Ulasan
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <div className="text-5xl mb-4">
                                                        {existingReview?.rating ? "⭐".repeat(existingReview.rating) : "⭐⭐⭐⭐⭐"}
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                                                        Terima kasih atas ulasan Anda!
                                                    </p>
                                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                                        Ulasan Anda membantu pembeli lain membuat keputusan yang tepat
                                                    </p>
                                                    {existingReview?.review && (
                                                        <div className="mt-4 bg-gray-100 dark:bg-gray-600 rounded-lg p-4">
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                                "{existingReview.review}"
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                                Ditulis pada {new Date(existingReview.createdAt).toLocaleDateString("id-ID")}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Kembali ke Beranda
                    </Link>

                    <Link
                        href="/orders"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Lihat Semua Pesanan
                    </Link>

                    <Link
                        href="/product"
                        className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Belanja Lagi
                    </Link>

                    {/* Button Selesaikan Pesanan - hanya muncul jika status shipped */}
                    {order.paymentStatus === "paid" && order.status === "shipped" && (
                        <button
                            onClick={handleFinishOrder}
                            disabled={finishing}
                            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none"
                        >
                            {finishing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Pesanan Sudah Sampai
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Loading component untuk fallback
function OrderConfirmationLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Memuat konfirmasi pesanan...</p>
            </div>
        </div>
    );
}

// Main component dengan Suspense wrapper
export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<OrderConfirmationLoading />}>
            <OrderConfirmationContent />
        </Suspense>
    );
}