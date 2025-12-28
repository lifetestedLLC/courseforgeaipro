export const metadata = {
  title: 'CourseForge AI Pro',
  description: 'AI-powered course creation and management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
