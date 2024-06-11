import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import Sidebar2 from "./_component/Sidebar2";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tickzy",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex h-screen`}>
      <Sidebar2 />
      <main className="flex-grow p-4 overflow-auto">{children}</main>
    </div>
  );
}
