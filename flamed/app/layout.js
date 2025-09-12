// app/swipe-layout.js
export const metadata = {
  title: 'Swipe App',
  description: 'Tinder-like swipe cards built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"}}>
        {children}
      </body>
    </html>
  )
}