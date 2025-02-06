// app/layout.js (Server Component)
import { Ubuntu } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap.css';
import '../public/css/style.css';
import ClientLayout from './ClientLayout';

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}