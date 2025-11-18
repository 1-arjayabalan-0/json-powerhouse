import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideNav from "./components/SideNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JSON Supertool – Convert, Validate & Transform JSON",
  description: "A powerful suite of JSON tools: formatter, validator, CSV converter, YAML converter, diff, schema generator and more.",
  keywords: [
    "json formatter",
    "json validator",
    "json to csv",
    "json to yaml",
    "developer tools"
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex bg-gray-950 text-gray-100">
        <SideNav />
        <div className="flex-1">
          {/* <Navbar /> */}
          {children}
        </div>
      </body>
    </html>
  );
}
