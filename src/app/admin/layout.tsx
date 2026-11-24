import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Panitia — Open Recruitment BDCA",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
