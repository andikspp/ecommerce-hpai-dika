export const metadata = {
  title: "Login",
  description: "Login untuk belanja produk herbal HPAI asli.",
};

import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div>
      {/* Section Pengenalan */}
      <LoginForm />
    </div>
  );
}