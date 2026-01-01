import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-provider';
import { AppContent } from '@/components/AppContent';

export const metadata: Metadata = {
  title: 'oneself — you don\'t need to be everything today',
  description: 'Life Balance Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-app transition-colors duration-300">
        <StoreProvider>
          <AppContent>{children}</AppContent>
        </StoreProvider>
      </body>
    </html>
  );
}
