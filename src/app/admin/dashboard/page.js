"use client";
import React from "react";
import {
    FaChartBar,
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaDollarSign,
    FaArrowUp,
    FaArrowDown,
    FaEye,
    FaLayerGroup,
    FaPlus,
    FaCog,
    FaUserCheck,
    FaUserTimes,
    FaHashtag,
    FaCalendarAlt
} from "react-icons/fa";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from "recharts";
import AdminSidebar from "@/components/AdminSidebar";
import axios from "axios";
import { useRouter } from "next/navigation";

const COLORS = ["#22c55e", "#16a34a", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, trend, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                {change && (
                    <div className="flex items-center mt-2">
                        {trend === 'up' ? (
                            <FaArrowUp className="text-green-500 mr-1 w-3 h-3" />
                        ) : (
                            <FaArrowDown className="text-red-500 mr-1 w-3 h-3" />
                        )}
                        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {change}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">bulan lalu</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                {Icon && <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />}
            </div>
        </div>
    </div>
);

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon: Icon, onClick, color = "green" }) => {
    const colorClasses = {
        blue: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
        purple: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
        indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
        green: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
        orange: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
    };

    return (
        <div
            onClick={onClick}
            className={`${colorClasses[color] || colorClasses.green} rounded-xl p-6 text-white cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm opacity-90">{description}</p>
                </div>
                {Icon && <Icon className="w-8 h-8 opacity-80" />}
            </div>
        </div>
    );
};

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [dashboardData, setDashboardData] = React.useState({
        totalProducts: 0,
        totalUsers: 0,
        totalCategories: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
        activeProducts: 0,
        inactiveProducts: 0
    });
    const [products, setProducts] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                window.location.href = "/admin/login";
            } else {
                setIsChecking(false);
                loadDashboardData();
            }
        }
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch data dari semua endpoint
            const [productsRes, usersRes, categoriesRes] = await Promise.all([
                axios.get('/api/produk'),
                axios.get('/api/admin/user'),
                axios.get('/api/kategori')
            ]);

            const productsData = productsRes.data || [];
            const usersData = usersRes.data || [];
            const categoriesData = categoriesRes.data || [];

            setProducts(productsData);
            setUsers(usersData);
            setCategories(categoriesData);

            // Calculate statistics
            const verifiedUsers = usersData.filter(user => user.isVerified).length;
            const unverifiedUsers = usersData.filter(user => !user.isVerified).length;
            const activeProducts = productsData.filter(product => product.isActive).length;
            const inactiveProducts = productsData.filter(product => !product.isActive).length;

            setDashboardData({
                totalProducts: productsData.length,
                totalUsers: usersData.length,
                totalCategories: categoriesData.length,
                verifiedUsers,
                unverifiedUsers,
                activeProducts,
                inactiveProducts
            });

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const username = typeof window !== "undefined" ? localStorage.getItem("adminUsername") || "Admin" : "Admin";

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        window.location.href = "/admin/login";
    };

    // Generate chart data from real data
    const generateCategoryChart = () => {
        if (!categories.length) return [];

        return categories.map((category, index) => ({
            name: category.name,
            value: products.filter(product => product.categoryId === category.id).length,
            color: COLORS[index % COLORS.length]
        }));
    };

    // Generate monthly data (simulated based on created dates)
    const generateMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const currentMonth = new Date().getMonth();

        return months.slice(0, currentMonth + 1).map((month, index) => {
            const monthProducts = products.filter(product => {
                if (!product.createdAt) return false;
                const productMonth = new Date(product.createdAt).getMonth();
                return productMonth === index;
            }).length;

            const monthUsers = users.filter(user => {
                if (!user.createdAt) return false;
                const userMonth = new Date(user.createdAt).getMonth();
                return userMonth === index;
            }).length;

            return {
                name: month,
                products: monthProducts,
                users: monthUsers,
                categories: index === currentMonth ? categories.length : Math.max(0, categories.length - (currentMonth - index))
            };
        });
    };

    const getRecentUsers = () => {
        return users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    };

    const getRecentProducts = () => {
        return products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">Memuat Dashboard...</span>
                </div>
            </div>
        );
    }

    const categoryChartData = generateCategoryChart();
    const monthlyData = generateMonthlyData();
    const recentUsers = getRecentUsers();
    const recentProducts = getRecentProducts();

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            <AdminSidebar handleLogout={handleLogout} />

            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Selamat datang kembali, <span className="font-semibold text-green-600">{username}</span>!
                        Berikut ringkasan aktivitas toko Anda hari ini.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Produk"
                        value={loading ? "..." : dashboardData.totalProducts.toLocaleString()}
                        icon={FaBox}
                        onClick={() => router.push('/admin/produk')}
                    />
                    <StatCard
                        title="Total User"
                        value={loading ? "..." : dashboardData.totalUsers.toLocaleString()}
                        icon={FaUsers}
                        onClick={() => router.push('/admin/user')}
                    />
                    <StatCard
                        title="Total Kategori"
                        value={loading ? "..." : dashboardData.totalCategories.toLocaleString()}
                        icon={FaLayerGroup}
                        onClick={() => router.push('/admin/kategori')}
                    />
                    <StatCard
                        title="User Terverifikasi"
                        value={loading ? "..." : dashboardData.verifiedUsers.toLocaleString()}
                        icon={FaUserCheck}
                        onClick={() => router.push('/admin/user')}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status Produk</h3>
                            <FaBox className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Aktif</span>
                                <span className="text-sm font-semibold text-green-600">{dashboardData.activeProducts}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Non-aktif</span>
                                <span className="text-sm font-semibold text-gray-600">{dashboardData.inactiveProducts}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status User</h3>
                            <FaUsers className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Terverifikasi</span>
                                <span className="text-sm font-semibold text-green-600">{dashboardData.verifiedUsers}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Belum Verifikasi</span>
                                <span className="text-sm font-semibold text-orange-600">{dashboardData.unverifiedUsers}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistik Cepat</h3>
                            <FaChartBar className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Rasio Verifikasi</span>
                                <span className="text-sm font-semibold text-blue-600">
                                    {dashboardData.totalUsers > 0 ? Math.round((dashboardData.verifiedUsers / dashboardData.totalUsers) * 100) : 0}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Produk per Kategori</span>
                                <span className="text-sm font-semibold text-purple-600">
                                    {dashboardData.totalCategories > 0 ? Math.round(dashboardData.totalProducts / dashboardData.totalCategories) : 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Aksi Cepat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <QuickActionCard
                            title="Tambah Produk"
                            description="Tambahkan produk baru"
                            icon={FaPlus}
                            onClick={() => router.push('/admin/produk/tambah')}
                            color="blue"
                        />
                        <QuickActionCard
                            title="Tambah Kategori"
                            description="Buat kategori baru"
                            icon={FaLayerGroup}
                            onClick={() => router.push('/admin/kategori/tambah')}
                            color="purple"
                        />
                        <QuickActionCard
                            title="Kelola Produk"
                            description="Lihat semua produk"
                            icon={FaBox}
                            onClick={() => router.push('/admin/produk')}
                            color="indigo"
                        />
                        <QuickActionCard
                            title="Kelola User"
                            description="Manajemen pengguna"
                            icon={FaUsers}
                            onClick={() => router.push('/admin/user')}
                            color="green"
                        />
                        <QuickActionCard
                            title="Kelola Kategori"
                            description="Manajemen kategori"
                            icon={FaCog}
                            onClick={() => router.push('/admin/kategori')}
                            color="orange"
                        />
                    </div>
                </div>

                {/* Charts Section */}
                {!loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Monthly Growth Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaChartBar className="text-green-600" /> Pertumbuhan Bulanan
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#6b7280"
                                        fontSize={12}
                                    />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#f9fafb',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="products"
                                        stackId="1"
                                        stroke="#22c55e"
                                        fill="#22c55e"
                                        fillOpacity={0.3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stackId="1"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaLayerGroup className="text-green-600" /> Distribusi Kategori
                            </h2>
                            {categoryChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                        >
                                            {categoryChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-300">
                                    <p className="text-gray-500 dark:text-gray-400">Belum ada data kategori</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Recent Activity Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Users */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Terbaru</h2>
                            <button
                                onClick={() => router.push('/admin/user')}
                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                                </div>
                            ) : recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                                <FaUsers className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isVerified
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                                                }`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(user.createdAt)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Belum ada user terdaftar</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Produk Terbaru</h2>
                            <button
                                onClick={() => router.push('/admin/produk')}
                                className="text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                                </div>
                            ) : recentProducts.length > 0 ? (
                                recentProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                                <FaBox className="w-3 h-3 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Rp {product.price?.toLocaleString('id-ID')} • Stok: {product.stock}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                                }`}>
                                                {product.isActive ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(product.createdAt)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Belum ada produk ditambahkan</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}