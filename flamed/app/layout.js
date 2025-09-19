import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Our Website',
  description: 'A simple Next.js + TailwindCSS website',
  title: "Swipe App",
  description: "Tinder-like swipe cards built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        {/* Header */}
        <header
          className="text-white"
          style={{ background: "var(--nav-footer-bg)" }}
        >
          <Navbar />
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto p-4">{children}</main>

        {/* Footer */}
        <footer
          className="text-white p-4"
          style={{ background: "var(--nav-footer-bg)" }}
        >
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} Our Website. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
