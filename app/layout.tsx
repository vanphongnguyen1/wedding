import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Header from "@/Components/Header";
import { Toaster } from "@/Components/ui/sonner";
import "./globals.css";
import { WeddingPetals } from "@/Components/WeddingPetals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phongnhung.netlify.app"),
  title: "Văn Phong & Hồng Nhung — Wedding 07.05.2023",
  description: "Trân trọng kính mời bạn tham dự lễ cưới của Văn Phong & Hồng Nhung",
  openGraph: {
    title: "Văn Phong & Hồng Nhung — Wedding 07.05.2023",
    description: "Trân trọng kính mời bạn tham dự lễ cưới của Văn Phong & Hồng Nhung",
    images: [{ url: "/images/PTH_1768.JPG", width: 1200, height: 800, alt: "Văn Phong & Hồng Nhung Wedding" }],
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Văn Phong & Hồng Nhung — Wedding 07.05.2023",
    description: "Trân trọng kính mời bạn tham dự lễ cưới của Văn Phong & Hồng Nhung",
    images: ["/images/PTH_1768.JPG"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Header />
        {children}
        <Toaster position="top-right" offset="60px" />
              {/* ── PETALS ── */}
      <WeddingPetals />
      </body>
    </html>
  );
}
