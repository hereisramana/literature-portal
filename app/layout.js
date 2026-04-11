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
        {/* Blocking script: reads saved theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('enlit-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
