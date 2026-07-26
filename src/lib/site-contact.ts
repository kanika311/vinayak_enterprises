import { SITE } from '@/lib/constants';

export type SiteContact = {
  name: string;
  location: string;
  address: string;
  phone: string;
  phoneTel: string;
  email: string;
  whatsapp: string;
  workingHours: string;
  workingHoursLong: string;
  facebook?: string;
  linkedin?: string;
};

/** Digits only; ensure India country code for wa.me / tel links */
export function toWhatsAppNumber(raw: string): string {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.startsWith('0') && digits.length === 11) digits = `91${digits.slice(1)}`;
  return digits || SITE.whatsapp;
}

export function toTelHref(raw: string): string {
  const digits = toWhatsAppNumber(raw);
  return digits ? `+${digits}` : SITE.phoneTel;
}

export function formatDisplayPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return SITE.phone;
  if (digits.length === 10) return `+91 ${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  }
  if (raw.trim().startsWith('+')) return raw.trim();
  return `+${digits}`;
}

/** Pre-filled WhatsApp chat message when customer clicks WhatsApp */
export const WHATSAPP_PREFILL_MESSAGE =
  'Namaste Vinayak Enterprises! Mujhe aapke scientific instruments / laboratory products ke baare mein jaankari aur quote chahiye.';

export function whatsappChatUrl(whatsappNumber: string, message = WHATSAPP_PREFILL_MESSAGE) {
  const phone = toWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function mapSettingsToSite(settings?: Record<string, unknown> | null): SiteContact {
  const s = settings || {};
  const phoneRaw = String(s.companyPhone || SITE.phone);
  const whatsappRaw = String(s.whatsappNumber || s.companyPhone || SITE.whatsapp);
  const address = String(s.companyAddress || SITE.address);
  const hours = String(s.workingHours || SITE.workingHours);
  const hoursLong = String(s.workingHoursLong || SITE.workingHoursLong);

  return {
    name: String(s.companyName || SITE.name),
    location: address,
    address,
    phone: formatDisplayPhone(phoneRaw),
    phoneTel: toTelHref(phoneRaw),
    email: String(s.companyEmail || SITE.email),
    whatsapp: toWhatsAppNumber(whatsappRaw),
    workingHours: hours,
    workingHoursLong: hoursLong,
    facebook: s.facebook ? String(s.facebook) : undefined,
    linkedin: s.linkedin ? String(s.linkedin) : undefined,
  };
}
