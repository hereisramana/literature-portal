import { Lora, Nunito } from "next/font/google";

import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lora.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
