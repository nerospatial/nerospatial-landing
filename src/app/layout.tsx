import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "./core/hooks/useSnackbar";
import SmoothScroll from "@/components/core/SmoothScroll";

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeroSpatial - AR/AI Spatial Intelligence",
  description:
    "Revolutionizing spatial intelligence with AR and AI technologies for immersive experiences and data-driven insights.",
  icons: {
    icon: "/nerospatial-logo.svg",
  },
  openGraph: {
    title: "NeroSpatial - AR/AI Spatial Intelligence",
    description:
      "Revolutionizing spatial intelligence with AR and AI technologies for immersive experiences and data-driven insights.",
    images: [
      {
        url: "/nerospatial-logo.svg",
        width: 1200,
        height: 630,
        alt: "NeroSpatial Logo",
      },
    ],
  },
};

import Loader from "@/app/core/components/Loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
      >
        <Loader />
        <SmoothScroll>
          <SnackbarProvider>{children}</SnackbarProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
