import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#f7faff",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Open Recruitment — Bina Darma Cyber Army (BDCA)",
  description:
    "Portal resmi Open Recruitment Bina Darma Cyber Army (BDCA) Universitas Bina Darma. Pelajari profil komunitas, divisi yang dibuka, dan daftarkan dirimu.",
  metadataBase: new URL("https://oprec.bidarcyberarmy.org"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/bdca-emblem.webp",
  },
  openGraph: {
    title: "Open Recruitment — Bina Darma Cyber Army (BDCA)",
    description:
      "Bergabung dengan komunitas keamanan siber dan teknologi Universitas Bina Darma.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
