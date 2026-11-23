import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDatabase } from '../config/database';
import Category from '../models/Category';
import Product from '../models/Product';
import cloudinary, { ensureCloudinaryConfigured } from '../config/cloudinary';

dotenv.config({ path: '.env.local' });
dotenv.config();

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

async function uploadLocalOrCloudinary(filePath: string, publicIdHint: string, altText: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File does not exist: ${filePath}`);
    return { url: '/placeholder-product.png', alt: altText };
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath) || '.jpg';
  const localFileName = `${publicIdHint.replace(/[^a-zA-Z0-9_-]/g, '_')}${ext}`;
  const localDest = path.join(UPLOADS_DIR, localFileName);
  fs.writeFileSync(localDest, fileBuffer);
  const localUrl = `/uploads/products/${localFileName}`;

  if (ensureCloudinaryConfigured()) {
    try {
      const res = await new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'products/anatomical-models',
              public_id: publicIdHint,
              resource_type: 'image',
              overwrite: true,
            },
            (error, uploaded) => {
              if (error || !uploaded) return reject(error || new Error('Upload failed'));
              resolve({ url: uploaded.secure_url, publicId: uploaded.public_id });
            }
          )
          .end(fileBuffer);
      });
      console.log(`Cloudinary uploaded: ${publicIdHint} -> ${res.url}`);
      return { url: res.url, publicId: res.publicId, alt: altText };
    } catch (err) {
      console.warn(`Cloudinary upload failed for ${publicIdHint}, falling back to local:`, err);
    }
  }

  return { url: localUrl, alt: altText };
}

interface ProductSeedItem {
  name: string;
  sku: string;
  slug: string;
  subcategory: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: { key: string; value: string }[];
  seoTitle: string;
  seoDescription: string;
  metaKeywords: string[];
  imagePaths: string[];
}

const PRODUCTS_TO_REGISTER: ProductSeedItem[] = [
  {
    name: 'Human Heart Anatomical Model with 10 Numbered Parts (2-Piece Dissectible)',
    sku: 'VE-ANA-HEART-002',
    slug: 'human-heart-anatomical-model-10-numbered-parts',
    subcategory: 'Internal Organ Models',
    shortDescription:
      '2-part dissectible life-size human heart model mounted on a durable blue stand with a 10-point numbered anatomical key card.',
    longDescription:
      'The Human Heart Anatomical Model by Vinayak Enterprises is a high-fidelity educational tool manufactured in Ambala Cantt, designed specifically for secondary schools, nursing institutes, and medical colleges.\n\nThis model features a 2-part dissectible design where the anterior myocardial wall detaches smoothly along stainless steel alignment pins to reveal the internal cardiac chambers, atrioventricular valves, and papillary musculature without fragile clips.\n\nAll critical vascular connections, chambers, and valves are permanently numbered on the model surface, corresponding directly to the laminated reference key card attached to the base. It enables students to clearly differentiate between systemic arterial circulation and venous return pathways.\n\nNumbered Key Card Reference:\n1. Ventricle (Right & Left)\n2. Right Auricle\n3. Left Auricle\n4. Aorta\n5. Pulmonary Artery\n6. Pulmonary Vein\n7. Mitral Valve (Bicuspid Valve)\n8. Tricuspid Valve\n9. Superior Vena Cava\n10. Inferior Vena Cava',
    features: [
      '2-piece dissectible anterior myocardial wall for internal chamber study',
      'Numbered landmarks (1 to 10) permanently marked on model and key card',
      'Detailed representation of bicuspid (mitral) and tricuspid valvular cusps',
      'Color-coded vascular pathways: oxygenated (red) and deoxygenated (blue)',
      'Mounted securely on a stable blue display pedestal',
      'Constructed from washable, break-resistant medical-grade PVC',
      'Ideal for NEET biology preparation, nursing labs, and school demonstration',
    ],
    specifications: [
      { key: 'Material', value: 'High-Grade Medical PVC' },
      { key: 'Mounting', value: 'Mounted on sturdy blue display stand' },
      { key: 'Dissectibility', value: '2 Parts (Removable Anterior Myocardial Wall)' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Heart Anatomical Model with 10 Numbered Parts | Ambala Manufacturer',
    seoDescription:
      'Buy 2-part dissectible human heart model with 10 numbered landmarks from Vinayak Enterprises Ambala. Premium PVC with base and key card. Bulk institutional quote.',
    metaKeywords: [
      'human heart model',
      'heart anatomy model 10 parts',
      'dissectible heart model',
      'biology teaching aid',
      'heart model manufacturer Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441074874_f0ae8102.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441086811_1bfb8f55.jpg',
    ],
  },
  {
    name: 'Human Kidney Anatomical Model with 10 Numbered Parts on Stand',
    sku: 'VE-ANA-KID-001',
    slug: 'human-kidney-anatomical-model-10-parts',
    subcategory: 'Excretory System Models',
    shortDescription:
      'Detailed 2-part longitudinal section model of the human kidney mounted on a stand with a 10-point labeled anatomical key card.',
    longDescription:
      'The Human Kidney Anatomical Model with 10 Numbered Parts by Vinayak Enterprises provides an in-depth view of renal micro- and macro-anatomy. Manufactured in Ambala Cantt, this model is an essential teaching aid for biology classrooms, paramedical courses, and medical histology labs.\n\nThe model is bisected longitudinally along the frontal plane, allowing instructors to demonstrate both the exterior renal capsule and the intricate internal architecture. The internal section highlights the renal cortex, medullary pyramids, renal columns, calyces, and the renal pelvis funneling into the ureter. External features include the adrenal gland (cushion fat) seated at the superior pole, along with the renal artery and vein at the hilum.\n\nMounted upon a sturdy metal upright rod on a white weighted stand, each key landmark is identified by a printed number matching the integrated key card.\n\nNumbered Key Card Reference:\n1. Kidney (Renal Capsule)\n2. Cushion Fat (Adrenal Gland / Perirenal Fat)\n3. Hilum (Renal Hilus)\n4. Artery (Renal Artery)\n5. Vein (Renal Vein)\n6. Outer Border\n7. Ureters\n8. Cortical Substance (Renal Cortex)\n9. Pyramid (Renal Medullary Pyramids)\n10. Pelvic (Renal Pelvis & Calyces)',
    features: [
      'Longitudinal coronal cross-section demonstrating cortex, medulla, and pelvis',
      '10 numbered anatomical points matching the front-facing study card',
      'Detailed renal vascular bundle showing renal artery, renal vein, and ureter',
      'Shows superior cushion fat / adrenal gland structure',
      'Elevated on durable metal rod with stable desktop display stand',
      'Molded from impact-resistant, non-toxic medical PVC',
      'Washable and resistant to laboratory sanitizers',
    ],
    specifications: [
      { key: 'Material', value: 'Non-Toxic Medical Grade PVC' },
      { key: 'Cross Section', value: 'Frontal Bisected Section (2 Parts)' },
      { key: 'Stand', value: 'White base with chrome support rod' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Kidney Anatomical Model with 10 Numbered Parts | Vinayak Enterprises',
    seoDescription:
      'Buy longitudinal human kidney anatomical model with 10 numbered parts and key card. Direct manufacturer in Ambala Cantt. Ideal for school & medical labs.',
    metaKeywords: [
      'human kidney model',
      'kidney anatomical model',
      'renal system teaching aid',
      'excretory system model',
      'kidney model manufacturer Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441094666_570d3732.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441140278_d67acb60.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441148234_a475301c.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441156925_996fadc4.jpg',
    ],
  },
  {
    name: 'Human Nose & Nasal Cavity Anatomical Model (10 Numbered Parts)',
    sku: 'VE-ANA-NOSE-001',
    slug: 'human-nose-nasal-cavity-anatomical-model',
    subcategory: 'Sensory Organ Models',
    shortDescription:
      'Sagittal section model of the human nose and nasal cavity showing turbinates, paranasal sinuses, hard/soft palate, and uvula with key card.',
    longDescription:
      'The Human Nose & Nasal Cavity Anatomical Model by Vinayak Enterprises is a specialized educational aid depicting the internal structures of the human upper respiratory and olfactory system. Manufactured in Ambala Cantt, it offers an accurate median sagittal cross-section for ENT demonstration, medical student viva practice, and school biology curricula.\n\nThe model reveals the external nasal cartilage alongside the internal nasal fossa, clearly showcasing the three nasal conchae (superior, middle, and inferior turbinates) and their underlying meatuses. The frontal sinus and sphenoidal sinus cavities are hollowed and contrast-painted to explain sinus ventilation and drainage. The oral-nasal boundary displays the hard palate, muscular soft palate, uvula, and upper maxillary dental roots.\n\nMounted on a raised metal post on a clean white display pedestal with a 10-item legend plate.\n\nNumbered Key Card Reference:\n1. Frontal Sinus\n2. Nasal Cavity\n3. Nasal Vestibule\n4. Superior Turbinate\n5. Middle Turbinate\n6. Inferior Turbinate\n7. Sphenoid Sinus\n8. Hard Plate (Hard Palate)\n9. Soft Plate (Soft Palate)\n10. Ovula (Uvula)',
    features: [
      'Median sagittal section of upper respiratory tract and olfactory chamber',
      '10 numbered landmarks with permanent reference plate',
      'Details superior, middle, and inferior nasal turbinates (conchae)',
      'Shows frontal and sphenoidal paranasal sinuses',
      'Includes hard palate, soft palate, uvula, and maxillary dentition',
      'Elevated on chrome-plated metal rod with sturdy white base',
      'Durable medical-grade PVC hand-painted with lead-free non-fading colors',
    ],
    specifications: [
      { key: 'Material', value: 'High-Density Medical PVC' },
      { key: 'Section', value: 'Median Sagittal Cross-Section' },
      { key: 'Key Features', value: 'Turbinates, Sinuses, Hard & Soft Palate, Uvula' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Nose & Nasal Cavity Anatomical Model | Ambala Manufacturer',
    seoDescription:
      'Buy human nose and nasal cavity anatomical model with 10 labeled parts from Vinayak Enterprises Ambala. Features turbinates, sinuses & palate. Request quote.',
    metaKeywords: [
      'human nose model',
      'nasal cavity model',
      'respiratory anatomy model',
      'sinus anatomical model',
      'ENT teaching aids Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441166381_976f4447.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441174474_7c20dc5c.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441184469_8f366d1d.jpg',
    ],
  },
  {
    name: 'Human Male Reproductive System 3D Relief Model with 11 Numbered Parts',
    sku: 'VE-ANA-MREP-001',
    slug: 'human-male-reproductive-system-relief-model',
    subcategory: 'Reproductive System Models',
    shortDescription:
      'Mounted 3D relief board model showing sagittal section of the human male reproductive and urinary systems with 11 numbered key parts.',
    longDescription:
      'The Human Male Reproductive System 3D Relief Model by Vinayak Enterprises is engineered for clear, high-visibility classroom instruction in high schools, nursing colleges, and biology demonstration halls.\n\nMounted on a durable, lightweight display board, this relief model depicts a median sagittal section of the male pelvis, detailing the relationship between the urinary tract, reproductive organs, and surrounding pelvic structures. Students can trace the path of sperm from the testis and epididymis through the vas deferens, past the seminal vesicles and prostate gland, and out through the penile urethra.\n\nEvery anatomical landmark is marked with high-contrast numbers directly corresponding to the front-mounted educational legend.\n\nNumbered Key Card Reference:\n1. Bladder (Urinary Bladder)\n2. Vas Deferens\n3. Prostate Gland\n4. Urethra\n5. Epididymis\n6. Penis\n7. Ureter\n8. Rectum\n9. Erectile Tissue (Corpora Cavernosa)\n10. Scrotum\n11. Testis',
    features: [
      '3D relief sagittal section showing complete male pelvic reproductive tract',
      '11 numbered anatomical landmarks matching the attached key card',
      'Shows urinary bladder, prostate gland, vas deferens, and urethra pathway',
      'Illustrates testicular lobules, epididymis, and erectile penile tissue',
      'Mounted on a rigid, washable board suitable for desk study or wall mounting',
      'Manufactured from impact-resistant polymer and high-durability PVC',
      'Accurate color-coding of urinary, reproductive, and digestive tracts',
    ],
    specifications: [
      { key: 'Format', value: '3D Relief Board Model' },
      { key: 'Material', value: 'High-Impact Washable Polymer' },
      { key: 'Mounting', value: 'Rigid baseboard suitable for wall mounting' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Male Reproductive System Anatomical Model (11 Parts) | Vinayak Enterprises',
    seoDescription:
      'Buy male reproductive system relief model with 11 numbered parts. Manufactured by Vinayak Enterprises Ambala. Ideal for biology labs and medical colleges.',
    metaKeywords: [
      'male reproductive system model',
      'human reproductive anatomy model',
      'biology teaching aid',
      'male pelvis model Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441130157_1ccbeb68.jpg',
    ],
  },
  {
    name: 'Female Pelvis with Foetal Skull Normal Delivery Demonstration Model',
    sku: 'VE-OBST-DELIV-001',
    slug: 'female-pelvis-with-foetal-skull-delivery-demonstration-model',
    subcategory: 'Obstetrics & Gynecology Models',
    shortDescription:
      'Life-size natural female bony pelvis with flexible foetal skull for demonstrating labor mechanisms, fetal descent, and childbirth.',
    longDescription:
      'The Female Pelvis with Foetal Skull Normal Delivery Demonstration Model by Vinayak Enterprises is an essential simulation tool for obstetrics, gynecology, nursing schools, ANM/GNM training centers, and medical colleges. Manufactured in Ambala Cantt, this model provides hands-on practice for teaching the cardinal movements of labor.\n\nThe set includes a full-size female pelvis with realistic bony landmarks: the ilium, ischium, pubic symphysis, sacrum, coccyx, and pelvic brim (inlet, cavity, and outlet). The accompanying full-term foetal skull features unossified cranial sutures and the anterior diamond-shaped bregma (fontanelle) alongside the posterior fontanelle.\n\nMounted with a flexible articulating tension spring, the foetal skull can be guided through the pelvic canal to demonstrate fetal head engagement, descent, flexion, internal rotation, extension (crowning), and external restitution.',
    features: [
      'Life-size female adult bony pelvis with accurate pelvic inlet and outlet',
      'Full-term foetal skull with distinct anterior and posterior fontanelles',
      'Flexible spring mounting for realistic simulation of the birthing mechanism',
      'Demonstrates internal rotation, crowning, and restitution of fetal head',
      'Durable, crack-resistant polymer construction built for repeated student handling',
      'Smooth natural bone finish for realistic tactile obstetrical training',
      'Essential teaching aid for nursing colleges, midwifery, and medical schools',
    ],
    specifications: [
      { key: 'Scale', value: '1:1 Life Size Adult Female Pelvis' },
      { key: 'Articulation', value: 'Spring articulated flexible fetal skull' },
      { key: 'Material', value: 'Medical-Grade Synthetic Bone Polymer' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Female Pelvis with Foetal Skull Birthing Model | Ambala Manufacturer',
    seoDescription:
      'Life-size female pelvis with foetal skull demonstration model for normal delivery and midwifery training. Direct manufacturer in Ambala. Request bulk quote.',
    metaKeywords: [
      'female pelvis with fetal skull model',
      'normal delivery demonstration model',
      'obstetrics training simulator',
      'midwifery pelvis model',
      'nursing training models Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441105349_d59c2dbc.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441115432_aed4b395.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441193228_0f778965.jpg',
    ],
  },
  {
    name: 'Human Embryonic Development & Pregnancy Stages Model Set (8 Stages with Twin Fetus)',
    sku: 'VE-EMBRYO-SET-001',
    slug: 'human-embryonic-development-pregnancy-stages-model-set',
    subcategory: 'Embryology & Maternity Training',
    shortDescription:
      'Complete 8-part sequential model set showing human embryo and fetus development inside the uterus from Month 1 to Month 8, including twin pregnancy.',
    longDescription:
      'The Human Embryonic Development & Pregnancy Stages Model Set by Vinayak Enterprises is a premier instructional display set manufactured in Ambala Cantt. It is widely utilized across medical colleges, nursing faculties, biology departments, and maternity hospitals to visualize the progression of human gestation.\n\nThis comprehensive set features 8 individual uterine cross-sections showing the developmental milestones of the human fetus:\n- Model 1: Embryo at 1st Month (early gestational sac in uterus)\n- Model 2: Embryo at 2nd Month (developing organ buds)\n- Model 3: Fetus at 3rd Month (identifiable limbs and facial profile)\n- Model 4: Fetus at 4th Month (amniotic development)\n- Model 5: Fetus at 5th Month (transverse/breech positioning)\n- Model 6: Fetus at 6th Month (detailed placental attachment)\n- Model 7: Fetus at 7th Month (approaching full term)\n- Model 8: Twin Pregnancy at 8th Month (demonstrating two fetuses sharing uterine cavity with distinct umbilical attachments)\n\nEach model is mounted on its own individual, labeled black pedestal stand, allowing individual examination or a sequential benchtop progression display.',
    features: [
      'Complete 8-stage sequence from 1st-month embryo to 8th-month twin pregnancy',
      'Each stage mounted on an independent black display stand with identification badge',
      'Removable fetus representations in later stages for close anatomical study',
      'Clear depiction of placenta, umbilical cord, and uterine muscular wall',
      'Shows twin fetus gestation in the final 8th-month model',
      'Molded from premium, non-toxic PVC with durable hand-painted anatomical detailing',
      'Standard requirement for medical embryology, gynecology, and nursing syllabi',
    ],
    specifications: [
      { key: 'Components', value: '8 Independent Display Stages' },
      { key: 'Twin Gestation', value: 'Included in 8th Month model' },
      { key: 'Mounting', value: 'Individual black pedestal display bases' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Embryonic Development Model Set (8 Stages) | Vinayak Enterprises',
    seoDescription:
      'Buy 8-stage human embryo & pregnancy development model set with twin fetus. Manufactured by Vinayak Enterprises Ambala. Ideal for medical & nursing colleges.',
    metaKeywords: [
      'embryonic development model set',
      'pregnancy stages model',
      'fetus development in uterus',
      'embryology model',
      'medical training models Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441206022_e9202779.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441213951_f5be9c37.jpg',
    ],
  },
  {
    name: 'Human Excretory System Model with Kidney Stone & Flexible Ureters',
    sku: 'VE-ANA-EXCR-001',
    slug: 'human-excretory-system-model-kidney-stone',
    subcategory: 'Excretory System Models',
    shortDescription:
      'Full excretory system relief board model showing renal coronal section, pathological kidney stone, abdominal aorta, vena cava, flexible tube ureters, and bisected bladder.',
    longDescription:
      'The Human Excretory System Model by Vinayak Enterprises is a comprehensive anatomical teaching aid manufactured in Ambala Cantt. Mounted on a durable blue presentation board, this model illustrates the complete pathway of urine formation, filtration, and excretion from the kidneys down to the urinary bladder.\n\nThe model showcases both kidneys with their primary vasculature: the renal arteries and renal veins branching from the abdominal aorta and inferior vena cava. One kidney is longitudinally sectioned to demonstrate internal pyramids, cortical tissue, and the renal pelvis. Crucially for clinical and pathology education, it features an enlarged pathological Kidney Stone demonstration.\n\nFlexible yellow tubular ureters connect both kidneys to a dissectible urinary bladder, which opens to reveal internal mucosal rugae, ureteral orifices, and the urethral exit.\n\nNumbered Key Card Reference:\n1. Kidney\n2. Cushion Fat (Adrenal Gland)\n3. Hilum\n4. Artery (Renal Artery & Abdominal Aorta)\n5. Vein (Renal Vein & Inferior Vena Cava)\n6. Outer Border (Renal Cortex)\n7. Ureter (Flexible Conduits)\n8. Cortical Substance\n9. Pyramid (Renal Medulla)\n10. Pelvis (Renal Pelvis)\n11. Kidney Stone (Pathological Calculus Feature)',
    features: [
      'Complete urinary tract model showing kidneys, vascular supply, ureters, and bladder',
      'Includes specialized pathological representation of a Kidney Stone',
      'Real flexible yellow tubing representing bilateral ureters',
      'Bisected urinary bladder showing internal lumen and muscular wall',
      'Longitudinal kidney cross-section exposing cortex, pyramids, and calyces',
      'Mounted on a rigid, easy-to-clean demonstration board',
      'Ideal for school biology labs, paramedical courses, and urology patient education',
    ],
    specifications: [
      { key: 'Format', value: 'Mounted Relief Model with Flexible Tubing' },
      { key: 'Pathology', value: 'Includes Kidney Stone demonstration' },
      { key: 'Board Material', value: 'High-Impact Stiffened Polymer Board' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Excretory System Model with Kidney Stone | Ambala Manufacturer',
    seoDescription:
      'Buy human excretory system model with kidney stone and flexible ureters from Vinayak Enterprises Ambala. Features 11 labeled parts. Request bulk quote.',
    metaKeywords: [
      'human excretory system model',
      'urinary system model',
      'kidney stone anatomy model',
      'biology teaching aid',
      'lab models manufacturer Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441264948_56926845.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441273829_4fab4167.jpg',
    ],
  },
  {
    name: 'Human Brain Anatomical Model with 8 Numbered Parts (Dissectible)',
    sku: 'VE-ANA-BRAIN-001',
    slug: 'human-brain-anatomical-model-8-parts',
    subcategory: 'Nervous System Models',
    shortDescription:
      'Life-size dissectible human brain model showing cerebral hemispheres, cerebellum, brainstem, ventricles, and cranial nerves with an 8-point key card.',
    longDescription:
      'The Human Brain Anatomical Model by Vinayak Enterprises is a core osteological and neurological teaching tool crafted in Ambala Cantt. Designed to fit standard adult skull models or serve as a standalone demonstration piece, this model provides hands-on insight into human central nervous system anatomy.\n\nThe brain divides into sagittal hemispheres to reveal internal structures that cannot be seen from the exterior. Key functional areas are marked with clear identification numbers matching the official key card, including the cerebral cortex, corpus callosum arch, brainstem components, ventricular cavities, and major cranial nerve origins.\n\nCast from washable, durable PVC polymer, this model withstands continuous student handling in secondary school biology classes, NEET coaching institutes, and medical college anatomy practicals.\n\nNumbered Key Card Reference:\n1. Frontal (Frontal Lobe / Cerebral Cortex)\n2. Cerebellum\n3. Pons\n4. Corpus Collosum (Corpus Callosum)\n5. Lateral Ventricle\n6. Spinal Cord\n7. Optic Nerve\n8. Medulla Oblongata',
    features: [
      'Dissectible two-part cerebral hemisphere design',
      '8 numbered anatomical landmarks matching the attached key card',
      'Shows sagittal view of corpus callosum, lateral ventricles, and brainstem',
      'Detailed depiction of pons, medulla oblongata, and optic nerve chiasm',
      'Molded gyri and sulci highlighting cerebral cortex lobes',
      'Durable, impact-resistant medical PVC construction',
      'Essential for neuroscience, NEET-UG biology, and nursing education',
    ],
    specifications: [
      { key: 'Scale', value: '1:1 Life Size Adult Brain' },
      { key: 'Dissection', value: '2 Parts (Sagittal Hemisphere Separation)' },
      { key: 'Material', value: 'Medical-Grade Washable PVC' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Brain Anatomical Model (8 Numbered Parts) | Vinayak Enterprises',
    seoDescription:
      'Buy dissectible human brain anatomical model with 8 numbered parts and key card from Vinayak Enterprises Ambala. High-grade PVC. Request B2B pricing.',
    metaKeywords: [
      'human brain model',
      'brain anatomical model',
      'nervous system teaching aid',
      'medical brain model',
      'anatomy models Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441290783_23edce3a.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441297443_7d3211b2.jpg',
    ],
  },
  {
    name: 'Human Torso Dissectible Internal Organs Set (Lungs, Stomach, Liver & Heart)',
    sku: 'VE-ANA-TORSO-ORG-001',
    slug: 'human-torso-dissectible-internal-organs-set',
    subcategory: 'Torso & Visceral Models',
    shortDescription:
      'Multi-piece removable internal viscera set comprising bilateral lungs with rib markings, dissectible stomach, liver with gallbladder, and anatomical heart.',
    longDescription:
      'The Human Torso Dissectible Internal Organs Set by Vinayak Enterprises is a hands-on visceral anatomy collection manufactured in Ambala Cantt. This set is engineered either as replacement organ inserts for educational human torso manikins or as standalone benchtop demonstration aids for practical biology classes.\n\nThe set includes all primary thoracic and abdominal visceral organs cast in accurate relative scale:\n- Left and Right Lungs: Ribbed anterior surface showing costal impressions, bronchial divisions, and color-coded pulmonary vessels.\n- Stomach: Depicts gastric folds (rugae), esophageal junction (cardia), fundus, and pyloric sphincter.\n- Liver with Gallbladder: Anatomically shaped showing falciform ligament boundary, hepatic vascular porta, and bile-storing gallbladder.\n- Anatomical Heart: Shows coronary sulci, myocardial wall, and major vessel roots.\n- Duodenal / Intestinal Tract Segment: Connects gastric output with lower digestion.\n\nEach component is hand-painted using lead-free, non-fading lacquers that allow easy identification of organs during practical examinations and viva voce sessions.',
    features: [
      'Comprehensive multi-part set of vital thoracic and abdominal internal organs',
      'Includes bilateral lungs, dissectible stomach, liver with gallbladder, and heart',
      'Rib impressions and vascular highlights molded onto lung surfaces',
      'Accurate anatomical proportions and realistic surface textures',
      'Can be used as standalone teaching aids or inside compatible torso models',
      'Manufactured from break-resistant, washable medical PVC',
      'Ideal for school science practicals, nursing training, and biology labs',
    ],
    specifications: [
      { key: 'Component Organs', value: 'Lungs (2), Stomach, Liver, Gallbladder, Heart' },
      { key: 'Material', value: 'High-Strength Medical PVC' },
      { key: 'Compatibility', value: 'Compatible with standard torso manikins or standalone' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Torso Dissectible Internal Organs Set | Ambala Manufacturer',
    seoDescription:
      'Buy dissectible human torso internal organs set (lungs, stomach, liver, heart) from Vinayak Enterprises Ambala. High-durability PVC. Request bulk quote.',
    metaKeywords: [
      'human torso organs set',
      'dissectible anatomy organs',
      'human lungs model',
      'stomach liver heart models',
      'biology lab teaching aids Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441315454_74b86a02.jpg',
    ],
  },
  {
    name: 'Human Circulatory System 3D Relief Model with 16 Numbered Parts',
    sku: 'VE-ANA-CIRC-002',
    slug: 'human-circulatory-system-3d-relief-model',
    subcategory: 'Circulatory System Models',
    shortDescription:
      'Full-body relief model mounted on a board detailing systemic blood circulation, arteries, veins, heart, kidneys, and liver with 16 numbered parts.',
    longDescription:
      'The Human Circulatory System 3D Relief Model by Vinayak Enterprises is one of our flagship cardiovascular teaching aids, manufactured in Ambala Cantt, Haryana. Mounted on a vibrant, heavy-duty green backboard, this relief model outlines the entire human cardiovascular network from head to toe.\n\nStudents can clearly trace oxygenated systemic circulation through bright red arteries and deoxygenated venous return through rich blue veins. The model illustrates the central position of the heart, aortic arch, carotid and jugular vessels in the neck, subclavian pathways to the arms, abdominal mesenteric supplies, renal filtration vessels, and deep femoral and tibial channels in the legs. Key viscera (lungs, liver, gallbladder, and kidneys with adrenal glands) are integrated in relief to explain organ perfusion.\n\nEvery vessel and organ is tagged with clear embossed numbers matching the integrated 16-point legend card at the bottom.\n\nNumbered Key Card Reference:\n1. Heart\n2. Superior Vena Cava\n3. Inferior Vena Cava\n4. Ascending Aorta\n5. Left Common Carotid Artery\n6. Left Jugular Vein\n7. Right Subclavian Vein\n8. Digital Veins (Hand Vessels)\n9. Femoral Vein\n10. Anterior Tibial Vein\n11. Right Kidney\n12. Right Suprarenal Gland (Adrenal)\n13. Liver\n14. Gall Bladder\n15. Right Common Iliac Artery\n16. Right Common Iliac Vein',
    features: [
      'Full-body 3D anatomical relief demonstrating systemic blood circulation',
      '16 permanently marked anatomical landmarks matching the attached key card',
      'High-contrast color distinction: red arteries and blue veins',
      'Shows major vascular junctions: aorta, vena cava, carotids, jugulars, and femorals',
      'Includes vital organs in relief: heart, lungs, liver, gallbladder, and kidneys',
      'Mounted on rigid green display board with hanging hook for classroom walls',
      'Durable, wipe-clean finish built for long-term institutional use',
    ],
    specifications: [
      { key: 'Format', value: 'Full-Body 3D Relief Board' },
      { key: 'Vascular Network', value: 'Color-coded Arterial (Red) & Venous (Blue) pathways' },
      { key: 'Mounting', value: 'Stiffened Display Board with wall hanging hook' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Circulatory System 3D Relief Model (16 Parts) | Vinayak Enterprises',
    seoDescription:
      'Buy 3D relief human circulatory system model with 16 numbered parts from Vinayak Enterprises Ambala. Color-coded arteries & veins. Direct factory quote.',
    metaKeywords: [
      'circulatory system model',
      'human cardiovascular system model',
      'blood circulation relief chart',
      'biology teaching aid',
      'Ambala lab equipment',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441334070_804aa94a.jpg',
    ],
  },
  {
    name: 'Fetal Circulation Anatomical Model with Placenta & Umbilical Cord (18 Parts)',
    sku: 'VE-OBST-FETCIRC-001',
    slug: 'fetal-circulation-anatomical-model-placenta-umbilical-cord',
    subcategory: 'Maternity & Obstetrics Training',
    shortDescription:
      'Life-size newborn fetus model with open thoracic-abdominal cavity detailing fetal vascular bypasses, umbilical cord, and maternal placenta with 18 numbered parts.',
    longDescription:
      'The Fetal Circulation Anatomical Model with Placenta & Umbilical Cord by Vinayak Enterprises is an advanced obstetrical and pediatric simulation model manufactured in Ambala Cantt. It is an indispensable teaching requirement for nursing colleges (B.Sc & GNM), medical embryology classes, midwifery training, and pediatric departments.\n\nThis model features a realistic full-term infant with an open thoracic and abdominal cavity, allowing students to study the unique hemodynamic adaptations of fetal life that differ from adult circulation.\n\nIt clearly demonstrates the three vital fetal cardiovascular shunts:\n1. The Ductus Venosus (bypassing the liver),\n2. The Foramen Ovale (shunting blood from right to left atrium), and\n3. The Ductus Arteriosus (diverting blood from pulmonary artery to descending aorta).\n\nThe model includes a life-size placenta showing maternal cotyledons and fetal vessels, connected to the fetal umbilicus via a flexible umbilical cord containing two umbilical arteries and one umbilical vein.\n\nNumbered Key Card Reference:\n1. Pulmonary Trunk\n2. Foramen Ovale\n3. Right Ventricle\n4. Left Ventricle\n5. Heart\n6. Inferior Vena Cava\n7. Ductus Venosus\n8. Lungs\n9. Liver\n10. Portal System / Systemic Shunt\n11. Ductus Arteriosus\n12. Pancreas\n13. Intestines\n14. Spleen\n15. Umbilical Arteries (2 Vessels)\n16. Umbilical Vein (1 Vessel)\n17. Umbilical Cord\n18. Placenta (Maternal & Fetal Surface)',
    features: [
      'Life-size newborn fetus with dissected thoracic and abdominal cavities',
      '18 numbered landmarks detailing the complete fetal circulatory pathway',
      'Features all 3 fetal vascular shunts: Foramen Ovale, Ductus Arteriosus, Ductus Venosus',
      'Includes life-size realistic placenta with detailed vascular arborization',
      'Flexible multi-vessel umbilical cord demonstrating two arteries and one vein',
      'Molded from premium soft-touch medical PVC with realistic anatomical coloring',
      'Mandatory simulation aid for nursing councils, midwifery, and medical colleges',
    ],
    specifications: [
      { key: 'Scale', value: 'Life-Size Full-Term Neonate' },
      { key: 'Shunts Shown', value: 'Ductus Venosus, Foramen Ovale, Ductus Arteriosus' },
      { key: 'Placenta & Cord', value: 'Included (2 Arteries, 1 Vein)' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Fetal Circulation Model with Placenta & Umbilical Cord | Ambala Manufacturer',
    seoDescription:
      'Buy life-size fetal circulation anatomical model with placenta and umbilical cord (18 parts) from Vinayak Enterprises Ambala. Essential for nursing & MBBS.',
    metaKeywords: [
      'fetal circulation model',
      'fetal cardiovascular shunts model',
      'placenta with umbilical cord model',
      'obstetrics nursing models',
      'medical training Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441350625_e2bfcd3f.jpg',
    ],
  },
  {
    name: 'Human Sphenoid Bone Anatomical Model (Butterfly Bone with Sella Turcica)',
    sku: 'VE-OSTEO-SPHEN-001',
    slug: 'human-sphenoid-bone-anatomical-model',
    subcategory: 'Osteology & Skull Bones',
    shortDescription:
      'Isolated life-size replica of the human cranial sphenoid bone showing sella turcica, greater & lesser wings, optic foramen, and muscle attachment origins.',
    longDescription:
      'The Human Sphenoid Bone Anatomical Model by Vinayak Enterprises is an isolated osteological teaching aid manufactured in Ambala Cantt. Known colloquially as the "butterfly bone" or "wasp bone" due to its distinctive shape, the sphenoid is the central keystone bone of the human cranium, articulating with almost all other cranial bones.\n\nThis model is cast 1:1 life-size from an authentic human sphenoid specimen, providing tactile access to delicate structures that are normally hidden within an assembled skull.\n\nKey anatomical landmarks featured:\n- Central Body: Features the deep Sella Turcica (hypophyseal fossa) which houses the pituitary gland.\n- Greater Wings & Lesser Wings: Demonstrating orbital fissures and cranial base floors.\n- Canals & Foramina: Accurate open apertures representing the Optic Canals, Foramen Rotundum, and Foramen Ovale.\n- Pterygoid Processes: Distinct lateral and medial pterygoid plates with pterygoid fossa, highlighted with red contrast markings on muscle attachment zones.\n\nIdeal for 1st-year MBBS osteology table viva, BDS dental students, ENT surgeons, and advanced anatomy labs.',
    features: [
      'Isolated 1:1 life-size replica of the complex cranial sphenoid bone',
      'Depicts prominent sella turcica (pituitary fossa) on the superior surface',
      'Shows greater wings, lesser wings, and pterygoid processes with fossa',
      'Open apertures representing optic canals and superior orbital fissures',
      'Contrast red markings highlighting pterygoid muscle origin sites',
      'Cast in high-density, unbreakable medical osteology resin',
      'Indispensable for medical college osteology practicals and BDS anatomy',
    ],
    specifications: [
      { key: 'Scale', value: '1:1 Life Size Authentic Cranial Bone Specimen' },
      { key: 'Key Fossa', value: 'Sella Turcica (Hypophyseal Pituitary Fossa)' },
      { key: 'Muscle Markings', value: 'Contrast Red on Pterygoid Processes' },
      { key: 'Origin', value: 'Ambala Cantt, Haryana (Made in India)' },
    ],
    seoTitle: 'Human Sphenoid Bone Anatomical Model | Vinayak Enterprises Ambala',
    seoDescription:
      'Buy isolated human sphenoid bone model with sella turcica & optic canals from Vinayak Enterprises Ambala. Authentic osteology replica. Request quote.',
    metaKeywords: [
      'human sphenoid bone model',
      'sphenoid bone anatomy',
      'sella turcica model',
      'cranial bones osteology',
      'medical college skull bones Ambala',
    ],
    imagePaths: [
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441363652_2fa44ce1.jpg',
      'C:/Users/aggar/.gemini/antigravity/brain/4d7c4205-92ec-423d-950f-4c489a5848c5/.user_uploaded/media_1795441371447_af1a647a.jpg',
    ],
  },
];

async function main() {
  await connectDatabase();
  console.log('Connected to MongoDB database.');

  let category = await Category.findOne({ slug: 'human-anatomy-models' });
  if (!category) {
    category = await Category.create({
      name: 'Human Anatomy Models',
      slug: 'human-anatomy-models',
      description:
        'Anatomical human models, skeletons, internal organ models, and biological teaching aids manufactured by Vinayak Enterprises in Ambala Cantt, Haryana.',
      isActive: true,
      order: 1,
      seoTitle: 'Human Anatomy Models Manufacturer in Ambala | Vinayak Enterprises',
      seoDescription:
        'Explore precision anatomical models, skeletons, internal organs, and medical training simulators manufactured in Ambala Cantt, India.',
    });
    console.log('Created Category: Human Anatomy Models');
  } else {
    console.log(`Using existing Category: ${category.name} (${category._id})`);
  }

  for (const item of PRODUCTS_TO_REGISTER) {
    console.log(`\n--- Processing: ${item.name} (${item.sku}) ---`);
    const images: { url: string; publicId?: string; alt?: string }[] = [];

    for (let i = 0; i < item.imagePaths.length; i++) {
      const imgPath = item.imagePaths[i];
      const publicId = `${item.slug}-${i + 1}`;
      const altText = `${item.name} - View ${i + 1} - Vinayak Enterprises Ambala`;
      const uploaded = await uploadLocalOrCloudinary(imgPath, publicId, altText);
      images.push(uploaded);
    }

    const payload = {
      name: item.name,
      sku: item.sku,
      category: category._id,
      subcategory: item.subcategory,
      slug: item.slug,
      shortDescription: item.shortDescription,
      longDescription: item.longDescription,
      features: item.features,
      specifications: item.specifications,
      images,
      priceUnit: 'Piece',
      status: 'published' as const,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      metaKeywords: item.metaKeywords,
    };

    const existing = await Product.findOne({
      $or: [{ sku: item.sku }, { slug: item.slug }],
    });

    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      console.log(`Successfully UPDATED: ${item.name}`);
    } else {
      await Product.create(payload);
      console.log(`Successfully CREATED & PUBLISHED: ${item.name}`);
    }
  }

  console.log('\nAll 12 products have been successfully registered and published!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error registering products:', err);
  process.exit(1);
});
