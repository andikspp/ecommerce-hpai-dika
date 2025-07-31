import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarClient from "./navbar";
import FooterClient from "./footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Distributor HPAI Ika",
  description: "Belanja produk herbal HPAI asli, aman, dan terpercaya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <NavbarClient />
        <main>{children}</main>
        <FooterClient />
      </body>
    </html>
  );
}