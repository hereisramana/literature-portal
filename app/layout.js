import { Manrope, Nunito } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "EnLit | Exam Revision Portal",
  description: "A comprehensive literature exam revision portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${nunito.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-bg-primary: #F8F7F4;
            --color-text-strong: #1C2621;
          }
          body {
            background-color: var(--color-bg-primary);
            margin: 0;
          }
          .lcp-brand {
            font-family: var(--font-display);
            color: var(--color-text-strong);
            visibility: hidden; /* Prevent FOUC if font is loading */
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
