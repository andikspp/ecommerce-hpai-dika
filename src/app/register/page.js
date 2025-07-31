export const metadata = {
  title: "Register",
  description: "Daftar akun baru untuk belanja produk herbal HPAI.",
};

import RegisterForm from "./registerForm";

export default function RegisterPage() {
  return (
    <div>
      {/* Section pengenalan */}
      <RegisterForm />
    </div>
  );
}