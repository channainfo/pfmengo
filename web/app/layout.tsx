"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
