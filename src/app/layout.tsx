import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Dunia Beauty | دنيا بيوتي - E-Commerce",
  description: "Discover high-quality Perfumes, Makeup, and Pajamas at Dunia Beauty. Shop now with easy ordering via WhatsApp! | تسوقي أفخم العطور والمكياج والبيجامات من دنيا بيوتي. اطلبي الآن بسهولة عبر واتساب!",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#fffafb] text-neutral-800 antialiased selection:bg-pink-100 selection:text-pink-600 pb-16 md:pb-0">
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <BottomNav />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
