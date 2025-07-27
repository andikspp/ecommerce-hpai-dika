export const metadata = {
    title: "Profil - Agen HPAI Ika",
    description: "Kelola profil Anda di Agen HPAI Ika.",
};

// import content dari profilePage
import ProfilePage from "./profilePage";

export default function Profile() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-green-900 shadow-lg rounded-xl p-8">
                <ProfilePage />
            </div>
        </div>
    );
}