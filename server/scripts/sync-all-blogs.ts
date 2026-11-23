import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase } from '../config/database';
import Blog from '../models/Blog';
import Admin from '../models/Admin';

async function seedMissingBlogs() {
  await connectDatabase();
  console.log('Connected to MongoDB');

  const admin = (await Admin.findOne({ name: 'kanika' })) || (await Admin.findOne({}));
  if (!admin) {
    console.error('No admin found!');
    process.exit(1);
  }

  const blogsToEnsure = [
    {
      title: 'How to Choose the Right Microscope for Educational & Research Labs',
      slug: 'how-to-choose-the-right-microscope-for-educational-and-research-labs',
      category: 'Microscopes',
      tags: ['Microscopes', 'Laboratory Equipment', 'Research', 'School Labs'],
      author: admin._id,
      views: 98,
      status: 'published' as const,
      publishedAt: new Date('2026-11-14T10:00:00.000Z'),
      seoTitle: 'How to Choose Laboratory Microscopes for Schools & Colleges | Vinayak Enterprises',
      seoDescription:
        'A comprehensive guide to selecting monocular, binocular, and digital USB microscopes for educational institutes, pathology laboratories, and university research from Ambala.',
      excerpt:
        'A practical guide to selecting monocular, binocular, and digital USB microscopes for educational institutes, pathology laboratories, and university research.',
      content: `Selecting the right microscope requires evaluating optical resolution, mechanical stage stability, illumination type, and user ergonomics for your specific curriculum or diagnostic workload.

## 1. Monocular vs. Binocular Microscopes
For introductory school laboratories, sturdy monocular student microscopes provide robust durability and ease of use. However, for senior university students, pathology labs, and extended hours of research, binocular microscopes significantly reduce eye fatigue and provide stereo depth perception.

## 2. Digital & USB Connectivity
Modern classrooms benefit tremendously from digital microscopes featuring HDMI or USB connectivity. Educators can broadcast high-resolution live specimen feeds directly to digital smartboards, facilitating group discussions and interactive digital image capture.

## 3. Key Specifications to Check
- **Optical Glass & Objectives:** Look for achromatic or semi-plan objectives for sharp edge-to-edge clarity.
- **Illumination:** High-intensity LED cold lighting provides uniform brightness with minimal heat radiation.
- **Coaxial Focus:** Separate coarse and fine focusing controls ensure micro-level precision when examining cellular slides.

## Conclusion
At Vinayak Enterprises Ambala, we manufacture precision optical instruments adhering to institutional standards with reliable pan-India delivery.`,
    },
    {
      title: 'Standard Safety Guidelines & Best Practices for Chemistry Laboratories',
      slug: 'standard-safety-guidelines-for-chemistry-laboratories',
      category: 'Laboratory Equipment',
      tags: ['Chemistry', 'Safety', 'Lab Equipment', 'Guidelines'],
      author: admin._id,
      views: 76,
      status: 'published' as const,
      publishedAt: new Date('2026-11-11T10:00:00.000Z'),
      seoTitle: 'Chemistry Laboratory Safety Guidelines & Equipment Protocols | Vinayak Enterprises',
      seoDescription:
        'Essential safety precautions, storage guidelines, and equipment handling protocols every laboratory technician and educator should implement in schools and colleges.',
      excerpt:
        'Essential safety precautions, storage guidelines, and equipment handling protocols every laboratory technician and educator should implement.',
      content: `Maintaining stringent safety standards in chemistry and biology laboratories protects students, educators, and laboratory infrastructure from accidents and chemical exposure.

## 1. Proper Storage of Glassware & Apparatus
Borosilicate glassware, magnetic stirrers, and heating mantles must be regularly inspected for micro-cracks before thermal use. Broken or chipped glassware should be discarded immediately into designated sharps bins.

## 2. Personal Protective Equipment (PPE)
Mandatory laboratory protocols require high-grade nitrile gloves, chemical splash goggles, and flame-retardant lab coats during all active experimentation.

## 3. Ventilation & Fume Control
Volatile organic reagents and acid digestions must strictly be conducted inside certified fume hoods with appropriate exhaust air velocity to prevent toxic inhalation.

## 4. Emergency Preparedness
Every educational lab must have accessible eyewash stations, fire blankets, and certified ABC dry powder fire extinguishers placed near emergency exits.`,
    },
  ];

  for (const b of blogsToEnsure) {
    const existing = await Blog.findOne({ slug: b.slug });
    if (!existing) {
      await Blog.create(b);
      console.log(`Created blog in DB: ${b.title}`);
    } else {
      console.log(`Blog already exists in DB: ${b.title}`);
    }
  }

  const allBlogs = await Blog.find({}).sort({ publishedAt: -1 }).populate('author', 'name email').lean();
  console.log(`\n--- Total Blogs in MongoDB Now: ${allBlogs.length} ---`);
  for (const b of allBlogs) {
    const authorName = (b.author as any)?.name || 'Unknown';
    console.log(`- ${b.title} | Author: ${authorName} | Status: ${b.status} | Views: ${b.views}`);
  }

  process.exit(0);
}

seedMissingBlogs().catch((err) => {
  console.error('Error seeding blogs:', err);
  process.exit(1);
});
