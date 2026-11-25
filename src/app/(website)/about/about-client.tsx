'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Calendar,
  GraduationCap,
  Microscope,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  PhoneCall,
  MessageCircle,
  Award,
  Clock,
  Sparkles,
  MapPin,
  HeartPulse,
  FlaskConical,
  BookOpen,
} from 'lucide-react';
import { SITE, ABOUT_CONTENT } from '@/lib/constants';
import { whatsappChatUrl } from '@/lib/site-contact';
import { fadeUp, staggerContainer } from '@/components/website/motion';

// 5 Key Journey Eras (2000 - Present)
const MILESTONES = [
  {
    year: '2000',
    title: 'Founding & Workshop Establishment',
    subtitle: 'Humble beginnings in India’s scientific instruments capital',
    description:
      'Vinayak Enterprises was founded in 2000 in Ambala Cantt, Haryana — world-renowned as India’s hub for precision scientific instruments. Starting as an in-house fabrication workshop, we focused on precision laboratory glassware, physical science equipment, and basic educational apparatus for regional schools and colleges.',
    highlights: [
      'Established manufacturing workshop at Ambala Cantt',
      'In-house metal turning, optical fitting and assembly',
      'Direct supply to local schools and educational trusts',
    ],
    tag: 'Founding Era',
  },
  {
    year: '2008',
    title: 'Vilakshan Netra Microscope Series',
    subtitle: 'Breakthrough in optical precision & classroom durability',
    description:
      'Recognizing the need for affordable yet research-grade optical equipment, we developed and launched our proprietary "Vilakshan Netra" microscope series. Engineered with multi-coated achromat optical lenses, 1600x magnification capabilities, and rugged die-cast mechanical bodies, it became an instant favorite for college biology departments.',
    highlights: [
      'Proprietary Vilakshan Netra optical microscope series',
      'Precision brass gears and quad-revolving nosepiece',
      'Expansion into university life-science departments',
    ],
    tag: 'Optical Innovation',
  },
  {
    year: '2015',
    title: 'Medical Anatomical Models & Skeletons',
    subtitle: 'Entering medical education & anatomical simulation',
    description:
      'To support the rapid expansion of medical, dental, and nursing colleges across India, Vinayak Enterprises launched its comprehensive Human Anatomy line. Using non-toxic, unbreakable PVC and hand-painted anatomical landmarks, we began manufacturing life-size articulated skeletons, dismountable human torsos, and specialized cardiology/nephrology models.',
    highlights: [
      'Medical-grade non-toxic PVC moulding and casting',
      'Life-size 5ft 2in articulated skeletons with flexible spines',
      'Anatomical accuracy aligned with NMC & medical college syllabi',
    ],
    tag: 'Medical Models',
  },
  {
    year: '2020',
    title: 'CPR Training Manikins & Healthcare Simulators',
    subtitle: 'Emergency response, BLS/ACLS & nursing training apparatus',
    description:
      'With increasing emphasis on hands-on emergency training, we introduced advanced CPR Training Manikins featuring realistic chest rise, airway obstruction simulation, and auditory compression clickers. Our manikins are now actively utilized in nursing colleges, paramedic institutes, disaster response teams, and hospital skill laboratories nationwide.',
    highlights: [
      'Adult & infant BLS/ACLS CPR training resuscitation manikins',
      'Realistic anatomical landmarks & compression depth feedback',
      'Supplied to civil hospitals, fire services and nursing colleges',
    ],
    tag: 'Healthcare Simulation',
  },
  {
    year: '2025+',
    title: 'Modern Digital Manufacturing & GeM Supply',
    subtitle: '25+ years of excellence with pan-India institutional reach',
    description:
      'Celebrating over 25 years of continuous manufacturing, Vinayak Enterprises operates with modern ISO-aligned quality protocols, digital order fulfillment, GeM (Government e-Marketplace) tender compliance, and direct factory-to-institution dispatch across all 28 states and Union Territories of India.',
    highlights: [
      'Over 500+ educational & healthcare institutions served',
      'Full GeM portal and institutional tender compliance',
      'Shockproof multi-layer packing with pan-India transit guarantee',
    ],
    tag: '25+ Years Legacy',
  },
];

// Interactive Core Capabilities Tabs
const CAPABILITY_TABS = [
  {
    id: 'manufacturing',
    title: 'In-House Manufacturing',
    icon: Building2,
    lead: 'Factory-direct precision from our Ambala Cantt manufacturing facility.',
    description:
      'Unlike trading agencies or middlemen who re-label imported equipment, Vinayak Enterprises handles fabrication, casting, optic calibration, and final assembly directly at our factory in Ambala Cantt. This allows us to offer 30-40% savings on institutional budgets while providing customized apparatus modifications.',
    points: [
      'Direct workshop in Ambala Cantt with dedicated precision machining',
      'Custom batch fabrication for institutional laboratories',
      'Factory-direct wholesale pricing with transparent GST billing',
      'Readily available replacement parts, lenses, and accessories',
    ],
  },
  {
    id: 'syllabus',
    title: 'Syllabus & Medical Accuracy',
    icon: GraduationCap,
    lead: 'Engineered strictly in accordance with official educational & medical syllabi.',
    description:
      'Every anatomical model, microscope specimen slide, and laboratory apparatus is verified against the curriculum guidelines of NMC (National Medical Commission), INC (Indian Nursing Council), Pharmacy Council, CBSE, and ICSE. Numbered anatomical landmark key cards accompany every model.',
    points: [
      'Exact anatomical proportions, muscle insertions and nerve pathways',
      'Standardized optical magnification up to 1600x with DIN achromat objectives',
      'Included bilingual laminated key-cards for student self-study',
      'Approved for MBBS, BDS, B.Sc Nursing, and Pharmacy practical curricula',
    ],
  },
  {
    id: 'tenders',
    title: 'Institutional Supply & GeM',
    icon: FileText,
    lead: 'Seamless procurement support for institutional bulk orders & government tenders.',
    description:
      'We specialize in B2B and institutional supply. We provide itemized GST quotation sheets, technical compliance data sheets, authorization letters, and tender documentation for government universities, colleges, and central/state procurement portals.',
    points: [
      'GeM (Government e-Marketplace) registered supplier',
      'Itemized GST invoices with pan-India HSN code compliance',
      'Official technical datasheets and compliance comparative charts',
      'Dedicated tender desk support with fast 24-hour quotation turnaround',
    ],
  },
  {
    id: 'logistics',
    title: 'Safe Packing & Logistics',
    icon: Truck,
    lead: 'Zero-damage transit guarantee across India via specialized multi-layer packaging.',
    description:
      'Scientific instruments and anatomical models demand delicate handling. We use high-density custom thermoform foam moulds, air-cushioned bubble wraps, and reinforced corrugated wooden crates to ensure instruments arrive factory-fresh anywhere in India.',
    points: [
      'Custom-moulded thermoform polystyrene cavities for every model',
      'Heavy-duty corrugated master cartons and wooden pallet reinforcement',
      'Partnered with premier express logistics for tracked door delivery',
      '100% pre-dispatch inspection and transit damage replacement policy',
    ],
  },
];

// 4 Sectors We Serve
const SECTORS = [
  {
    icon: HeartPulse,
    name: 'Medical & Nursing Colleges',
    description:
      'Human torso models, articulated skeletons, CPR manikins, pathology microscopes, organ sets, and nursing skill lab simulators.',
  },
  {
    icon: Microscope,
    name: 'Universities & Research Labs',
    description:
      'Vilakshan Netra binocular research microscopes, analytical glassware, distillation assemblies, and pharmacy equipment.',
  },
  {
    icon: BookOpen,
    name: 'CBSE, ICSE & State Schools',
    description:
      'Composite science kits, monocular student microscopes, permanent biology slides, human anatomy charts, and physics apparatus.',
  },
  {
    icon: FlaskConical,
    name: 'Hospitals & Training Centers',
    description:
      'Adult/infant resuscitation manikins, emergency airway trainers, surgical anatomy displays, and paramedical teaching apparatus.',
  },
];

export function AboutClient() {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(4); // Default to current era
  const [activeCapabilityTab, setActiveCapabilityTab] = useState('manufacturing');

  const activeMilestone = MILESTONES[activeMilestoneIndex];
  const activeCapability = CAPABILITY_TABS.find((t) => t.id === activeCapabilityTab) || CAPABILITY_TABS[0];

  const whatsappInquiry = whatsappChatUrl(
    SITE.whatsapp,
    'Namaste Vinayak Enterprises! I visited your About Us page and would like to learn more about your direct manufacturing and institutional supply.'
  );

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-16">
      {/* 1. CLEAN BREADCRUMB & INTRO HEADER (No Big Dark Blue Banner) */}
      <div className="bg-white border-b border-slate-200/80 pt-6 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#1a3a6b] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-orange-600 font-semibold">About Us</span>
          </nav>

          {/* Main Title Block */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-orange-200">
              <Building2 className="h-3.5 w-3.5 text-orange-600" />
              Established 2000 · 25+ Years of Manufacturing Excellence
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a3a6b] tracking-tight leading-tight">
              Precision Scientific Instruments &amp; Medical Models Since 2000
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-4 leading-relaxed">
              Founded in <strong>Ambala Cantt</strong> — India’s historic capital for scientific instrumentation —{' '}
              <strong>Vinayak Enterprises</strong> has engineered, manufactured, and supplied research microscopes,
              anatomical teaching models, CPR training simulators, and laboratory apparatus to over 500+ institutions across India for over two and a half decades.
            </p>
          </div>

          {/* 4 Quick Stat Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Calendar className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Heritage</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b]">25+ Years</div>
              <p className="text-xs text-slate-500 mt-1">Dedicated manufacturing since 2000</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <GraduationCap className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Institutions</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b]">500+</div>
              <p className="text-xs text-slate-500 mt-1">Colleges, schools &amp; skill labs supplied</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Microscope className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Production</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b]">10,000+</div>
              <p className="text-xs text-slate-500 mt-1">Precision models &amp; microscopes built</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Truck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Coverage</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b]">Pan-India</div>
              <p className="text-xs text-slate-500 mt-1">Direct GST dispatch &amp; GeM tenders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12 space-y-16">
        {/* ========================================================= */}
        {/* 2. INTERACTIVE MILESTONE TIMELINE (2000 to Present)       */}
        {/* ========================================================= */}
        <section aria-labelledby="journey-heading" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-orange-600 font-bold text-xs uppercase tracking-wider">Our Evolution</span>
            <h2 id="journey-heading" className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b] tracking-tight mt-1">
              Our Journey Since 2000
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Click through the eras below to explore how Vinayak Enterprises grew from an Ambala workshop to a pan-India manufacturing leader.
            </p>
          </div>

          {/* Timeline Tab Buttons */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-slate-100">
            {MILESTONES.map((m, idx) => {
              const isActive = activeMilestoneIndex === idx;
              return (
                <button
                  key={m.year}
                  type="button"
                  onClick={() => setActiveMilestoneIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-[#1a3a6b] text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-orange-400 animate-pulse' : 'bg-slate-400'}`} />
                  <span>{m.year}</span>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Display Card */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone.year}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-orange-600 font-mono">
                      {activeMilestone.year}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-[#1a3a6b] px-3 py-1 rounded-full">
                      {activeMilestone.tag}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Phase {activeMilestoneIndex + 1} of {MILESTONES.length}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1a3a6b]">
                  {activeMilestone.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {activeMilestone.subtitle}
                </p>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4">
                  {activeMilestone.description}
                </p>

                <div className="mt-6 pt-5 border-t border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Key Milestone Achievements:
                  </h4>
                  <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {activeMilestone.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. INTERACTIVE CORE CAPABILITIES TABS                      */}
        {/* ========================================================= */}
        <section aria-labelledby="capabilities-heading" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-orange-600 font-bold text-xs uppercase tracking-wider">Manufacturing Edge</span>
            <h2 id="capabilities-heading" className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b] tracking-tight mt-1">
              Why Institutions Rely On Us
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Select a core pillar below to view our manufacturing standards and procurement advantages.
            </p>
          </div>

          {/* Capability Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
            {CAPABILITY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCapabilityTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCapabilityTab(tab.id)}
                  className={`flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 border-[#1a3a6b] text-[#1a3a6b] shadow-sm ring-2 ring-[#1a3a6b]/10'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-2 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span className="text-xs sm:text-sm font-bold leading-tight">{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Capability Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCapability.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200"
            >
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1a3a6b]">
                {activeCapability.lead}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm sm:text-base leading-relaxed mt-2">
                {activeCapability.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {activeCapability.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ========================================================= */}
        {/* 4. WHO WE SERVE (4 Sector Cards)                         */}
        {/* ========================================================= */}
        <section aria-labelledby="sectors-heading">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-orange-600 font-bold text-xs uppercase tracking-wider">Institutional Reach</span>
            <h2 id="sectors-heading" className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b] tracking-tight mt-1">
              Sectors We Serve
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Providing customized laboratory setups and medical training apparatus tailored to institutional requirements.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECTORS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1a3a6b] flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#1a3a6b] transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore Products</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. FACTORY VERIFICATION & QUALITY ASSURANCE               */}
        {/* ========================================================= */}
        <section aria-labelledby="factory-heading" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-blue-100 text-[#1a3a6b] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <MapPin className="h-3.5 w-3.5 text-orange-600" /> Factory Location &amp; Transparency
              </span>
              <h2 id="factory-heading" className="text-2xl sm:text-3xl font-extrabold text-[#1a3a6b] tracking-tight">
                Direct Manufacturing Desk In Ambala Cantt
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">
                Institutions and purchasing committees are always welcome to inspect our manufacturing facilities, assembly lines, and material quality in Ambala Cantt. We take immense pride in our craftsmanship and transparent business dealings.
              </p>

              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <MapPin className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-slate-900">Manufacturing Facility Address:</p>
                    <p className="text-slate-600">46-A, Ashok Nagar, Ambala Cantt, Ambala, Haryana 133001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-slate-900">Operating Hours:</p>
                    <p className="text-slate-600">Monday – Saturday: 9:00 AM – 10:00 PM | Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <Award className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-slate-900">Certifications &amp; Tender Documentation:</p>
                    <p className="text-slate-600">Official ISO 9001, CE, and GMP compliance certificates are provided for institutional tender submissions upon request.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a3a6b] to-[#112646] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between h-full">
              <div>
                <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">Direct Manufacturer Access</span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">Speak Directly with Our Manufacturing Team</h3>
                <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
                  Have a specific apparatus dimension, custom skeleton mounting, or tender requirement? Talk directly to our technical desk without middlemen.
                </p>
              </div>

              <div className="space-y-3 mt-8">
                <a
                  href={`tel:${SITE.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#1a3a6b] font-bold text-sm px-5 py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-md"
                >
                  <PhoneCall className="h-4 w-4 text-orange-600" /> Call {SITE.phone}
                </a>

                <a
                  href={whatsappInquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-md"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>

                <Link
                  href="/request-quote"
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-md"
                >
                  <FileText className="h-4 w-4" /> Request Institutional Quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. CALL TO ACTION BANNER                                  */}
        {/* ========================================================= */}
        <section className="bg-gradient-to-r from-[#1a3a6b] to-[#122b52] rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Equip Your Laboratory or Medical Training Facility?
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
            Send us your list of required equipment, model codes, or tender specifications. We provide formal GST itemized quotes within 24 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <Link
              href="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors shadow-md"
            >
              Browse Complete Catalog
            </Link>
            <Link
              href="/catalogues"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm backdrop-blur-sm transition-colors"
            >
              Download PDF Catalogue
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm backdrop-blur-sm transition-colors"
            >
              Contact Sales Desk
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutClient;
