import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console | Vinayak Enterprises',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ConsoleRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
