export const ADMIN_BASE = '/console';

export const SITE = {
  name: 'Vinayak Enterprises',
  shortName: 'VE',
  tagline: 'Manufacturer · Bulk Supplier · Distributor',
  location: 'Ambala, Haryana, India',
  address: 'Ambala, Haryana, India',
  phone: '+91 9729857068',
  phoneTel: '+919729857068',
  email: 'vilakshansharma01@gmail.com',
  whatsapp: '919729857068',
  workingHours: 'Mon – Sat | 9:00 AM – 10:00 PM',
  workingHoursLong: 'Monday – Saturday, 9:00 AM – 10:00 PM',
};

export const SEO = {
  title: 'Vinayak Enterprises | Scientific Instruments Manufacturer & Laboratory Equipment Supplier',
  description:
    'Vinayak Enterprises is a Manufacturer, Bulk Supplier, and Distributor of Scientific Instruments, Laboratory Equipment, Human Anatomy Models, Educational Teaching Aids, and Medical Training Products based in Ambala, Haryana.',
  keywords: [
    'Scientific Instruments Manufacturer',
    'Laboratory Equipment Manufacturer',
    'Human Anatomy Models Manufacturer',
    'Educational Teaching Aids Manufacturer',
    'Medical Training Products Manufacturer',
    'Scientific Instruments Supplier',
    'Laboratory Equipment Distributor',
    'Scientific Instruments Manufacturer in Ambala Haryana',
    'Laboratory Equipment Bulk Supplier India',
  ],
};

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Our Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About Us' },
  { href: '/catalogues', label: 'Catalogue' },
  { href: '/contact', label: 'Contact Us' },
];

export const MANUFACTURING_HIGHLIGHTS = [
  { title: 'Scientific Instruments Manufacturer', icon: '🔬' },
  { title: 'Laboratory Equipment Manufacturer', icon: '⚗️' },
  { title: 'Human Anatomy Models Manufacturer', icon: '🫀' },
  { title: 'Educational Teaching Aids Manufacturer', icon: '📚' },
  { title: 'Medical Training Products Manufacturer', icon: '🏥' },
  { title: 'Bulk Supplier for Schools & Colleges', icon: '🎓' },
  { title: 'Distributor for Hospitals & Laboratories', icon: '🏛️' },
  { title: 'Institutional Supply Across India', icon: '🇮🇳' },
];

export const BUSINESS_INFO = [
  { label: 'Business Type', value: 'Manufacturer, Bulk Supplier & Distributor' },
  { label: 'Location', value: 'Ambala, Haryana, India' },
  { label: 'We Serve', value: 'Schools, Colleges, Universities, Hospitals' },
  { label: 'Products', value: 'Scientific & Laboratory Equipment' },
  { label: 'Specialization', value: 'Anatomy Models & Teaching Aids' },
  { label: 'Supply Model', value: 'B2B Institutional Supply' },
];

export const ABOUT_CONTENT = {
  intro:
    'Vinayak Enterprises is an Ambala-based Manufacturer, Bulk Supplier, and Distributor of Scientific Instruments, Laboratory Equipment, Human Anatomy Models, Educational Teaching Aids, and Medical Training Products.',
  serving:
    'We serve schools, colleges, universities, laboratories, hospitals, medical institutions, healthcare organizations, and research centers across India.',
  focus:
    'Our focus is on quality manufacturing, institutional supply, reliable service, and long-term customer relationships.',
  manufacturing:
    'We manufacture high-quality scientific and educational products and support bulk procurement requirements for educational and healthcare institutions.',
};

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
