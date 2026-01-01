import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-provider';
import { Sidebar } from '@/components/Sidebar';
import { PageWrapper } from '@/components/PageWrapper';
import { QuickAdd } from '@/components/QuickAdd';

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
      <body className="flex flex-col lg:flex-row min-h-screen bg-app transition-colors duration-300">
        <StoreProvider>
          <div className="flex flex-col lg:flex-row w-full min-h-screen">
             <Sidebar />
             <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
                <PageWrapper>{children}</PageWrapper>
             </main>
             <QuickAdd />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
