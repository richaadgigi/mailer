import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Nav from "@/components/globals/Nav";
import Buymeacoffee from "@/components/globals/Buymeacoffee";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mailer - Effortless mailing service to your clients.",
  description: "Mailer is an effortless mailing service software designed by xynder to assist businesses post mail to your clients..",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f1f1f1] `}
      >
        {/* <Buymeacoffee/> */}
         <Nav/>
        {children}
        <Toaster />
        <script defer data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="xnyderhq" data-description="Support me on Buy me a coffee!" data-message="" data-color="#5F7FFF" data-position="Right" data-x_margin="18" data-y_margin="18"></script>
      </body>
    </html>
  );
}
