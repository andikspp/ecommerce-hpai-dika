export const metadata = {
    title: "Edit Profil",
    description: "Edit profil Anda di Distributor HPAI Ika.",
};

import EditProfilePage from "./editProfilePage";

export default function EditProfile() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-green-900 shadow-lg rounded-xl p-8">
                <EditProfilePage />
            </div>
        </div>
    );
}