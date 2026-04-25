
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'LibraryOS — University Library Management',
  description: 'University Library & Financial Management System'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('libraryos-theme') || 'light';
              var accent = localStorage.getItem('libraryos-accent') || '#F5C842';
              document.documentElement.setAttribute('data-theme', theme);
              document.documentElement.style.setProperty('--primary-400', accent);
            } catch (e) {}
          })();
        ` }} />
      </head>
      <body className="font-sans antialiased text-text-primary selection:bg-accent/30 selection:text-white">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--ink-800)',
              color: 'var(--text-primary)',
              border: '1px solid var(--ink-700)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#5A9E59', secondary: '#0A0A0F' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#0A0A0F' } }
          }} />
        
        {children}
      </body>
    </html>);

}