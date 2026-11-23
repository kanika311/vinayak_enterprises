import dotenv from 'dotenv';
import { connectDatabase } from '../config/database';
import Product from '../models/Product';
import Blog from '../models/Blog';
import Admin from '../models/Admin';

dotenv.config({ path: '.env.local' });
dotenv.config();

const SKELETON_DESCRIPTION = `Engineered specifically for rigorous institutional and medical instruction, the Life-Size Articulated Human Skeleton Model by Vinayak Enterprises delivers precise anatomical fidelity, exceptional mechanical durability, and true-to-life skeletal proportion. Designed and assembled in Ambala Cantt—India's historic center for scientific and laboratory instrument manufacturing—this model is the preferred osteological teaching aid for medical colleges, nursing faculties, higher secondary biology laboratories, and NEET coaching institutes across India.

Cast from premium, washable, medical-grade shatter-resistant PVC plastic, this skeleton replicates the natural texture, foramina, sutures, and bony landmarks of the human skeletal system. Standing at 5 ft 2 in (approx. 170 cm with stand) and weighing approximately 10 kg, the skeleton includes a 3-part dismountable skull with a magnetically removable calvarium (skullcap) and a spring-suspended articulating mandible for detailed intracranial and dental examination.

The upper and lower extremities are fully articulated, allowing natural demonstration of flexions, extensions, and rotational movements at the shoulders, elbows, wrists, hips, knees, and ankles. Quick-release metal pins allow the arms and legs to be detached in seconds for close osteological desk study. The spinal column accurately exhibits cervical, thoracic, and lumbar curvatures, complete with spinal nerve roots, vertebral arteries, and a herniated L4-L5 disc representation for orthopedic pathology discussions.

Mounted upon a balanced heavy-duty pelvic rod and an impact-resistant, 5-caster mobile roller stand, this skeleton can be effortlessly repositioned across lecture halls and laboratory benches. Every unit includes a comprehensive laminated anatomical key chart detailing all primary bone structures. Vinayak Enterprises provides direct factory pricing, tender compliance certificates, and secure pan-India shipping for single institutional evaluations or bulk laboratory replenishment orders. Contact our Ambala Cantt sales desk today to request an official quotation.`;

const SKELETON_FAQS = [
  {
    question: 'Is the skull detachable and can the calvarium (skullcap) be opened?',
    answer:
      'Yes. The skull features a removable calvarium secured with discreet alignment pins, exposing the internal cranial fossa and blood vessel grooves. The lower jaw (mandible) is hinged with a durable tension spring to demonstrate natural chewing motion.',
  },
  {
    question: 'Can the arms and legs be removed for individual bone examination during practical classes?',
    answer:
      'Yes. Both upper and lower limbs are fastened with sturdy quick-release threaded hardware, enabling instructors and students to detach them effortlessly for hands-on osteological study.',
  },
  {
    question: 'What material is used to construct the skeleton, and how durable is it for daily school handling?',
    answer:
      'The model is manufactured from non-toxic, unbreakable medical-grade PVC. It is dust-resistant, washable with mild soap and water, and engineered to withstand continuous hands-on handling in busy academic laboratories.',
  },
  {
    question: 'Does the model come with a stand and mobility wheels?',
    answer:
      'Yes. Each full-size model is supplied with a rugged steel pelvic mount supported by a 5-caster swivel roller base that glides smoothly across lab floors and locks securely during lectures.',
  },
  {
    question: 'How can institutional buyers and distributors receive bulk tender pricing?',
    answer:
      'You can request a prompt quotation by clicking "Request a Quote" on this page, emailing vinayakenterprises52@gmail.com, or contacting our Ambala sales department directly via WhatsApp/Phone at +91 94160-29492.',
  },
];

const HEART_DESCRIPTION = `The Human Heart Anatomical Model with 10 Numbered Parts by Vinayak Enterprises is an indispensable three-dimensional instructional tool crafted for secondary schools, nursing institutes, paramedical academies, and cardiology demonstration rooms. Manufactured in Ambala Cantt, Haryana, this dissectible 2-piece heart model provides an accurate, hands-on understanding of internal cardiac chambers, major vascular junctions, and valvular blood flow mechanics.

Cast at natural life-size in durable, eco-friendly premium medical PVC, the anterior heart wall detaches cleanly along alignment pins to reveal the internal anatomy without fragile latches. The external and internal structures are hand-painted in contrast colors to clearly differentiate oxygenated arterial pathways from deoxygenated venous circuits.

Key Numbered Landmarks Featured on Model & Reference Key Card:
1. Ventricles (Right & Left): Demonstrates thick muscular myocardium and comparative pumping chamber volumes.
2. Right Auricle (Atrium): Illustrates the receiving chamber for systemic deoxygenated venous blood.
3. Left Auricle (Atrium): Shows the receiving chamber for newly oxygenated blood arriving from the pulmonary circulation.
4. Aorta (Ascending & Aortic Arch): Details the primary high-pressure systemic arterial trunk and main branch origins.
5. Pulmonary Artery: Clearly identifies the dual bifurcation carrying deoxygenated blood to the lungs.
6. Pulmonary Veins: Highlights the entry vessels conducting oxygenated pulmonary blood into the left atrium.
7. Mitral Valve (Bicuspid Valve): Displays the atrioventricular valve regulating left chamber blood flow.
8. Tricuspid Valve: Reveals the three cusps preventing regurgitation between the right atrium and ventricle.
9. Superior Vena Cava: Shows the upper systemic tributary returning deoxygenated blood from the head, neck, and upper limbs.
10. Inferior Vena Cava: Demonstrates the lower systemic tributary returning venous blood from the abdomen and lower extremities.

Mounted on a stable desktop display stand, the heart can be lifted off the base for 360-degree interactive classroom demonstrations. Every unit comes packaged with a numbered study guide. We supply institutions with bulk wholesale pricing and customized tender packaging. Contact Vinayak Enterprises Ambala today for immediate quotation and dispatched samples.`;

const HEART_FAQS = [
  {
    question: 'Does this heart model include a numbered key card for classroom quizzes?',
    answer:
      'Yes. Every model features permanently embossed or painted numbers (1 through 10) on all critical chambers, vessels, and valves, accompanied by a double-sided laminated reference key card for self-study and oral practical examinations.',
  },
  {
    question: 'Can the front wall of the heart be removed to inspect the internal valves and chambers?',
    answer:
      'Yes. The anterior myocardial wall separates smoothly to reveal the interventricular septum, bicuspid (mitral) valve, tricuspid valve, and papillary muscle attachments.',
  },
  {
    question: 'Is this model 1:1 life-size or enlarged for lecture demonstrations?',
    answer:
      'The standard model is natural life-size, ensuring all numbered vessels and internal cusps are clearly visible to students even from across a laboratory table.',
  },
  {
    question: 'What material is used, and will the painted blood vessels peel with repeated sanitization?',
    answer:
      'It is molded from industrial-grade, non-brittle medical PVC with UV-cured, lead-free paints that will not peel, crack, or fade under standard laboratory alcohol-free sanitization routines.',
  },
  {
    question: 'Can we place a bulk order for 20+ units for our school biology lab?',
    answer:
      'Absolutely. As direct manufacturers based in Ambala Cantt, Vinayak Enterprises handles institutional bulk orders of any scale, complete with GST billing, distributor margins, and protective transit packaging.',
  },
];

const BLOG_CONTENT = `# Human Skeleton: 206 Bones List and Names (The Complete Anatomy Guide)

Understanding the human skeletal framework is the cornerstone of biological education, pre-medical exam preparation (NEET-UG), nursing training, and first-year medical school (MBBS) osteology. The adult human body consists of exactly **206 individual bones**, which together provide structural support, shield vital internal organs, anchor muscles for locomotion, and store essential minerals such as calcium and phosphorus.

In this comprehensive guide, we break down all 206 bones into their primary functional divisions: the **Axial Skeleton (80 bones)** and the **Appendicular Skeleton (126 bones)**. Whether you are revising for a competitive examination or demonstrating skeletal biomechanics in a laboratory using an [articulated human skeleton model](/products/articulated-disarticulated-human-skeleton), this reference manual provides an organized, systematic anatomical breakdown.

---

## The Two Primary Skeletal Divisions

To study human osteology effectively, the 206 bones are grouped into two anatomical categories:

1. **The Axial Skeleton (80 Bones):** Forms the central vertical longitudinal axis of the human body, encompassing the skull, auditory ossicles, hyoid bone, vertebral column, ribs, and sternum. Its primary role is protecting the central nervous system (brain and spinal cord) and thoracic organs (heart and lungs).
2. **The Appendicular Skeleton (126 Bones):** Consists of the upper and lower limbs, along with the pectoral (shoulder) and pelvic girdles that attach the limbs to the axial core. Its primary role is facilitating physical movement, manipulation, and weight-bearing locomotion.

---

## 1. The Axial Skeleton (80 Bones Total)

### A. The Skull (22 Bones)
The skull protects the brain and structures the facial sensory cavities. It is divided into 8 cranial bones and 14 facial bones.

| Region | Bone Name | Count | Anatomical Characteristics |
| :--- | :--- | :---: | :--- |
| **Cranium (8)** | Frontal Bone | 1 | Forms the forehead and upper eye socket margins. |
| | Parietal Bones | 2 | Form the superior and lateral curved roof of the cranium. |
| | Temporal Bones | 2 | House the middle/inner ear structures and ear canals. |
| | Occipital Bone | 1 | Forms the posterior base; contains the foramen magnum. |
| | Sphenoid Bone | 1 | Butterfly-shaped keystone bone bridging cranial and facial bones. |
| | Ethmoid Bone | 1 | Spongy bone between orbital cavities forming the nasal roof. |
| **Face (14)** | Nasal Bones | 2 | Small oblong bones forming the bridge of the nose. |
| | Maxillae (Upper Jaw) | 2 | Fuse to form the upper jaw and anterior hard palate. |
| | Zygomatic Bones | 2 | Prominent cheekbones forming lateral orbital floors. |
| | Lacrimal Bones | 2 | Smallest, fragile bones of the face housing tear ducts. |
| | Palatine Bones | 2 | L-shaped bones completing the posterior hard palate. |
| | Inferior Nasal Conchae | 2 | Curved scroll-like bones along the lateral nasal walls. |
| | Vomer | 1 | Thin plow-shaped bone forming the nasal septum base. |
| | Mandible (Lower Jaw) | 1 | The only movable bone of the skull, articulating at the TMJ. |

> **Classroom Tip:** When examining cranial bones, using a skull model with a removable calvarium (skullcap) and spring-loaded mandible allows students to inspect the sella turcica, cribriform plate, and internal cranial fossae first-hand.

### B. Auditory Ossicles (6 Bones)
Located inside the petrous portion of each temporal bone:
- **Malleus (Hammer):** 2 (one per ear)
- **Incus (Anvil):** 2 (one per ear)
- **Stapes (Stirrup):** 2 (one per ear – the smallest bone in the human body)

### C. The Hyoid Bone (1 Bone)
- **Hyoid (1):** A unique U-shaped bone suspended in the anterior neck below the mandible. It does not articulate directly with any other bone; it serves as a dynamic anchor for tongue and pharyngeal muscles.

### D. The Vertebral Column (26 Bones in Adults)
The flexible anatomical column that supports the head, encloses the spinal cord, and distributes weight to the hips:
- **Cervical Vertebrae (C1–C7):** 7 bones (including C1 Atlas and C2 Axis).
- **Thoracic Vertebrae (T1–T12):** 12 bones articulating with the ribs.
- **Lumbar Vertebrae (L1–L5):** 5 large, heavy weight-bearing vertebrae.
- **Sacrum:** 1 bone (formed by 5 fused embryonic sacral vertebrae).
- **Coccyx (Tailbone):** 1 bone (formed by 3–4 fused rudimentary coccygeal vertebrae).

### E. The Thoracic Cage (25 Bones)
Encloses and shields the heart and lungs, expanding during respiration:
- **Sternum (Breastbone):** 1 bone (composed of the manubrium, gladiolus/body, and xiphoid process).
- **Ribs (12 pairs = 24 bones):**
  - *True Ribs (Pairs 1–7):* Connect directly to the sternum via costal cartilage.
  - *False Ribs (Pairs 8–10):* Connect indirectly to costal cartilage of rib 7.
  - *Floating Ribs (Pairs 11–12):* Have no anterior sternal attachment.

---

## 2. The Appendicular Skeleton (126 Bones Total)

### A. Pectoral Girdles (Shoulder) (4 Bones)
Anchors the upper limbs to the axial skeleton with high rotational flexibility:
- **Clavicles (Collarbones):** 2 (S-shaped struts transmitting forces to the axial skeleton).
- **Scapulae (Shoulder Blades):** 2 (flat triangular bones housing the glenoid fossa).

### B. Upper Extremities (Limbs) (60 Bones Total)
Each upper limb contains 30 bones engineered for delicate manipulation and grasping:
- **Humerus:** 2 (1 per arm – longest bone of the upper extremity).
- **Radius:** 2 (1 per lateral forearm, rotates around the ulna during pronation).
- **Ulna:** 2 (1 per medial forearm, forms the prominent olecranon elbow hinge).
- **Carpal Bones (Wrist):** 16 bones (8 per wrist arranged in proximal and distal rows):
  - *Proximal Row:* Scaphoid, Lunate, Triquetrum, Pisiform.
  - *Distal Row:* Trapezium, Trapezoid, Capitate, Hamate.
- **Metacarpals (Palm Bones):** 10 bones (5 per hand, numbered I through V from thumb to pinky).
- **Phalanges (Finger Bones):** 28 bones (14 per hand):
  - *Thumb (Pollex):* 2 phalanges (proximal and distal).
  - *Fingers II–V:* 3 phalanges each (proximal, middle, and distal).

### C. Pelvic Girdle (Hip) (2 Bones)
- **Coxal (Hip) Bones:** 2 bones. Each hip bone is formed by the complete fusion of three individual bones: the **Ilium**, **Ischium**, and **Pubis**, converging at the cup-shaped acetabulum socket where the femur head articulates.

### D. Lower Extremities (Limbs) (60 Bones Total)
Engineered for immense weight-bearing strength and stability during locomotion:
- **Femur (Thigh Bone):** 2 (1 per leg – the longest, heaviest, and strongest bone in the body).
- **Patella (Kneecap):** 2 (1 per knee – large sesamoid bone embedded within the quadriceps tendon).
- **Tibia (Shin Bone):** 2 (1 per leg – primary weight-bearing medial bone of the lower leg).
- **Fibula:** 2 (1 per leg – slender lateral non-weight-bearing bone serving as muscle attachment).
- **Tarsal Bones (Ankle & Heel):** 14 bones (7 per foot):
  - Calcaneus (heel bone), Talus (articulates with tibia/fibula), Navicular, Medial Cuneiform, Intermediate Cuneiform, Lateral Cuneiform, and Cuboid.
- **Metatarsals (Sole Bones):** 10 bones (5 per foot, supporting longitudinal and transverse foot arches).
- **Phalanges (Toe Bones):** 28 bones (14 per foot):
  - *Big Toe (Hallux):* 2 phalanges (proximal and distal).
  - *Toes II–V:* 3 phalanges each (proximal, middle, and distal).

---

## Osteology Summary Table (All 206 Bones)

| Skeletal Section | Anatomical Region | Component Bones | Total Count |
| :--- | :--- | :--- | :---: |
| **Axial (80)** | Skull (Cranium & Face) | Frontal, Parietal (2), Temporal (2), Occipital, Sphenoid, Ethmoid, Nasal (2), Maxilla (2), Zygomatic (2), Lacrimal (2), Palatine (2), Inf. Conchae (2), Vomer, Mandible | 22 |
| | Middle Ear Ossicles | Malleus (2), Incus (2), Stapes (2) | 6 |
| | Neck | Hyoid | 1 |
| | Vertebral Column | Cervical (7), Thoracic (12), Lumbar (5), Sacrum (1), Coccyx (1) | 26 |
| | Thoracic Cage | Sternum (1), Ribs (24) | 25 |
| **Appendicular (126)**| Pectoral Girdle | Scapula (2), Clavicle (2) | 4 |
| | Upper Limbs | Humerus (2), Radius (2), Ulna (2), Carpals (16), Metacarpals (10), Phalanges (28) | 60 |
| | Pelvic Girdle | Hip Bones (Ilium, Ischium, Pubis fused) (2) | 2 |
| | Lower Limbs | Femur (2), Patella (2), Tibia (2), Fibula (2), Tarsals (14), Metatarsals (10), Phalanges (28) | 60 |
| **Total Adult Bones** | | | **206** |

---

## Why 3D Anatomical Skeleton Models Are Essential for Osteology

Memorizing 206 bone names, articulation surfaces, and neural foramina solely from 2D textbook drawings often leaves students with gaps in spatial understanding. In medical curricula:
1. **Physical Articulation Shows Real Biomechanics:** An [articulated skeleton model](/products/articulated-disarticulated-human-skeleton) demonstrates how the glenoid cavity enables multi-axis arm rotation while the hip's deep acetabulum prioritizes weight-bearing stability over mobility.
2. **Disarticulated Sets Facilitate Exam Preparation:** Loose bone sets let students hold individual vertebrae, compare male and female pelvic dimensions, and practice identifying small carpal/tarsal bones for practical osteology exams.
3. **Clinical Diagnosis Context:** Understanding how the thoracic cage cradles the heart provides immediate clinical context when studying the [10-part numbered human heart model](/products/human-heart-anatomical-model-10-numbered-parts).

### Source Quality Anatomy Models Directly from Ambala Cantt
**Vinayak Enterprises** is a premier manufacturer and bulk institutional distributor of precision anatomical models, human skeletons, and laboratory teaching equipment based in Ambala Cantt, Haryana. We supply medical colleges, schools, nursing universities, and educational distributors across India with durable, anatomically certified teaching aids.

- [Browse our Full Anatomical Models Catalogue](/categories/human-anatomy-models)
- [Request a Bulk Institutional Quote](/request-quote)`;

async function run() {
  await connectDatabase();
  console.log('Connected to MongoDB.');

  // 1. Update Skeleton Model
  const skeleton = await Product.findOne({
    $or: [{ sku: 'VE-SKEL-001' }, { slug: 'articulated-disarticulated-human-skeleton' }],
  });
  if (skeleton) {
    skeleton.name = 'Life-Size Articulated Human Skeleton Model (5 ft 2 in)';
    skeleton.shortDescription =
      'Life-size articulated human skeleton model (5 ft 2 in) cast from medical PVC on a 5-caster mobile roller stand with 3-part removable skull calvarium.';
    skeleton.longDescription = SKELETON_DESCRIPTION;
    skeleton.seoTitle = 'Human Skeleton Model Manufacturer in Ambala | Bulk B2B Supply';
    skeleton.seoDescription =
      'Buy life-size articulated human skeleton models direct from Vinayak Enterprises Ambala. Durable PVC, roller stand & skull calvarium. Request bulk B2B quote.';
    skeleton.metaKeywords = [
      'human skeleton model',
      'medical skeleton model',
      'bone model',
      'articulated human skeleton model',
      'life size human skeleton model 5 ft 2 in',
      'human skeleton model manufacturer in Ambala',
      'Vinayak Enterprises',
    ];
    skeleton.faq = SKELETON_FAQS;
    await skeleton.save();
    console.log('Successfully updated Human Skeleton Model with SEO content & FAQs.');
  } else {
    console.warn('Skeleton model not found.');
  }

  // 2. Update Heart Models
  const heartModels = await Product.find({
    $or: [
      { sku: 'VE-ANA-HEART-002' },
      { slug: 'human-heart-anatomical-model-10-numbered-parts' },
      { slug: 'human-heart-model' },
    ],
  });

  for (const heart of heartModels) {
    heart.name = 'Human Heart Anatomical Model with 10 Numbered Landmark Parts';
    heart.shortDescription =
      '2-part dissectible life-size human heart model with 10 numbered landmark parts and matching reference study card on display stand.';
    heart.longDescription = HEART_DESCRIPTION;
    heart.seoTitle = 'Human Heart Model (10 Numbered Parts) | Ambala Manufacturer';
    heart.seoDescription =
      'Buy 2-part dissectible human heart models with 10 numbered anatomical landmarks direct from Vinayak Enterprises Ambala. Ideal for biology & medical labs.';
    heart.metaKeywords = [
      'human heart model',
      'heart anatomy model 10 parts',
      'human heart anatomical model',
      'biology teaching aid',
      'heart model manufacturer Ambala',
    ];
    heart.faq = HEART_FAQS;
    await heart.save();
    console.log(`Successfully updated Heart Model (${heart.slug}) with SEO content & FAQs.`);
  }

  // 3. Upsert Blog Post 1
  let admin = await Admin.findOne();
  if (!admin) {
    admin = await Admin.create({
      name: 'Vinayak Enterprises Editorial Team',
      email: 'admin@vinayakenterprises.agency',
      password: 'InitialSecurePassword123!',
      role: 'super_admin',
      isActive: true,
    });
  }

  const blogSlug = 'human-skeleton-206-bones-list-and-names';
  const blogPayload = {
    title: 'Human Skeleton: 206 Bones List and Names (The Complete Anatomy Guide)',
    slug: blogSlug,
    category: 'Human Anatomy Model',
    tags: ['Anatomy', 'Human Skeleton', '206 Bones', 'NEET Biology', 'MBBS Osteology', 'Bone Model'],
    author: admin._id,
    views: 350,
    status: 'published' as const,
    publishedAt: new Date(),
    excerpt:
      'Complete academic breakdown of all 206 human bones across the Axial and Appendicular skeletons with osteology summary tables and laboratory study tips.',
    content: BLOG_CONTENT,
    seoTitle: 'Human Skeleton: 206 Bones List and Names | Anatomy Guide',
    seoDescription:
      'Complete list of all 206 bones in the human body with names, divisions (axial & appendicular), and osteology charts for biology and MBBS students.',
  };

  const existingBlog = await Blog.findOne({ slug: blogSlug });
  if (existingBlog) {
    Object.assign(existingBlog, blogPayload);
    await existingBlog.save();
    console.log('Successfully updated Blog Post 1: Human Skeleton 206 bones.');
  } else {
    await Blog.create(blogPayload);
    console.log('Successfully created Blog Post 1: Human Skeleton 206 bones.');
  }

  console.log('\nAll SEO content, FAQs, and Blog Post 1 successfully implemented!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error running script:', err);
  process.exit(1);
});
