export const metadata = {
    title: "Reset Password - Agen HPAI Ika",
    description: "Reset password akun Anda dengan link yang dikirim ke email terdaftar.",
};

import ResetPasswordPage from "./resetLink";

export default function ResetPassword() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-8">
            <ResetPasswordPage />
        </div>
    );
}