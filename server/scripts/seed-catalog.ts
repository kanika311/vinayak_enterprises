import dotenv from 'dotenv';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { connectDatabase } from '../config/database';
import Category from '../models/Category';
import Product from '../models/Product';
import Catalogue from '../models/Catalogue';
import cloudinary, { ensureCloudinaryConfigured } from '../config/cloudinary';
import { generateSlug } from '../utils/helpers';

dotenv.config({ path: '.env.local' });
dotenv.config();

const VISME_CATALOGUE_URL =
  'https://my.visme.co/view/p9npxz4g-vinayak-enterprises-product-catalog';

const LOCAL_DIR = path.join(process.cwd(), 'public', 'uploads', 'catalog-import');

type ImgRef = { local: string; remote: string; ext?: string };

async function ensureLocalImage(ref: ImgRef): Promise<string> {
  mkdirSync(LOCAL_DIR, { recursive: true });
  const dest = path.join(LOCAL_DIR, ref.local);
  if (!existsSync(dest) || readFileSync(dest).length < 1000) {
    const res = await fetch(ref.remote);
    if (!res.ok) throw new Error(`Failed to download ${ref.remote}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
  }
  return dest;
}

async function uploadImage(ref: ImgRef, alt: string): Promise<{ url: string; publicId?: string; alt: string }> {
  const filePath = await ensureLocalImage(ref);
  const buffer = readFileSync(filePath);

  if (ensureCloudinaryConfigured()) {
    try {
      const result = await new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'products/catalog', resource_type: 'image' },
            (error, uploaded) => {
              if (error || !uploaded) return reject(error || new Error('Upload failed'));
              resolve({ url: uploaded.secure_url, publicId: uploaded.public_id });
            }
          )
          .end(buffer);
      });
      return { ...result, alt };
    } catch (err) {
      console.warn(`Cloudinary upload failed for ${ref.local}, using local file:`, err);
    }
  }

  return { url: `/uploads/catalog-import/${ref.local}`, alt };
}

async function resolveCategory(slug: string, name: string) {
  let cat = await Category.findOne({ slug });
  if (!cat) {
    cat = await Category.create({ name, slug, description: name, isActive: true });
  }
  return cat;
}

type ProductSeed = {
  sku: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications?: { key: string; value: string }[];
  images: ImgRef[];
};

const PRODUCTS: ProductSeed[] = [
  {
    sku: 'VE-CPR-001',
    name: 'CPR Training Manikin (Customizable)',
    categorySlug: 'cpr-training-manikins',
    categoryName: 'CPR Training Manikins',
    shortDescription:
      'Manual professional CPR training manikin designed for realistic chest rise and group training — available individually or in sets of four.',
    longDescription:
      'Manual Professional Training manikin is uniquely designed for realistic experiences. Available individually or in a set of four for group study, these CPR manikins are designed to match the real-life CPR experience. Ideal for nursing schools, medical colleges, and first-aid training centres.',
    features: [
      'Realistic look and performance for students and instructors',
      'Easy to carry and set up at training sites',
      'Provides sufficient chest rise for proper CPR training',
      'Made of silicone and resin',
      'Customizable as per training requirements',
    ],
    images: [
      {
        local: 'cpr.jpg',
        remote: 'https://static.visme.co/50/37/27/5b/2a16a8971ac55c70bdc62a21aeea89d9.jpeg',
      },
    ],
  },
  {
    sku: 'VE-DUM-001',
    name: 'Full-Body Rescue & Training Dummy',
    categorySlug: 'human-dummies',
    categoryName: 'Human Dummies',
    shortDescription:
      'Life-size multi-purpose human rescue and training dummy with realistic weight, height, and joint movement.',
    longDescription:
      'A life-size human dummy designed to replicate realistic human weight, height, and joint movement. Manufactured using high-quality fiberglass and silicone, it is ideal for rescue training, disaster response exercises, medical and nursing training, patient handling practice, evacuation drills, and other high-risk operations where the use of real individuals may be impractical or unsafe. Durable, realistic, and customizable to specific training requirements.',
    features: [
      'Life-size full-body simulation',
      'Realistic weight and joint movement',
      'High-quality fiberglass and silicone construction',
      'Suitable for rescue, medical, and nursing training',
      'Customizable to training requirements',
    ],
    specifications: [
      { key: 'Adjustable Height', value: 'Around 6 Feet' },
      { key: 'Weight', value: '60–62 Kg' },
      { key: 'Country of Origin', value: 'Made in India' },
    ],
    images: [
      {
        local: 'dummy.jpg',
        remote: 'https://static.visme.co/ed/20/66/e4/5a56984b413bf8e070a474b2233fe8c1.png',
      },
    ],
  },
  {
    sku: 'VE-MIC-STU-001',
    name: 'Student Microscope',
    categorySlug: 'microscopes',
    categoryName: 'Microscopes',
    shortDescription:
      'Vilakshan Netra student microscope with coarse & fine focusing, triple nosepiece, and 100x–675x magnification.',
    longDescription:
      'Strong body with a heavy horseshoe base, inclinable from 1–90 degree tube, coarse and fine movement. Triple nosepiece with a click stop. Stop arrangement against breakage of slides. Complete with Huygenian eyepieces 10x & 15x and objectives 10x & 45x (S.L.), total magnification 100x to 675x. Nicely packed in thermocol packing in a cardboard box. Part of the Vilakshan Netra microscope series by Vinayak Enterprises.',
    features: [
      'Heavy horseshoe base, inclinable 1–90°',
      'Coarse and fine focusing',
      'Triple nosepiece with click stop',
      'Huygenian eyepieces 10x & 15x',
      'Objectives 10x & 45x (S.L.)',
      'Magnification range 100x–675x',
    ],
    images: [
      { local: 'micro1.jpg', remote: 'https://static.visme.co/68/8c/e8/70/67262bbc18c1d0546fffaebcc5e38292.jpg' },
      { local: 'micro2.jpg', remote: 'https://static.visme.co/9a/63/f8/ee/a4556468fdd47c9094c847112fc992ed.jpg' },
      { local: 'micro3.jpg', remote: 'https://static.visme.co/3f/3b/89/24/bd40a910b6e71203c44ca656cdd188da.jpg' },
    ],
  },
  {
    sku: 'VE-MIC-MED-001',
    name: 'Medical Microscope',
    categorySlug: 'microscopes',
    categoryName: 'Microscopes',
    shortDescription:
      'Medical microscope with mechanical stage, Abbe condenser N.A. 1.25, and triple/quadruple nosepiece.',
    longDescription:
      'Strong, heavy body with horseshoe base, inclinable from 1–90 degree, coarse motion fitted with special rack & pinion. Fine focusing to 0.002mm accuracy with stop arrangement. Bright field condenser N.A. 1.25 movable on rack & pinion. Detachable two-way graduated mechanical stage / co-axial plate. Triple or quadruple nosepiece with click stop. Complete with two Huygenian eyepieces 10x & 15x and three objectives 10x, 45x (S.L.). Nicely packed in thermocol packing in a cardboard box.',
    features: [
      'Horseshoe base, inclinable 1–90°',
      'Fine focusing accuracy 0.002mm',
      'Bright field condenser N.A. 1.25',
      'Detachable graduated mechanical stage',
      'Triple or quadruple nosepiece',
      'Eyepieces 10x & 15x; objectives 10x, 45x (S.L.)',
    ],
    images: [
      { local: 'micro2.jpg', remote: 'https://static.visme.co/9a/63/f8/ee/a4556468fdd47c9094c847112fc992ed.jpg' },
      { local: 'micro1.jpg', remote: 'https://static.visme.co/68/8c/e8/70/67262bbc18c1d0546fffaebcc5e38292.jpg' },
    ],
  },
  {
    sku: 'VE-MIC-BIN-001',
    name: 'Binocular Research Microscope',
    categorySlug: 'microscopes',
    categoryName: 'Microscopes',
    shortDescription:
      'Binocular research microscope with built-in illumination, quadruple nosepiece, and 100x oil immersion objective.',
    longDescription:
      'Strong heavy body with quadruple revolving nosepiece, detachable graduated mechanical stage, coarse motion with sensitive fine focusing reading to 0.002mm and rack pinion motion of condenser unit N.A. 1.25 with iris diaphragm. Fixed square stage measuring 120 × 120mm. Built-in base illumination system 20W & 220V/AC through built-in transformer, with plano-concave reflecting mirror for daylight use. Objectives 10x, 45x (S.L.), 100x (S.L.).',
    features: [
      'Quadruple revolving nosepiece',
      'Detachable graduated mechanical stage',
      'Fine focusing to 0.002mm',
      'Condenser N.A. 1.25 with iris diaphragm',
      'Built-in 20W illumination (220V AC)',
      'Objectives 10x, 45x (S.L.), 100x (S.L.)',
    ],
    specifications: [
      { key: 'Stage', value: '120 × 120mm fixed square stage' },
      { key: 'Illumination', value: '20W / 220V AC built-in transformer' },
    ],
    images: [
      { local: 'micro3.jpg', remote: 'https://static.visme.co/3f/3b/89/24/bd40a910b6e71203c44ca656cdd188da.jpg' },
      { local: 'micro1.jpg', remote: 'https://static.visme.co/68/8c/e8/70/67262bbc18c1d0546fffaebcc5e38292.jpg' },
    ],
  },
  {
    sku: 'VE-ANA-SKULL-001',
    name: 'Anatomical Human Skull Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      'High-quality anatomical skull model with magnetic detachable skull cap for accurate demonstration and training.',
    longDescription:
      'High-quality skull model designed for accurate demonstration and training purposes. Features a realistic anatomical structure, durable material, and a magnetic detachable skull cap for easy internal study. Suitable for medical colleges, nursing schools, and anatomy labs.',
    features: [
      'Realistic anatomical structure',
      'Durable material',
      'Magnetic detachable skull cap for internal study',
    ],
    images: [
      { local: 'skull1.jpg', remote: 'https://static.visme.co/9a/fb/29/56/93ab86f172075593a3ca8ab5b92c188e.jpeg' },
      { local: 'skull2.jpg', remote: 'https://static.visme.co/89/77/43/5e/bd1aa5daf97f2d650268cda86abd3659.jpeg' },
      { local: 'skull3.jpg', remote: 'https://static.visme.co/18/fd/4a/bd/b998aca1efd1e8965c95a105bbc269d9.jpeg' },
      { local: 'skull4.jpg', remote: 'https://static.visme.co/d6/2e/1a/05/bb36184a43cc617bb79da983e5c179b7.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-EYE-ORB-001',
    name: 'Human Eye Model with Orbit',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      'Detailed anatomical eye model seated in orbital socket with extrinsic muscles and vascular detailing.',
    longDescription:
      'Educational anatomical model of the human eye showing the eyeball with sclera vasculature, iris and pupil, extrinsic eye muscles, and orbital (socket) structure. Ideal for biology labs and medical training.',
    features: [
      'Eyeball with detailed iris and pupil',
      'Extrinsic muscle representation',
      'Orbital socket base',
      'Vascular detailing on sclera',
    ],
    images: [
      { local: 'anat1.jpg', remote: 'https://static.visme.co/94/e8/7c/e2/bde9ab94a2525cd1a20ccbbacbee6f99.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-RESP-001',
    name: 'Human Respiratory System Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      '3D relief model of the human respiratory system mounted on board with numbered key card.',
    longDescription:
      'Educational relief model of the human respiratory system mounted on a blue board. Shows head, neck, and chest airways including larynx, trachea, bronchi, and lungs with numbered parts and key card for classroom teaching.',
    features: [
      'Relief-style 3D model on board',
      'Numbered parts with key card',
      'Shows larynx, trachea, bronchi, and lungs',
      'Ideal for schools and medical colleges',
    ],
    specifications: [
      { key: 'Labeled Parts', value: 'Cartilage rings, Larynx, Trachea, Tongue, Artery, Bronchus, Pharynx, Nasal cavity' },
    ],
    images: [
      { local: 'anat2.jpg', remote: 'https://static.visme.co/77/13/82/bf/847f023416637c51df61a3f04f210459.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-CIRC-001',
    name: 'Human Circulatory System Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      'Full-body circulatory system relief model with arteries, veins, and major organs on board.',
    longDescription:
      'Educational anatomical relief model of the human circulatory system mounted on a blue board. Features colour-coded arteries (red) and veins (blue) with heart, lungs, liver, and kidneys, plus a numbered legend for classroom demonstration.',
    features: [
      'Full-body arterial and venous network',
      'Shows heart, lungs, liver, and kidneys',
      'Colour-coded arteries and veins',
      'Numbered legend included',
    ],
    images: [
      { local: 'anat3.jpg', remote: 'https://static.visme.co/fa/6f/b3/7d/3e31ca0826257141ed87e4169df9edb6.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-DIG-001',
    name: 'Human Digestive System Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      '3D digestive system relief model showing mouth to rectum with labeled key card.',
    longDescription:
      'Educational relief model of the human digestive system mounted on a blue board. Shows mouth, oesophagus, stomach, liver, pancreas, intestines, appendix, and rectum with numbered key card for teaching.',
    features: [
      'Complete digestive tract from mouth to rectum',
      'Numbered parts with key card',
      'Mounted on durable board',
      'Suitable for biology and medical labs',
    ],
    specifications: [
      {
        key: 'Labeled Parts',
        value: 'Mouth, Oesophagus, Stomach, Liver, Pancreas, Duodenum, Ascending colon, Small intestine, Appendix, Rectum',
      },
    ],
    images: [
      { local: 'anat4.jpg', remote: 'https://static.visme.co/23/8d/44/c7/70bf8cf209390514654d8ff285091aa3.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-HAND-001',
    name: 'Hand Joint Anatomical Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      'Labeled hand and wrist skeleton model showing phalanges, carpals, metacarpals, radius, and ulna.',
    longDescription:
      'Life-size educational model of the human hand and wrist skeleton mounted on a blue base. Numbered bones with legend covering phalanges, carpals, metacarpals, radius, and ulna — ideal for anatomy and physiotherapy training.',
    features: [
      'Life-size hand and wrist skeleton',
      'Numbered bones with legend',
      'Mounted on sturdy base',
      'Shows radius and ulna attachment',
    ],
    specifications: [
      { key: 'Labeled Parts', value: 'Phalanges, Carpals, Metacarpals, Radius, Ulna' },
    ],
    images: [
      { local: 'anat5.jpg', remote: 'https://static.visme.co/9b/15/25/86/fae01cdecdbf6f777c2e6500db30456c.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-EYE-001',
    name: 'Human Eye Anatomical Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      'Labeled human eye model on stand covering cornea, iris, lens, retina, optic nerve, and more.',
    longDescription:
      'Educational anatomical model of the human eye mounted on a white stand with numbered parts and legend. Covers conjunctiva, cornea, iris, pupil, lens, eye muscle, sclerotic, choroid, retina, optic nerve, and vitreous humor.',
    features: [
      '11 labeled anatomical parts',
      'Mounted on display stand',
      'Detailed iris, pupil, and muscle structure',
      'Ideal for biology and optometry training',
    ],
    images: [
      { local: 'anat6.jpg', remote: 'https://static.visme.co/b2/e0/5a/61/af6c7f5e2a66ca7df07482ceeae45691.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-TEETH-001',
    name: 'Teeth Care Dental Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      'Oversized hinged jaw model for teeth care demonstration with educational card.',
    longDescription:
      'Large educational dental model of the upper and lower jaw, hinged for demonstration of brushing and oral hygiene. Includes a Teeth Care educational card labeling incisors, canines, premolars, and molars. Suitable for schools, nursing, and dental training.',
    features: [
      'Oversized hinged upper and lower jaw',
      'Realistic teeth and gum detailing',
      'Includes Teeth Care educational card',
      'Ideal for oral hygiene demonstrations',
    ],
    images: [
      { local: 'anat7.jpg', remote: 'https://static.visme.co/27/87/5b/d8/f0c99fd9d9d7ece96c3326c2fb392b07.jpeg' },
    ],
  },
  {
    sku: 'VE-ANA-PELVIS-001',
    name: 'Female Pelvis Anatomical Model',
    categorySlug: 'human-anatomy-models',
    categoryName: 'Human Anatomy Models',
    shortDescription:
      'Life-size female pelvis bone model showing ilium, ischium, pubis, and sacrum.',
    longDescription:
      'Life-size anatomical model of the human female pelvis for medical and nursing education. Shows sacrum, ilium, pubis, ischium, pelvic inlet, and obturator foramina with articulated joints for study and demonstration.',
    features: [
      'Life-size female pelvis',
      'Articulated construction',
      'Shows sacrum, ilium, pubis, and ischium',
      'Suitable for medical and nursing colleges',
    ],
    images: [
      { local: 'anat8.jpg', remote: 'https://static.visme.co/fe/8d/14/f7/4cdc010037fdb9df8734c532c819ebfa.jpeg' },
    ],
  },
  {
    sku: 'VE-SKEL-001',
    name: 'Articulated & Disarticulated Human Skeleton',
    categorySlug: 'human-skeleton-models',
    categoryName: 'Human Skeleton Models',
    shortDescription:
      'Life-size human skeleton (5 ft 2 in) made of fiberglass and PVC — articulated and disarticulated options.',
    longDescription:
      'Life-size articulated and disarticulated human skeleton models for anatomy teaching. Size approximately 5 feet 2 inches. Made of fiberglass and PVC for durability in classroom and laboratory use. Suitable for medical colleges, nursing schools, and biology laboratories.',
    features: [
      'Life size: 5 feet 2 inches',
      'Made of fiberglass and PVC',
      'Available as articulated and disarticulated',
      'Ideal for anatomy demonstration',
    ],
    specifications: [
      { key: 'Height', value: '5 feet 2 inches' },
      { key: 'Material', value: 'Fiberglass and PVC' },
    ],
    images: [
      { local: 'skel1.jpg', remote: 'https://static.visme.co/89/2e/90/1f/7e16b52169fe03cb10aca78e2a755337.jpeg' },
      { local: 'skel2.jpg', remote: 'https://static.visme.co/ef/1b/34/96/6fe9fd46ffe4acdd3aa2762d64938663.jpeg' },
    ],
  },
];

const seedCatalog = async () => {
  await connectDatabase();
  console.log('Seeding products from Visme catalogue...');

  for (const item of PRODUCTS) {
    const category = await resolveCategory(item.categorySlug, item.categoryName);
    const images = [];
    for (const img of item.images) {
      images.push(await uploadImage(img, item.name));
    }

    const slug = generateSlug(item.name);
    const payload = {
      name: item.name,
      sku: item.sku,
      category: category._id,
      slug,
      shortDescription: item.shortDescription,
      longDescription: item.longDescription,
      features: item.features,
      specifications: item.specifications || [],
      images,
      seoTitle: `${item.name} | Vinayak Enterprises`,
      seoDescription: item.shortDescription,
      metaKeywords: [item.name, item.categoryName, 'Vinayak Enterprises', 'Ambala'],
      brochure: { url: VISME_CATALOGUE_URL },
      status: 'published' as const,
    };

    const existing = await Product.findOne({ sku: item.sku });
    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      console.log(`Updated: ${item.name}`);
    } else {
      await Product.create(payload);
      console.log(`Created: ${item.name}`);
    }
  }

  const catalogueSlug = 'vinayak-enterprises-product-catalog';
  const catalogueData = {
    title: 'Vinayak Enterprises Product Catalog',
    slug: catalogueSlug,
    description:
      'Interactive product catalogue featuring CPR manikins, rescue dummies, Vilakshan Netra microscopes, anatomy models, and human skeletons. Showcases a portion of our full product range.',
    file: {
      url: VISME_CATALOGUE_URL,
      filename: 'vinayak-enterprises-product-catalog',
    },
    category: 'All Products',
    isActive: true,
  };

  const existingCat = await Catalogue.findOne({ slug: catalogueSlug });
  if (existingCat) {
    Object.assign(existingCat, catalogueData);
    await existingCat.save();
    console.log('Updated catalogue entry');
  } else {
    await Catalogue.create(catalogueData);
    console.log('Created catalogue entry');
  }

  console.log(`Done. ${PRODUCTS.length} products + catalogue linked.`);
  process.exit(0);
};

seedCatalog().catch((err) => {
  console.error(err);
  process.exit(1);
});
