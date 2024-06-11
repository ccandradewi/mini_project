import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoice",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex h-screen`}>
      <main className="">{children}</main>
    </div>
  );
}
