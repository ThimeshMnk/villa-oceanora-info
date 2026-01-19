import { Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";

const sinhalaFont = Noto_Sans_Sinhala({ 
  subsets: ["sinhala"],
  weight: ['400', '700'] 
});

export const metadata = {
  title: "විලා වෙන්කිරීම්",
  description: "Villa Booking Management",
};

export default function RootLayout({ children }) {
  return (
     <html lang="si" suppressHydrationWarning>
      <body className={sinhalaFont.className}>{children}</body>
    </html>
  );
}