import "./globals.css";

export const metadata = {
  title: "Literature Portal"
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}