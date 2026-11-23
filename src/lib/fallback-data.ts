import type { Product, Blog } from '@/types';
import { FEATURED_PRODUCTS } from '@/lib/constants';

export const FALLBACK_BLOGS: Blog[] = [
  {
    _id: 'fallback-blog-0',
    title: 'Human Skeleton: 206 Bones List and Names (The Complete Anatomy Guide)',
    slug: 'human-skeleton-206-bones-list-and-names',
    category: 'Human Anatomy Model',
    tags: ['Anatomy', 'Human Skeleton', '206 Bones', 'NEET Biology', 'MBBS Osteology', 'Bone Model'],
    author: { name: 'Vinayak Enterprises Editorial & Technical Team' },
    views: 350,
    createdAt: '2026-11-23T10:00:00.000Z',
    publishedAt: '2026-11-23T10:00:00.000Z',
    status: 'published',
    excerpt:
      'Complete academic breakdown of all 206 human bones across the Axial and Appendicular skeletons with osteology summary tables and laboratory study tips.',
    content:
      'Understanding the human skeletal framework is the cornerstone of biological education, pre-medical exam preparation (NEET-UG), nursing training, and first-year medical school (MBBS) osteology. The adult human body consists of exactly 206 individual bones.\n\n## The Two Primary Skeletal Divisions\n1. **The Axial Skeleton (80 Bones):** Skull (22), Auditory Ossicles (6), Hyoid (1), Vertebral Column (26), Thoracic Cage (25).\n2. **The Appendicular Skeleton (126 Bones):** Pectoral Girdles (4), Upper Extremities (60), Pelvic Girdle (2), Lower Extremities (60).\n\n## Full Bone Breakdown & Study Aids\nIn medical curricula, studying articulated skeletons alongside disarticulated sets allows students to examine individual foramina and articulation surfaces directly.',
  },
  {
    _id: 'fallback-blog-1',
    title: 'Importance of Human Anatomy Models in Medical Education',
    slug: 'importance-of-human-anatomy-models-in-medical-education',
    category: 'Human Anatomy Model',
    tags: ['Anatomy', 'Medical Education', 'Colleges', 'Skeleton Models'],
    author: { name: 'Super Admin' },
    views: 142,
    createdAt: '2026-11-19T10:00:00.000Z',
    publishedAt: '2026-11-19T10:00:00.000Z',
    status: 'published',
    excerpt:
      'Discover how human anatomy models enhance medical education, practical dissection knowledge, and hands-on diagnostic training for medical and nursing students.',
    content:
      'Human anatomy models are an indispensable foundation in modern medical, nursing, and biological education. They bridge the critical gap between two-dimensional textbook diagrams and three-dimensional clinical reality.\n\n## 1. Tactile Learning and Spatial Understanding\nMedical and biology students often struggle to visualize complex spatial relationships from flat diagrams alone. Anatomical models—such as life-size articulated skeletons, disarticulated skull models with magnetic removable calvaria, and multi-part torso models—enable students to touch, rotate, and physically examine internal organ placement.\n\n## 2. Complementing Cadaveric Dissection\nWhile cadaver dissection remains traditional, it comes with logistical hurdles, high recurring costs, ethical considerations, and limited availability. High-fidelity anatomical PVC and fiberglass models provide continuous, repeatable, year-round study opportunities without tissue degradation.\n\n## 3. Patient Communication & Simulation\nBeyond classrooms, anatomical models are vital in clinical consultations. Surgeons and physicians use desktop heart, eye, and spinal models to explain diagnoses, surgical procedures, and anatomical conditions clearly to patients and their families.\n\n## Conclusion\nInvesting in durable, anatomically precise models elevates educational outcomes across schools, colleges, and healthcare training institutes nationwide.',
  },
  {
    _id: 'fallback-blog-2',
    title: 'How to Choose the Right Laboratory Microscope for Schools & Colleges',
    slug: 'how-to-choose-the-right-laboratory-microscope-for-schools-and-colleges',
    category: 'Microscopes',
    tags: ['Microscopes', 'Laboratory Equipment', 'Biology', 'STEM Education'],
    author: { name: 'Super Admin' },
    views: 118,
    createdAt: '2026-11-18T10:00:00.000Z',
    publishedAt: '2026-11-18T10:00:00.000Z',
    status: 'published',
    excerpt:
      'A practical guide to selecting monocular, binocular, and stereo microscopes for school science labs and college research departments.',
    content:
      'Selecting the ideal microscope for institutional laboratories requires balancing optical clarity, mechanical durability, and syllabus alignment. Vinayak Enterprises engineers Vilakshan Netra optical microscopes specifically designed for Indian educational institutions.\n\n## Key Considerations:\n1. **Optical Head:** Monocular microscopes are ideal for secondary schools, while Siedentopf binocular heads with 360-degree rotation are recommended for university pathology and medical students.\n2. **Achromatic Objectives:** Ensure DIN standard 4x, 10x, 40x (spring-loaded), and 100x (oil immersion) lenses for crisp field flatness.\n3. **Illumination:** Low-temperature LED illumination provides continuous bright light without heating specimens.',
  },
  {
    _id: 'fallback-blog-3',
    title: 'Essential CPR Training Equipment for Nursing & Paramedical Institutes',
    slug: 'essential-cpr-training-equipment-for-nursing-and-paramedical-institutes',
    category: 'Medical Training',
    tags: ['CPR Training', 'Manikins', 'Paramedical', 'Nursing Colleges'],
    author: { name: 'Super Admin' },
    views: 95,
    createdAt: '2026-11-17T10:00:00.000Z',
    publishedAt: '2026-11-17T10:00:00.000Z',
    status: 'published',
    excerpt:
      'Explore the critical simulation equipment required to train nursing and medical students in life-saving Basic Life Support (BLS) and CPR protocols.',
    content:
      'Effective cardiopulmonary resuscitation (CPR) training requires realistic tactile feedback. Vinayak Enterprises supplies full-body adult, child, and infant simulation manikins engineered to meet AHA standards.\n\n## Key Features of Training Manikins:\n- Real-time chest rise during rescue breathing.\n- Audible clicker feedback verifying 5-6 cm compression depth.\n- Anatomical landmarks including sternum, ribcage, and carotid pulse simulation.\n- Durable, washable medical PVC skin for repeated institutional use.',
  },
];

export const FALLBACK_PRODUCTS: Product[] = FEATURED_PRODUCTS.map((fp, i) => ({
  _id: `fallback-product-${fp._id}`,
  name: fp.name,
  slug: fp.slug,
  sku: `VE-${fp.categorySlug.toUpperCase().slice(0, 3)}-${100 + i}`,
  shortDescription: `${fp.name} manufactured by Vinayak Enterprises in Ambala. High-grade scientific instrument for institutional laboratories.`,
  longDescription: `${fp.name} engineered for schools, colleges, medical universities, and research facilities. Durable construction, precision calibration, and institutional warranty.`,
  price: parseInt(fp.price.replace(/,/g, ''), 10) || 1200,
  priceUnit: fp.unit || '/Piece',
  category: { _id: fp.categorySlug, name: fp.category, slug: fp.categorySlug },
  features: fp.specs,
  specifications: fp.specs.map((s) => {
    const [k, v] = s.split(': ');
    return { key: k || 'Feature', value: v || s };
  }),
  images: [{ url: '/torso.webp', alt: `${fp.name} - Vinayak Enterprises` }],
  videos: [],
  metaKeywords: [fp.name, fp.category, 'Vinayak Enterprises Ambala', 'Scientific Instruments India'],
  faq: [],
  status: 'published',
  views: 120 + i * 20,
  enquiryCount: 15 + i * 3,
  createdAt: new Date().toISOString(),
}));
