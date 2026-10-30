import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Plane, Key, Gem, Sparkles, CheckCircle2 } from 'lucide-react';
import AureusLogo from '../common/AureusLogo';

export default function AboutSection({ onOpenBooking }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 15 Premier Luxury, Supercar & Hypercar Fleet Slides
  const showcaseSlides = [
    {
      id: "panamera-dusk",
      title: "Porsche Panamera Turbo E-Hybrid",
      badge: "STUTTGART DUSK • 700 PS",
      specs: "4.0L V8 Twin-Turbo • 0-100 in 3.2s",
      location: "Mumbai BKC Atelier",
      image: "/showcase/porsche-panamera-dusk.jpg",
      alt: "Porsche Panamera Turbo E-Hybrid at dusk"
    },
    {
      id: "ferrari-sf90",
      title: "Ferrari SF90 Stradale Assetto Fiorano",
      badge: "MARANELLO HYBRID • 1,000 PS",
      specs: "Tri-Motor Hybrid AWD • 0-100 in 2.5s",
      location: "Delhi Aerocity Flagship",
      image: "/cars/ferrari-sf90-stradale.jpg",
      alt: "Ferrari SF90 Stradale Assetto Fiorano"
    },
    {
      id: "lamborghini-revuelto",
      title: "Lamborghini Revuelto HPEV V12",
      badge: "SANT'AGATA V12 • 1,015 CV",
      specs: "Naturally Aspirated V12 • 350+ km/h",
      location: "Bengaluru UB City Gallery",
      image: "/cars/lamborghini-revuelto.jpg",
      alt: "Lamborghini Revuelto HPEV V12"
    },
    {
      id: "porsche-gt3rs",
      title: "Porsche 911 GT3 RS Weissach",
      badge: "WEISSACH MOTORSPORT • 525 PS",
      specs: "4.0L NA Boxer-6 • 9,000 RPM screamer",
      location: "Mumbai BKC Atelier",
      image: "/cars/porsche-911-gt3-rs.jpg",
      alt: "Porsche 911 GT3 RS Weissach Package"
    },
    {
      id: "bugatti-chiron",
      title: "Bugatti Chiron Pur Sport W16",
      badge: "MOLSHEIM W16 • 1,500 PS",
      specs: "8.0L Quad-Turbo W16 • 0-100 in 2.3s",
      location: "Hyderabad Jubilee Hills Suite",
      image: "/cars/bugatti-chiron-pur-sport.jpg",
      alt: "Bugatti Chiron Pur Sport W16"
    },
    {
      id: "mclaren-750s",
      title: "McLaren 750S Spider Carbon Monocage",
      badge: "WOKING CARBON • 750 PS",
      specs: "4.0L Twin-Turbo V8 • Ultralight 1,389 kg",
      location: "Chennai Boat Club Salon",
      image: "/cars/mclaren-750s-spider.jpg",
      alt: "McLaren 750S Spider Carbon Monocage"
    },
    {
      id: "koenigsegg-jesko",
      title: "Koenigsegg Jesko Attack Hypercar",
      badge: "ÄNGELHOLM MEGACAR • 1,600 BHP",
      specs: "Twin-Turbo V8 • 9-Speed LST • 1,000 kg Downforce",
      location: "Pan-India Airfreight Hangar",
      image: "/cars/koenigsegg-jesko.jpg",
      alt: "Koenigsegg Jesko Attack Hypercar"
    },
    {
      id: "rolls-royce-cullinan",
      title: "Rolls-Royce Cullinan Series II",
      badge: "GOODWOOD BLACK BADGE • V12",
      specs: "6.75L Twin-Turbo V12 • Magic Carpet Ride",
      location: "Delhi Aerocity Flagship",
      image: "/cars/colors/rolls-royce-cullinan-red.jpg",
      alt: "Rolls-Royce Cullinan in English Red"
    },
    {
      id: "rolls-royce-spectre",
      title: "Rolls-Royce Spectre Bespoke Starlight",
      badge: "GOODWOOD BESPOKE • CELESTIAL",
      specs: "All-Electric Sanctuary • 584 HP • 900 Nm",
      location: "Cochin Marine Drive Pavilion",
      image: "/cars/rolls-royce-spectre.jpg",
      alt: "Rolls-Royce Spectre Bespoke Starlight"
    },
    {
      id: "aston-martin-dbs",
      title: "Aston Martin DBS 770 Ultimate V12",
      badge: "GAYDON V12 • 770 PS",
      specs: "5.2L Twin-Turbo V12 • 900 Nm • 340 km/h",
      location: "Mangalore Kadri Hills Estate",
      image: "/cars/aston-martin-dbs-770-ultimate.jpg",
      alt: "Aston Martin DBS 770 Ultimate V12"
    },
    {
      id: "mercedes-amg-gt",
      title: "Mercedes-AMG GT Black Series Aero",
      badge: "AFFALTERBACH AERO • 730 HP",
      specs: "Flat-Plane V8 • Nürburgring Record Aero",
      location: "Coimbatore Race Course Hub",
      image: "/cars/mercedes-amg-gt-black-series.jpg",
      alt: "Mercedes-AMG GT Black Series Aero"
    },
    {
      id: "bentley-continental",
      title: "Bentley Continental GT Mulliner Speed",
      badge: "CREWE HANDCRAFTED • W12 SPEED",
      specs: "6.0L W12 Twin-Turbo • All-Wheel Steering",
      location: "Pan-India Concierge Network",
      image: "/cars/bentley-continental-gt-mulliner.jpg",
      alt: "Bentley Continental GT Mulliner Speed"
    },
    {
      id: "lamborghini-urus",
      title: "Lamborghini Urus Performante Super SUV",
      badge: "PIKES PEAK RECORD • 666 CV",
      specs: "4.0L Twin-Turbo V8 • 0-100 in 3.3s",
      location: "Bengaluru UB City Gallery",
      image: "/cars/lamborghini-urus-performante.jpg",
      alt: "Lamborghini Urus Performante in Giallo Inti"
    },
    {
      id: "bmw-m4",
      title: "BMW M4 Competition M xDrive",
      badge: "BAVARIAN MOTORSPORT • 510 HP",
      specs: "3.0L M TwinPower Turbo • Track Weapon",
      location: "Delhi Aerocity Flagship",
      image: "/cars/bmw-m4-competition.jpg",
      alt: "BMW M4 Competition Isle of Man Green"
    },
    {
      id: "ferrari-purosangue",
      title: "Ferrari Purosangue High-Rev V12",
      badge: "MARANELLO V12 • 725 CV",
      specs: "6.5L Naturally Aspirated V12 • 310+ km/h",
      location: "Hyderabad Jubilee Hills Suite",
      image: "/cars/ferrari-purosangue.jpg",
      alt: "Ferrari Purosangue V12"
    },
    {
      id: "porsche-taycan-turbo-gt",
      title: "Porsche Taycan Turbo GT Weissach",
      badge: "STUTTGART EV RECORD • 1,108 PS",
      specs: "Dual-Motor Electric • 0-100 in 2.2s • Nürburgring King",
      location: "Coimbatore Race Course Hub",
      image: "/cars/porsche-taycan-turbo-gt.jpg",
      alt: "Porsche Taycan Turbo GT Weissach in Purple Sky Metallic"
    },
    {
      id: "mercedes-amg-gt-63",
      title: "Mercedes-AMG GT 63 S E Performance",
      badge: "AFFALTERBACH HYBRID • 843 HP",
      specs: "4.0L V8 Biturbo Hybrid • 1,470 Nm Torque • 316 km/h",
      location: "Mangalore Kadri Hills Estate",
      image: "/cars/mercedes-amg-gt-63-s-e-performance.jpg",
      alt: "Mercedes-AMG GT 63 S E Performance 4-Door Coupe"
    }
  ];

  const activeSlide = showcaseSlides[currentSlide] || showcaseSlides[0];

  // Images automatically change every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [showcaseSlides.length]);
  const pillars = [
    {
      icon: ShieldCheck,
      title: "150-Point Provenance Verification",
      description: "Each chassis undergoes comprehensive forensic examination by certified marque master technicians, verifying complete matching numbers and flawless service history."
    },
    {
      icon: Plane,
      title: "Pan-India White-Glove Logistics",
      description: "From climate-controlled air freight and customs clearance at Mumbai/Delhi to hydraulic enclosed ground transport directly to your private estate across India."
    },
    {
      icon: Key,
      title: "Factory Allocation Privileges",
      description: "Direct ties to Maranello, Sant'Agata, and Stuttgart ensure guaranteed Right-Hand Drive (RHD) build slots for limited-series hypercars and bespoke commissions."
    },
    {
      icon: Gem,
      title: "Private Wealth Asset Advisory",
      description: "Automotive investments structured with premier private wealth desks (HDFC Wealth, ICICI, Kotak), offering luxury leasing and capital preservation models."
    }
  ];

  const stats = [
    { label: "Bespoke Deliveries", value: "180+ in India" },
    { label: "Indian Showroom Hubs", value: "5 Ateliers" },
    { label: "Active Fleet Valuation", value: "₹1,200 Cr+" },
    { label: "Client Satisfaction", value: "99.8%" }
  ];

  return (
    <section id="about" className="py-24 relative bg-luxury-950 overflow-hidden">
      {/* Ambient background styling */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* Main Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Sovereign Brand Monogram Crest */}
            <div className="pb-1">
              <AureusLogo layout="vertical" size="sm" align="left" animated={true} />
            </div>

            <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.25em] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Atelier Heritage</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Where Engineering Transcendence Meets Haute Horlogerie
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Founded at the intersection of motorsport excellence and rare collector curation, <strong>AUREUS VELOCE (THE SOVEREIGN KINETIC)</strong> represents the private sanctum for discerning automotive connoisseurs across the subcontinent.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              We do not simply deal in motorcars; we preserve historical milestones of mechanical fury. Whether curating a 1,000-horsepower hybrid hypercar or securing a strictly limited 1-of-60 track-bred masterpiece, our atelier is dedicated to elevating your garage into a sovereign private museum.
            </p>

            {/* Bullet points */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Confidential private transactions under full legal escrow</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Dedicated personal concierge accessible 24/7 in 6 languages</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Complimentary track day coaching with professional factory drivers</span>
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenBooking}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-luxury-950 font-bold text-xs uppercase tracking-widest shadow-glow-gold hover:shadow-xl transition-all cursor-pointer"
              >
                Inquire with Senior Partner
              </motion.button>
            </div>
          </motion.div>

          {/* Right Visual Image Showcase Slider - Automated 3s Crossfade */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group bg-luxury-900 select-none">
              
              {/* Carousel Image Container with Smooth 3s Ken Burns Transition */}
              <div className="relative h-[440px] sm:h-[480px] w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide.id}
                    src={activeSlide.image}
                    alt={activeSlide.alt}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.15, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-cover object-center brightness-[0.88] contrast-105"
                  />
                </AnimatePresence>

                {/* Dark Vignette Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-950 via-luxury-950/30 to-black/50 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-luxury-950/40 via-transparent to-luxury-950/40 pointer-events-none" />

                {/* Top Overlay Bar: Vehicle Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <motion.div 
                    key={`badge-${activeSlide.id}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3.5 py-1.5 rounded-full bg-luxury-950/80 backdrop-blur-md border border-gold-400/40 shadow-lg flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gold-400">
                      {activeSlide.badge}
                    </span>
                    <span className="text-white/30 hidden sm:inline">|</span>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-200 hidden sm:inline">
                      {activeSlide.title}
                    </span>
                  </motion.div>
                </div>

                {/* Floating Stat Card (Pan-India Flagship Hubs) */}
                <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-5 rounded-2xl glass-panel-gold border border-gold-400/30 flex items-center justify-between z-20 backdrop-blur-xl bg-luxury-950/85">
                  <div className="space-y-0.5 max-w-[70%]">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                      Pan-India Flagship Hubs • {activeSlide.location}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Mumbai BKC • Delhi Aerocity • Bengaluru UB City • Chennai • Hyderabad • Cochin • Coimbatore • Mangalore
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 pl-3 border-l border-white/10">
                    <span className="text-xs sm:text-sm font-mono font-bold text-gold-400 block">100% Guaranteed</span>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">Provenance Cleared</p>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>

        {/* Four Key Pillars with Stagger Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-gold-400/40 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-400/10 text-gold-400 border border-gold-400/30 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Global Statistics Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/15 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <div key={i} className="space-y-1">
              <span className="text-3xl sm:text-5xl font-display font-extrabold text-gold-gradient block">
                {s.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-medium">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
