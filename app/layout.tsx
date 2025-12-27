import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourseForge AI - Create Courses with AI",
  description: "Generate professional courses, videos, and quizzes with AI. Export to Coursera, Udemy, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
