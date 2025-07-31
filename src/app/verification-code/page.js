export const metadata = {
  title: "Verifikasi Email",
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