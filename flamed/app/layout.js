import './globals.css';
import Navbar from './components/Navbar';
import { Inter, Roboto } from 'next/font/google'; // Example fonts

// Geist fonts are not on Google Fonts directly, so pick close alternatives
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Swipe App',
  description: 'Tinder-like swipe cards built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${roboto.variable}`} lang="en">
      <body className="flex flex-col min-h-screen antialiased">
        <header className="text-white" style={{ background: "var(--nav-footer-bg)" }}>
          <Navbar />
        </header>

        <main className="flex-grow container mx-auto p-4">{children}</main>

        <footer className="text-white p-4" style={{ background: "var(--nav-footer-bg)" }}>
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} Our Website. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
