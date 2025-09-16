import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Our Website',
  description: 'A simple Next.js + TailwindCSS website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#E8D4B7]">
        {/* Header */}
        <header className="bg-[#9B177E] text-white">
          <Navbar />
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#9B177E] text-white p-4">
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} Our Website. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}