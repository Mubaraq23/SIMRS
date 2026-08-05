import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIMRS Enterprise - Hospital Information System (PWA)',
  description: 'Sistem Informasi Manajemen Rumah Sakit Enterprise Full Stack (SATUSEHAT & BPJS Compliant)',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <meta name="theme-color" content="#0d9488" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SIMRS ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('SIMRS ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
