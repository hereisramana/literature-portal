import { Manrope, Nunito } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers";

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
  icons: {
    icon: [
      { url: "/assets/logo-dark.png", media: "(prefers-color-scheme: light)" },
      { url: "/assets/logo-light.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
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
                
                // Dynamic favicon based on theme
                var link = document.querySelector("link[rel~='icon']");
                if (!link) {
                  link = document.createElement('link');
                  link.rel = 'icon';
                  document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = t === 'dark' ? '/assets/logo-light.png' : '/assets/logo-dark.png';
              } catch(e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            `,
          }}
        />
      </head>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
