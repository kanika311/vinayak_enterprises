'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSiteContact } from '@/hooks/use-site-contact';
import { whatsappChatUrl } from '@/lib/site-contact';

export function WhatsAppFloat() {
  const { site } = useSiteContact();

  return (
    <motion.a
      href={whatsappChatUrl(site.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-600/40 hover:bg-[#20bd5a] md:bottom-6 md:right-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.4 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
      />
      <MessageCircle className="relative h-7 w-7" fill="currentColor" strokeWidth={1.5} />
    </motion.a>
  );
}
