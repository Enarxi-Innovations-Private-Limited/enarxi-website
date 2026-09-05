import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | Enarxi Innovations",
    default: "Electronic Manufacturing & IT Services in Chennai | Enarxi",
  },
  description: "Enarxi Innovations: Your premier partner for PCB design, OEM manufacturing, and custom IT services in Chennai. Scale your business today.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.enarxi.com/",
    siteName: "Enarxi Innovations",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
