import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Media Tracker",
  description: "Track my Anime and Manga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* This is where the icons link goes */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
      </head>
      {/* 
         Removed bg-gray-900 and text-white so your 
         new "Media Vault" styles show up correctly 
      */}
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}