export const metadata = {
    title: "Lupa Password",
    description: "Reset password akun Anda dengan email terdaftar.",
};

import ForgotPasswordPage from "./forgotPassword";

export default function ForgotPassword() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-800 px-4 py-8">
            <ForgotPasswordPage />
        </div>
    );
}

