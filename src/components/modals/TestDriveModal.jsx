import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, Car } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TestDriveModal({
  isOpen,
  onClose,
  initialCar,
  allCars,
  onSuccess
}) {
  const [selectedCarId, setSelectedCarId] = useState(initialCar?.id || allCars?.[0]?.id || "");
  const [atelierLocation, setAtelierLocation] = useState("Mumbai Atelier (Bandra Kurla Complex / BKC)");
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState("14:00 - VIP Afternoon Slot");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [driverExperience, setDriverExperience] = useState("Collector / Multi-Supercar Owner");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationCode, setReservationCode] = useState("");

  const currentSelectedCar = allCars?.find(c => c.id === selectedCarId) || initialCar || allCars?.[0] || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    // Generate unique VIP confirmation reference
    const code = `AUREUS-${Math.floor(1000 + Math.random() * 9000)}-${currentSelectedCar.brand?.slice(0, 3).toUpperCase() || 'VIP'}`;
    setReservationCode(code);
    setIsSubmitted(true);

    // Trigger luxury golden confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5D061', '#E5B83A', '#D4AF37', '#ffffff']
      });
    } catch (err) {
      console.warn("Confetti triggered:", err);
    }

    if (onSuccess) {
      onSuccess(`Test drive confirmed for ${currentSelectedCar.name}. Code: ${code}`);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSubmitted(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 cursor-pointer"
      onClick={handleResetAndClose}
    >
      
      <motion.div 
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        className="relative w-full max-w-2xl bg-luxury-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-luxury-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-400/10 text-gold-400 border border-gold-400/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">
                Private Concierge Test Drive Reservation
              </h2>
              <p className="text-xs text-slate-400">
                White-Glove Dynamic Experience & Atelier Consultation
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            /* VIP Confirmation Card */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-gold animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-400">
                  Concierge Reservation Confirmed
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
                  We Await Your Arrival, {fullName.split(' ')[0]}
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                  Your private viewing and dynamic test drive of the <strong className="text-white">{currentSelectedCar.name}</strong> has been secured in our VIP schedule.
                </p>
              </div>

              {/* VIP Reservation Pass Card */}
              <div className="p-6 rounded-2xl bg-luxury-900/90 border border-gold-400/40 text-left space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reservation Pass ID</span>
                    <span className="text-base font-mono font-bold text-gold-400">{reservationCode}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gold-400 text-luxury-950">
                    VIP PASS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Vehicle Allocation</span>
                    <span className="font-semibold text-white">{currentSelectedCar.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date & Time</span>
                    <span className="font-semibold text-white">{appointmentDate} ({timeSlot.split(' ')[0]})</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Atelier Location</span>
                    <span className="font-semibold text-white">{atelierLocation}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>A dedicated Senior Atelier Host will welcome you with complimentary chauffeur transport upon request.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="flex-1 py-3.5 rounded-xl bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:bg-gold-500 transition-all"
                >
                  Return to Fleet
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Vehicle Selection */}
              <div>
                <label htmlFor="testdrive-car-select" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  <Car className="w-3.5 h-3.5 text-gold-400" />
                  Select Vehicle for Test Drive
                </label>
                <select
                  id="testdrive-car-select"
                  name="vehicle"
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                >
                  {allCars?.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} ({car.category} • {car.horsepower} HP • {car.priceFormatted})
                    </option>
                  ))}
                </select>
              </div>

              {/* Showroom Atelier Location */}
              <div>
                <label htmlFor="testdrive-location-select" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  Atelier / Delivery Location
                </label>
                <select
                  id="testdrive-location-select"
                  name="atelierLocation"
                  value={atelierLocation}
                  onChange={(e) => setAtelierLocation(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                >
                  <option value="Chennai Coastal Atelier (Boat Club Road / ECR)">Chennai Coastal Atelier (Boat Club Road / ECR)</option>
                  <option value="Coimbatore Motorsport Atelier (Race Course Road)">Coimbatore Motorsport Atelier (Race Course Road)</option>
                  <option value="Cochin Portside Atelier (Marine Drive, Kerala)">Cochin Portside Atelier (Marine Drive, Kerala)</option>
                  <option value="Mangalore Coastal Atelier (Kadri Hills, Karnataka)">Mangalore Coastal Atelier (Kadri Hills, Karnataka)</option>
                  <option value="Bengaluru Atelier (UB City / Lavelle Road)">Bengaluru Atelier (UB City / Lavelle Road)</option>
                  <option value="Hyderabad Atelier (Jubilee Hills Road No. 36)">Hyderabad Atelier (Jubilee Hills Road No. 36)</option>
                  <option value="Mumbai Atelier (Bandra Kurla Complex / BKC)">Mumbai Atelier (Bandra Kurla Complex / BKC)</option>
                  <option value="New Delhi Atelier (Aerocity Worldmark)">New Delhi Atelier (Aerocity Worldmark)</option>
                  <option value="Private Residence Enclosed Delivery (All India)">Private Residence Enclosed Delivery (All India)</option>
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="testdrive-date-input" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    Preferred Date
                  </label>
                  <input
                    id="testdrive-date-input"
                    name="appointmentDate"
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-luxury-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label htmlFor="testdrive-time-select" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    Time Window
                  </label>
                  <select
                    id="testdrive-time-select"
                    name="timeSlot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-luxury-900 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="10:00 - Morning Private Slot">10:00 AM - Morning Private Slot</option>
                    <option value="14:00 - VIP Afternoon Slot">02:00 PM - VIP Afternoon Slot</option>
                    <option value="17:00 - Golden Hour Sunset Run">05:00 PM - Golden Hour Sunset Run</option>
                    <option value="Custom - Chauffeur Coordinated">Custom Flight / Chauffeur Coordinated</option>
                  </select>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 block">
                  VIP Guest Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="testdrive-fullname" className="sr-only">Full Name</label>
                    <input
                      id="testdrive-fullname"
                      name="fullName"
                      aria-label="Full Name"
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="testdrive-email" className="sr-only">Private Email</label>
                    <input
                      id="testdrive-email"
                      name="email"
                      aria-label="Private Email"
                      type="email"
                      required
                      placeholder="Private Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="testdrive-phone" className="sr-only">Mobile or WhatsApp Number</label>
                    <input
                      id="testdrive-phone"
                      name="phone"
                      aria-label="Mobile or WhatsApp Number"
                      type="tel"
                      required
                      placeholder="+91 Mobile / WhatsApp *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="testdrive-experience" className="sr-only">Driver Experience Level</label>
                    <select
                      id="testdrive-experience"
                      name="driverExperience"
                      aria-label="Driver Experience Level"
                      value={driverExperience}
                      onChange={(e) => setDriverExperience(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="Collector / Multi-Supercar Owner">Collector / Multi-Supercar Owner</option>
                      <option value="First-Time Exotic Buyer">First-Time Exotic Buyer</option>
                      <option value="Track / FIA License Holder">Track / FIA Racing License Holder</option>
                      <option value="Corporate / Fleet Representative">Corporate / Family Office Principal</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="testdrive-requests" className="sr-only">Special Requests</label>
                    <input
                      id="testdrive-requests"
                      name="specialRequests"
                      aria-label="Special Requests"
                      type="text"
                      placeholder="Special Requests (e.g. Helipad pickup, NDA)..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-luxury-950 font-bold text-sm uppercase tracking-widest shadow-glow-gold hover:shadow-xl transition-all duration-300"
                >
                  Confirm Concierge Test Drive Reservation
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-2">
                  No obligation. Handled with supreme discretion under strict non-disclosure protocol.
                </p>
              </div>

            </form>
          )}
        </div>

      </motion.div>

    </motion.div>
  );
}
