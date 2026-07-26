'use client';

import Link from 'next/link';
import { Phone, MessageCircle, FileText, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';

export function ContactActions({ className = '' }: { className?: string }) {
  const { site } = useSiteContact();

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button asChild className="bg-[#1a3a6b] hover:bg-[#15305a]">
        <a href={`tel:${site.phoneTel}`}>
          <Phone className="mr-2 h-4 w-4" /> Call Now
        </a>
      </Button>
      <Button asChild className="bg-green-600 hover:bg-green-700">
        <a href={whatsappChatUrl(site.whatsapp)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
        </a>
      </Button>
      <Button asChild variant="outline">
        <Link href="/request-quote">
          <ClipboardList className="mr-2 h-4 w-4" /> Request Quote
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/catalogues">
          <FileText className="mr-2 h-4 w-4" /> Catalogue
        </Link>
      </Button>
    </div>
  );
}
