export const metadata = {
  title: "Verifikasi Email - Agen HPAI Ika",
};

import VerifyCodeForm from "./verifyCodeForm";

export default function VerifyCodePage() {
  return (
    <div>
      {/* Section pengenalan */}
      <VerifyCodeForm />
    </div>
  );
}