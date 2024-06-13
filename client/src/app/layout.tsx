import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import { StoreProvider } from "@/components/provider/redux.provider";
const inter = Inter({ subsets: ["latin"] });
// import Head from "next/head";

export const metadata: Metadata = {
  title: "Tickzy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Head>
        <img
          src="https://i.ibb.co.com/XWMvj0b/Tickzy-1.png"
          alt=""
          rel="icon"
        />
      </Head> */}

      <html lang="en">
        <body className=" overflow-x-hidden">
          <main>
            <StoreProvider>{children}</StoreProvider>
          </main>
        </body>
      </html>
    </>
  );
}
