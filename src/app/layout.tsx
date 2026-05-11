import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "./sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Scotland Travel",
    template: "%s | Scotland Travel",
  },
  description: "A mobile-first Scotland trip planner from Edinburgh to Inverness.",
  manifest: "/manifest.json",
  applicationName: "Scotland Travel",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Scotland Travel",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f766e",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f7f4ee]">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
