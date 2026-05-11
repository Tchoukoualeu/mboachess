import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import queenIcon from "./queen.png";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mboachess - Chess in Cameroon | Players, Clubs & Tournaments",
  description:
    "The hub for chess in Cameroon. Track Cameroonian chess players' ratings, discover local chess clubs, view upcoming tournaments, and connect with the chess community across Cameroon.",
  icons: {
    icon: [{ url: queenIcon.src, type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
