import type { Metadata } from "next";
import { GalleryPage } from "@/Components/GalleryPage";

export const metadata: Metadata = {
  title: "Bộ ảnh cưới — Văn Phong & Hồng Nhung",
  description: "Toàn bộ khoảnh khắc đẹp trong ngày cưới của Văn Phong & Hồng Nhung 07.05.2023",
  openGraph: {
    title: "Bộ ảnh cưới — Văn Phong & Hồng Nhung",
    description: "Toàn bộ khoảnh khắc đẹp trong ngày cưới của Văn Phong & Hồng Nhung 07.05.2023",
    images: [{ url: "/images/PTH_1768.JPG", width: 1200, height: 800, alt: "Bộ ảnh cưới Văn Phong & Hồng Nhung" }],
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    title: "Bộ ảnh cưới — Văn Phong & Hồng Nhung",
    description: "Toàn bộ khoảnh khắc đẹp trong ngày cưới của Văn Phong & Hồng Nhung 07.05.2023",
    images: ["/images/PTH_1768.JPG"],
  },
};

export default function Gallery() {
  return <GalleryPage />;
}
