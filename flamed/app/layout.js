import './globals.css';

export const metadata = {
  title: 'My Website',
  description: 'A simple Next.js + TailwindCSS website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Our Website</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4">
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} Our Website. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
