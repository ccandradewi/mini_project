import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "./components/navbar";
import { StoreProvider } from "@/components/provider/redux.provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minpro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <StoreProvider>
            <Navbar />
            {children}
          </StoreProvider>
        </main>
      </body>
    </html>
  );
}
