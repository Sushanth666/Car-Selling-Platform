import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Layout & Structural Chrome
import { Navbar, Footer } from './components';

// Landing Page Content Sections
import { 
  HeroSection, 
  BrandsCategories, 
  CollectionGallery, 
  AboutSection, 
  FAQSection, 
  ContactSection 
} from './components';

// Interactive Overlays & Modals
import {
  CarDetailsModal,
  ComparisonModal,
  WishlistDrawer,
  TestDriveModal,
  SearchModal,
  DragRaceModal,
  RevBattleModal,
  FinanceCalculatorModal,
  SpecSheetModal
} from './components';

// Shared Feedback & Concierge
import { QuickToast, WhatsAppConcierge } from './components';

import { CARS_DATA, CATEGORIES } from './data/cars';

export default function App() {
  // Wishlist state with localStorage persistence
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Storage access:", e);
    }
    return ['porsche-911-gt3-rs', 'ferrari-sf90-stradale'];
  });

  // Comparison list (up to 4 cars)
  const [compareIds, setCompareIds] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_compare');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Storage access:", e);
    }
    return ['porsche-911-gt3-rs', 'mclaren-750s-spider'];
  });

  // Active Currency state (INR, USD, EUR, AED)
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    try {
      return localStorage.getItem('apex_currency') || 'INR';
    } catch {
      return 'INR';
    }
  });

  const handleCurrencyChange = (newCurrency) => {
    setCurrentCurrency(newCurrency);
    try {
      localStorage.setItem('apex_currency', newCurrency);
    } catch {}
  };

  // Recently viewed car IDs (persisted)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_recent_views');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['porsche-911-gt3-rs', 'bugatti-chiron-pur-sport', 'lamborghini-revuelto'];
  });

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("collection");

  // Modals & Panels
  const [inspectedCar, setInspectedCar] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [bookingCar, setBookingCar] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // New Interactive Feature Modals
  const [isDragRaceOpen, setIsDragRaceOpen] = useState(false);
  const [dragCar1, setDragCar1] = useState(null);

  const [isRevBattleOpen, setIsRevBattleOpen] = useState(false);

  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [financeCar, setFinanceCar] = useState(null);

  const [isSpecSheetOpen, setIsSpecSheetOpen] = useState(false);
  const [specCar, setSpecCar] = useState(null);
  const [specColor, setSpecColor] = useState(null);

  // Independent color customization state per car: { [carId]: colorObject }
  const [carColorSelections, setCarColorSelections] = useState({});

  const handleSelectCarColor = (carId, color) => {
    setCarColorSelections(prev => ({
      ...prev,
      [carId]: color
    }));
  };

  const handleInspectCar = (car, activeColor = null) => {
    if (activeColor) {
      setCarColorSelections(prev => ({ ...prev, [car.id]: activeColor }));
    }
    setInspectedCar(car);

    // Track recently viewed
    setRecentlyViewedIds(prev => {
      const next = [car.id, ...prev.filter(id => id !== car.id)].slice(0, 8);
      try {
        localStorage.setItem('apex_recent_views', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleOpenDragRace = (car = null) => {
    setDragCar1(car);
    setIsDragRaceOpen(true);
  };

  const handleOpenRevBattle = () => {
    setIsRevBattleOpen(true);
  };

  const handleOpenFinance = (car = null) => {
    setFinanceCar(car);
    setIsFinanceOpen(true);
  };

  const handleOpenSpecSheet = (car, color = null) => {
    setSpecCar(car);
    setSpecColor(color || carColorSelections[car.id] || car.defaultColour || car.colors?.[0]);
    setIsSpecSheetOpen(true);
  };

  // Dynamic kinetic moving marquee ticker in browser tab name (smooth scrolling animation, no eagle)
  useEffect(() => {
    const brandPhrase = inspectedCar 
      ? `${inspectedCar.name.toUpperCase()} • AUREUS VELOCE • THE SOVEREIGN KINETIC • `
      : "AUREUS VELOCE • THE SOVEREIGN KINETIC • BESPOKE LUXURY & EXOTIC HYPERCARS • ";
    
    let step = 0;
    document.title = brandPhrase;

    const ticker = setInterval(() => {
      document.title = brandPhrase.slice(step) + brandPhrase.slice(0, step);
      step = (step + 1) % brandPhrase.length;
    }, 280);

    return () => clearInterval(ticker);
  }, [inspectedCar]);

  // Global keyboard shortcut for search popup (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Global automation interface for bulletproof testing & screenshot capture
  useEffect(() => {
    window.__aureus = {
      openDetails: (indexOrId = 0) => {
        const car = typeof indexOrId === 'number' ? CARS_DATA[indexOrId] : (CARS_DATA.find(c => c.id === indexOrId) || CARS_DATA[0]);
        setInspectedCar(car);
      },
      closeDetails: () => setInspectedCar(null),
      openDragRace: () => setIsDragRaceOpen(true),
      closeDragRace: () => setIsDragRaceOpen(false),
      openRevBattle: () => setIsRevBattleOpen(true),
      closeRevBattle: () => setIsRevBattleOpen(false),
      openFinance: (indexOrId = 0) => {
        const car = typeof indexOrId === 'number' ? CARS_DATA[indexOrId] : (CARS_DATA.find(c => c.id === indexOrId) || CARS_DATA[0]);
        setFinanceCar(car);
        setIsFinanceOpen(true);
      },
      closeFinance: () => setIsFinanceOpen(false),
      closeAll: () => {
        setInspectedCar(null);
        setIsDragRaceOpen(false);
        setIsRevBattleOpen(false);
        setIsFinanceOpen(false);
        setIsWishlistOpen(false);
        setIsCompareOpen(false);
        setIsBookingOpen(false);
        setIsSearchOpen(false);
      }
    };
    return () => {
      delete window.__aureus;
    };
  }, []);

  // Micro-toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('apex_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn(e);
    }
  }, [wishlistIds]);

  // Persist comparison
  useEffect(() => {
    try {
      localStorage.setItem('apex_compare', JSON.stringify(compareIds));
    } catch (e) {
      console.warn(e);
    }
  }, [compareIds]);

  // Toggle Wishlist
  const handleToggleWishlist = (car) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(car.id);
      if (exists) {
        showToast(`Removed ${car.name} from your dream garage`);
        return prev.filter(id => id !== car.id);
      } else {
        showToast(`Added ${car.name} to your dream garage`);
        return [...prev, car.id];
      }
    });
  };

  // Toggle Compare
  const handleToggleCompare = (car) => {
    setCompareIds((prev) => {
      const exists = prev.includes(car.id);
      if (exists) {
        showToast(`Removed ${car.name} from comparison matrix`);
        return prev.filter(id => id !== car.id);
      } else {
        if (prev.length >= 4) {
          showToast(`Maximum 4 vehicles can be compared simultaneously.`);
          return prev;
        }
        showToast(`Added ${car.name} to comparison shootout`);
        return [...prev, car.id];
      }
    });
  };

  const handleAddCarToCompare = (car) => {
    if (compareIds.length >= 4) {
      showToast(`Maximum 4 vehicles in comparison shootout.`);
      return;
    }
    if (!compareIds.includes(car.id)) {
      setCompareIds([...compareIds, car.id]);
      showToast(`Added ${car.name} to comparison matrix`);
    }
  };

  const handleRemoveFromCompare = (carId) => {
    setCompareIds(compareIds.filter(id => id !== carId));
  };

  const handleClearCompare = () => {
    setCompareIds([]);
    showToast("Comparison matrix cleared");
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    showToast("Dream garage wishlist emptied");
  };

  // Open booking modal
  const handleOpenBooking = (car = null) => {
    setBookingCar(car || CARS_DATA[0]);
    setIsBookingOpen(true);
  };

  // Derived car collections
  const wishlistCars = CARS_DATA.filter(c => wishlistIds.includes(c.id));
  const comparedCars = CARS_DATA.filter(c => compareIds.includes(c.id));
  const heroCars = CARS_DATA.filter(c => c.isFeatured);
  const recentlyViewedCars = recentlyViewedIds
    .map(id => CARS_DATA.find(c => c.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-luxury-950 text-slate-100 font-sans selection:bg-gold-500/30 selection:text-gold-400">
      
      {/* Primary Sticky Luxury Navbar */}
      <Navbar
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        compareCount={compareIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenBooking={() => handleOpenBooking(null)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSearchModal={() => setIsSearchOpen(true)}
        currentCurrency={currentCurrency}
        onCurrencyChange={handleCurrencyChange}
        onOpenDragRace={() => handleOpenDragRace(null)}
        onOpenRevBattle={handleOpenRevBattle}
        onOpenFinance={() => handleOpenFinance(null)}
      />

      {/* Cinematic Hero Section */}
      <HeroSection
        heroCars={heroCars}
        onInspectCar={(car) => handleInspectCar(car)}
        onBookTestDrive={(car) => handleOpenBooking(car)}
      />

      {/* Prestigious Brands & Categories Showcase */}
      <BrandsCategories
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
      />

      {/* Main Car Collection Gallery with Live Filters, Sort & Search */}
      <CollectionGallery
        allCars={CARS_DATA}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        compareIds={compareIds}
        onToggleCompare={handleToggleCompare}
        onInspectCar={handleInspectCar}
        onBookTestDrive={(car) => handleOpenBooking(car)}
        onOpenSearchModal={() => setIsSearchOpen(true)}
        carColorSelections={carColorSelections}
        onSelectColor={handleSelectCarColor}
        currentCurrency={currentCurrency}
        recentlyViewedCars={recentlyViewedCars}
        onOpenFinance={handleOpenFinance}
        onOpenSpecSheet={handleOpenSpecSheet}
        onOpenDragRace={handleOpenDragRace}
        onOpenRevBattle={handleOpenRevBattle}
      />

      {/* Atelier Heritage & Concierge Pillars */}
      <AboutSection
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* Collector Frequently Addressed Inquiries */}
      <FAQSection
        onOpenContact={() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* International Showroom Ateliers & Confidential Dispatch Form */}
      <ContactSection
        onShowToast={showToast}
      />

      {/* Luxury Automotive Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onShowToast={showToast}
      />

      {/* Car Details Modal / Deep Dossier View */}
      <AnimatePresence>
        {inspectedCar && (
          <CarDetailsModal
            car={inspectedCar}
            isOpen={!!inspectedCar}
            onClose={() => setInspectedCar(null)}
            selectedColor={carColorSelections[inspectedCar.id] || inspectedCar.defaultColour || inspectedCar.colors?.[0]}
            onSelectColor={handleSelectCarColor}
            isWishlisted={wishlistIds.includes(inspectedCar.id)}
            onToggleWishlist={handleToggleWishlist}
            isCompared={compareIds.includes(inspectedCar.id)}
            onToggleCompare={handleToggleCompare}
            onBookTestDrive={(car) => handleOpenBooking(car)}
            onShowToast={showToast}
            currentCurrency={currentCurrency}
            onOpenFinance={handleOpenFinance}
            onOpenSpecSheet={handleOpenSpecSheet}
            onOpenDragRace={handleOpenDragRace}
          />
        )}
      </AnimatePresence>

      {/* Car Comparison Shootout Matrix Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <ComparisonModal
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            comparedCars={comparedCars}
            allCars={CARS_DATA}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddCarToCompare={handleAddCarToCompare}
            onClearCompare={handleClearCompare}
            onBookTestDrive={(car) => handleOpenBooking(car)}
          />
        )}
      </AnimatePresence>

      {/* Slide-out Dream Garage Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlistCars={wishlistCars}
            onRemoveFromWishlist={(carId) => {
              setWishlistIds(wishlistIds.filter(id => id !== carId));
              showToast("Removed vehicle from your saved garage");
            }}
            onClearWishlist={handleClearWishlist}
            onOpenCompareWithCars={(cars) => {
              setCompareIds(cars.map(c => c.id));
              setIsCompareOpen(true);
            }}
            onBookTestDrive={(car) => handleOpenBooking(car)}
            onInspectCar={(car) => handleInspectCar(car)}
          />
        )}
      </AnimatePresence>

      {/* VIP Test Drive & Concierge Appointment Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <TestDriveModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            initialCar={bookingCar}
            allCars={CARS_DATA}
            onSuccess={showToast}
          />
        )}
      </AnimatePresence>

      {/* Search Options & Live Spotlight Popup Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            allCars={CARS_DATA}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onInspectCar={(car) => handleInspectCar(car)}
            onBookTestDrive={(car) => handleOpenBooking(car)}
            onSelectCategory={setSelectedCategory}
            onViewAllInCollection={() => {
              const el = document.getElementById('collection');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      {/* 🏁 0-100 km/h Drag Strip Performance Simulator Modal */}
      <AnimatePresence>
        {isDragRaceOpen && (
          <DragRaceModal
            isOpen={isDragRaceOpen}
            onClose={() => setIsDragRaceOpen(false)}
            initialCar1={dragCar1 || inspectedCar || CARS_DATA[1]}
          />
        )}
      </AnimatePresence>

      {/* 🔊 Exhaust Soundboard & Engine Rev Battle Arena Modal */}
      <AnimatePresence>
        {isRevBattleOpen && (
          <RevBattleModal
            isOpen={isRevBattleOpen}
            onClose={() => setIsRevBattleOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 💰 Indian On-Road Price & Luxury EMI Calculator Modal */}
      <AnimatePresence>
        {isFinanceOpen && (
          <FinanceCalculatorModal
            isOpen={isFinanceOpen}
            onClose={() => setIsFinanceOpen(false)}
            initialCar={financeCar || inspectedCar || CARS_DATA[0]}
            onOpenBooking={(car) => handleOpenBooking(car)}
          />
        )}
      </AnimatePresence>

      {/* 📄 Official Monroney Window Sticker & Provenance Certificate Modal */}
      <AnimatePresence>
        {isSpecSheetOpen && specCar && (
          <SpecSheetModal
            isOpen={isSpecSheetOpen}
            onClose={() => setIsSpecSheetOpen(false)}
            car={specCar}
            activeColor={specColor}
          />
        )}
      </AnimatePresence>

      {/* 💬 VIP WhatsApp Concierge Floating Action Widget */}
      <WhatsAppConcierge
        activeCar={inspectedCar || bookingCar || CARS_DATA[0]}
        onOpenBooking={(car) => handleOpenBooking(car)}
      />

      {/* Quick Micro-Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <QuickToast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
