import { inter } from "@/fonts/fonts";
// Suppress TS error for side-effect CSS import when no .d.ts is present
// @ts-ignore
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Nerasika",
  description: "Nerasika Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" content="noindex, nofollow">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <title>Nerasika</title>
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
