import Link from 'next/link';
import { ArrowLeft, Home, Search, BookOpen, Layers } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found (404) | Vinayak Enterprises',
  description: 'The requested page could not be found. Explore our scientific instruments, anatomy models and laboratory equipment catalogue.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full text-center">
        <span className="text-7xl font-extrabold text-[#1a3a6b]/20 tracking-widest block mb-2">404</span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Page Not Found</h1>
        <p className="text-slate-600 mb-8 text-sm leading-relaxed">
          The page or product you are looking for may have moved, been renamed, or is temporarily unavailable.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:text-[#1a3a6b] hover:border-[#1a3a6b]/40 hover:shadow-sm transition-all"
          >
            <Home className="w-4 h-4 text-orange-500" />
            Home
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:text-[#1a3a6b] hover:border-[#1a3a6b]/40 hover:shadow-sm transition-all"
          >
            <Search className="w-4 h-4 text-blue-600" />
            All Products
          </Link>
          <Link
            href="/categories"
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:text-[#1a3a6b] hover:border-[#1a3a6b]/40 hover:shadow-sm transition-all"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            Categories
          </Link>
          <Link
            href="/catalogues"
            className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:text-[#1a3a6b] hover:border-[#1a3a6b]/40 hover:shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            Catalogues
          </Link>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm text-[#1a3a6b] font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Need assistance? Contact our team
        </Link>
      </div>
    </div>
  );
}
