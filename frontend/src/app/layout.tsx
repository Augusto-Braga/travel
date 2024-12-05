"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-[100vh] flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
