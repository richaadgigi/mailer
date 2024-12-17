import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Nav from "@/components/globals/Nav";
import {Head} from "next/document";
import Analytics from "@/components/globals/Analytics";

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

const satoshi = localFont({
  src:[
    {
      path: './fonts/Satoshi-Regular.otf'
    },
    {
      path: './fonts/Satoshi-Black.otf'
    },
    {
      path: './fonts/Satoshi-Bold.otf'
    },
    {
      path: './fonts/Satoshi-Light.otf'
    },
    {
      path: './fonts/Satoshi-Medium.otf'
    },
  ]
})

export const metadata: Metadata = {
  title: "Mailer by Xnyder | Streamlined Bulk Emailing for Custom Campaigns",
  description: "Send personalized emails effortlessly with Mailer by Xnyder. Manage bulk campaigns using your custom email address, ensuring professional and effective communication for businesses of all sizes.",
  manifest: "/site.webmanifest",
  keywords: 'Mailer, Bulk Emails, Fast Emailing service, Emails, Xynder, ',
  icons: {
    apple: [
      {
        url: '/apple-touch-icon.png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512'
      },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192'
      },
    ],
    icon: [
      {
        sizes: '32x32',
        url: '/favicon-32x32.png',
        type: 'image/x-icon'
    }
  ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.className} antialiased bg-[#f1f1f1] `}
      >
         <Nav/>
         <Analytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
