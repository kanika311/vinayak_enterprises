import { SITE } from '@/lib/constants';

export type PhoneItem = {
  display: string;
  tel: string;
};

export type SiteContact = {
  name: string;
  location: string;
  address: string;
  phone: string;
  phoneTel: string;
  phoneSecondary?: string;
  phoneSecondaryTel?: string;
  phones: PhoneItem[];
  email: string;
  whatsapp: string;
  workingHours: string;
  workingHoursLong: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
};

/** Digits only; take first valid phone if user entered multiple numbers; ensure India country code */
export function toWhatsAppNumber(raw: string): string {
  const first = (raw || '').split(/[,/|]/)[0] || '';
  let digits = first.replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.startsWith('0') && digits.length === 11) digits = `91${digits.slice(1)}`;
  return digits || SITE.whatsapp;
}

export function toTelHref(raw: string): string {
  const digits = toWhatsAppNumber(raw);
  return digits ? `+${digits}` : SITE.phoneTel;
}

export function formatSinglePhone(raw: string): PhoneItem {
  const trimmed = (raw || '').trim();
  let digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.startsWith('0') && digits.length === 11) digits = `91${digits.slice(1)}`;

  let display = trimmed;
  const cleanDigits = trimmed.replace(/\D/g, '');
  if (cleanDigits.length === 10) {
    display = `+91 ${cleanDigits.slice(0, 5)}-${cleanDigits.slice(5)}`;
  } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
    const ten = cleanDigits.slice(2);
    display = `+91 ${ten.slice(0, 5)}-${ten.slice(5)}`;
  } else if (!display) {
    display = SITE.phone;
  }

  return {
    display,
    tel: digits ? `+${digits}` : SITE.phoneTel,
  };
}

export function parsePhoneNumbers(primaryRaw: string, secondaryRaw?: string): PhoneItem[] {
  const parts: string[] = [];
  if (primaryRaw) {
    parts.push(...primaryRaw.split(/[,/|]/).map((p) => p.trim()).filter(Boolean));
  }
  if (secondaryRaw) {
    parts.push(...secondaryRaw.split(/[,/|]/).map((p) => p.trim()).filter(Boolean));
  }

  const validParts = parts.filter((p) => p.replace(/\D/g, '').length >= 7);
  if (validParts.length === 0) {
    return [formatSinglePhone(SITE.phone)];
  }

  // Deduplicate by digits
  const seen = new Set<string>();
  const results: PhoneItem[] = [];
  for (const part of validParts) {
    const item = formatSinglePhone(part);
    if (!seen.has(item.tel)) {
      seen.add(item.tel);
      results.push(item);
    }
  }

  return results.length ? results : [formatSinglePhone(SITE.phone)];
}

export function formatDisplayPhone(raw: string): string {
  return formatSinglePhone(raw).display;
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
  const phoneSecondaryRaw = s.companyPhoneSecondary ? String(s.companyPhoneSecondary) : undefined;
  const phones = parsePhoneNumbers(phoneRaw, phoneSecondaryRaw);
  const primaryPhone = phones[0] || formatSinglePhone(SITE.phone);
  const secondaryPhone = phones[1];

  const whatsappRaw = String(s.whatsappNumber || s.companyPhone || SITE.whatsapp);
  const address = String(s.companyAddress || SITE.address);
  const hours = String(s.workingHours || SITE.workingHours);
  const hoursLong = String(s.workingHoursLong || SITE.workingHoursLong);

  const cleanUrl = (val: unknown): string | undefined => {
    if (!val || typeof val !== 'string') return undefined;
    const t = val.trim();
    if (!t) return undefined;
    if (t.startsWith('http://') || t.startsWith('https://')) return t;
    return `https://${t}`;
  };

  return {
    name: String(s.companyName || SITE.name),
    location: address,
    address,
    phone: primaryPhone.display,
    phoneTel: primaryPhone.tel,
    phoneSecondary: secondaryPhone?.display,
    phoneSecondaryTel: secondaryPhone?.tel,
    phones,
    email: String(s.companyEmail || SITE.email),
    whatsapp: toWhatsAppNumber(whatsappRaw),
    workingHours: hours,
    workingHoursLong: hoursLong,
    facebook: cleanUrl(s.facebook) || 'https://www.facebook.com/profile.php?id=61596718377937&sk=about',
    instagram: cleanUrl(s.instagram),
    linkedin: cleanUrl(s.linkedin),
  };
}
