// components/Intro.js
'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';

export default function Intro() {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const router = useRouter();

  const handleCircleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
    
    setGeneratedCode('GENERATING...');
    
    setTimeout(() => {
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      setGeneratedCode(code);
      
      // Redirect to preferences with the generated code
      router.push(`/preferences?code=${code}`);
    }, 2000);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (codeInput.trim()) {
      if (codeInput.length >= 4) {
        // Redirect to preferences with the entered code
        router.push(`/preferences?code=${codeInput.toUpperCase()}`);
      } else {
        alert('Please enter a valid code (at least 4 characters)');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 relative" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      {/* Welcome Message */}
      <div className="text-center mb-6 mt-8">
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
          Welcome to <span style={{ color: 'var(--accent)' }}>GastroSwipe!</span>
        </h1>
        <p className="text-lg max-w-md" style={{ color: 'var(--muted)' }}>
          Click the circle to generate a code or enter an existing code to join.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow space-y-6">
        
        {/* Clickable Circle */}
        <div className="relative flex items-center justify-center">
          {/* Arrow pointing at circle */}
          <div className="absolute right-full mr-2 flex items-center animate-float">
            <div className="text-lg font-bold whitespace-nowrap" style={{ color: 'var(--muted)' }}>
              Click me!
            </div>
            <svg 
              className={`w-8 h-8 transition-all duration-500 ${isHovered ? 'scale-110' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ color: 'var(--foreground)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          {/* Clickable Circle */}
          <div
            className={`flex items-center justify-center w-50 h-50 md:w-66 md:h-66 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              isClicked ? 'animate-subtle-ping' : ''
            }`}
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--nav-text)'
            }}
            onClick={handleCircleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Plus size={120} className="transition-transform duration-300 hover:rotate-90" />
          </div>
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <div className="border rounded-2xl p-6 text-center animate-fade-in" 
               style={{ backgroundColor: 'var(--nav-item-bg)', borderColor: 'var(--accent)', color: 'var(--foreground)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>
              {generatedCode === 'GENERATING...' ? 'Generating Code...' : 'Your Circle Code:'}
            </h3>
            <p className="text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
              {generatedCode}
            </p>
            {generatedCode !== 'GENERATING...' && (
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
                Share this code with your friends!
              </p>
            )}
          </div>
        )}

        {/* Code Input Form */}
        <form onSubmit={handleCodeSubmit} className="w-full max-w-md">
          <div className="flex gap-3">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="ENTER EXISTING CODE"
              className="flex-1 px-4 py-3 border-2 rounded-xl font-mono font-semibold text-center focus:outline-none"
              style={{
                borderColor: 'var(--accent)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)'
              }}
            />
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--nav-text)'
              }}
            >
              JOIN
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
        <p>Click • Connect • Create</p>
      </footer>
    </div>
  );
}