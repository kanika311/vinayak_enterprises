export const ADMIN_BASE = '/console';

export const SITE = {
  name: 'Scientific Instruments Traders',
  tagline: 'Trader · Wholesaler / Distributor',
  location: 'New Delhi, India',
  phone: '+91-7942719473',
  email: 'info@scientificinstruments.com',
  whatsapp: '+917942719473',
  gst: '07XXXXXXXXXX1ZJ',
  responseRate: '91%',
  address: '54, South Basti, Sadar Bazar, New Delhi - 110006, India',
  ceo: 'Mr. Sharma (CEO)',
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Our Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'Profile' },
  { href: '/catalogues', label: 'Catalogue' },
  { href: '/contact', label: 'Contact Us' },
];

export const PRODUCT_CATEGORIES = [
  { slug: 'chemistry-lab-instrument', name: 'Chemistry Lab Instrument', icon: '🧪', color: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
  { slug: 'laboratory-equipment', name: 'Laboratory Equipment', icon: '⚗️', color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' },
  { slug: 'physics-scientific-equipment', name: 'Physics Scientific Equipment', icon: '⚡', color: 'bg-amber-50 border-amber-200 hover:border-amber-400' },
  { slug: 'scientific-instrument', name: 'Scientific Instrument', icon: '🔬', color: 'bg-violet-50 border-violet-200 hover:border-violet-400' },
  { slug: 'biological-model', name: 'Biological Model', icon: '🫀', color: 'bg-rose-50 border-rose-200 hover:border-rose-400' },
  { slug: 'laboratory-dishes', name: 'Laboratory Dishes', icon: '🧫', color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400' },
  { slug: 'educational-teaching-aid', name: 'Educational & Teaching Aid', icon: '📚', color: 'bg-orange-50 border-orange-200 hover:border-orange-400' },
  { slug: 'laboratory-instruments', name: 'Laboratory Instruments', icon: '🔭', color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400' },
];

export const CATEGORIES_PREVIEW = PRODUCT_CATEGORIES;

export const BUSINESS_INFO = [
  { label: 'Nature of Business', value: 'Trader - Wholesaler/Distributor' },
  { label: 'Total Employees', value: 'Upto 10 People' },
  { label: 'GST Registration', value: '01-07-2017' },
  { label: 'Legal Status', value: 'Proprietorship' },
  { label: 'Annual Turnover', value: '5 - 25 Cr' },
  { label: 'GST No.', value: SITE.gst },
];

export interface ShowcaseProduct {
  _id: string;
  name: string;
  slug: string;
  price: string;
  unit: string;
  specs: string[];
  category: string;
  categorySlug: string;
  image?: string;
}

export const FEATURED_PRODUCTS: ShowcaseProduct[] = [
  { _id: '1', name: 'Digital LCD Microscope', slug: 'digital-lcd-microscope', price: '4,000', unit: '/Piece', specs: ['Usage: Scientific & Laboratory', 'Model: DM4', 'Automation: Automatic'], category: 'Scientific Instrument', categorySlug: 'scientific-instrument' },
  { _id: '2', name: 'Human Skeleton Model', slug: 'human-skeleton-model', price: '800', unit: '/Piece', specs: ['Usage: Medical College', 'Brand: Labsun', 'Color: White'], category: 'Biological Model', categorySlug: 'biological-model' },
  { _id: '3', name: 'Micro Biology Educational Kit', slug: 'micro-biology-kit', price: '2,500', unit: '/Piece', specs: ['Age Group: 14 & Above', 'Material: ABS Plastic', 'Usage: Schools, Colleges'], category: 'Educational & Teaching Aid', categorySlug: 'educational-teaching-aid' },
  { _id: '4', name: 'Atomic Model Teaching Aid', slug: 'atomic-model-teaching-aid', price: '1,200', unit: '/piece', specs: ['Size: 10 x 7 x 2 cm', 'Language: English', 'Laminated: NO'], category: 'Chemistry Lab Instrument', categorySlug: 'chemistry-lab-instrument' },
  { _id: '5', name: 'Human Torso Model', slug: 'human-torso-model', price: '2,600', unit: '/Pcs', specs: ['Usage: Medical College', 'Type: Anatomical', 'Size: 175 cm Height'], category: 'Biological Model', categorySlug: 'biological-model' },
  { _id: '6', name: 'Magnetic Stirrer With Hot Plate', slug: 'magnetic-stirrer', price: '2,000', unit: '/Piece', specs: ['Material: Stainless Steel', 'Usage: Chemical Laboratory'], category: 'Laboratory Instruments', categorySlug: 'laboratory-instruments' },
  { _id: '7', name: 'Plastic Vernier Caliper', slug: 'plastic-vernier-caliper', price: '80', unit: '/Piece', specs: ['Range: 150 mm', 'Accuracy: 0.025 mm', 'Brand: Insize'], category: 'Physics Scientific Equipment', categorySlug: 'physics-scientific-equipment' },
  { _id: '8', name: 'Microscope Glass Slide', slug: 'microscope-glass-slide', price: '32', unit: '/Pack', specs: ['Material: Glass', 'Usage: Chemical Laboratory', 'Size: 75 x 25 x 1mm'], category: 'Chemistry Lab Instrument', categorySlug: 'chemistry-lab-instrument' },
];
