import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ContactSection({ onShowToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Acquisition Consultation");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [preferredLocation, setPreferredLocation] = useState("Chennai Coastal Atelier");

  const ateliers = [
    {
      city: "Mumbai Flagship Atelier",
      region: "metro",
      regionLabel: "National Flagship",
      address: "One BKC, G-Block, Bandra Kurla Complex",
      country: "Mumbai, Maharashtra 400051, India",
      phone: "+91 22 6988 9000",
      hours: "Mon - Sat: 10:00 AM - 08:00 PM IST (Private Viewing By Appt)"
    },
    {
      city: "New Delhi Diplomatic Atelier",
      region: "metro",
      regionLabel: "Diplomatic Enclave",
      address: "Worldmark 3, Aerocity Luxury District",
      country: "New Delhi, Delhi 110037, India",
      phone: "+91 11 4988 5000",
      hours: "Mon - Sat: 10:00 AM - 08:00 PM IST (Private Vault Access)"
    },
    {
      city: "Bengaluru Haute Atelier",
      region: "south",
      regionLabel: "Karnataka Tech Capital",
      address: "UB City, 24 Vittal Mallya Road",
      country: "Bengaluru, Karnataka 560001, India",
      phone: "+91 80 4911 3000",
      hours: "Mon - Sun: 10:30 AM - 08:30 PM IST (Bespoke Lounge)"
    },
    {
      city: "Hyderabad Private Salon",
      region: "south",
      regionLabel: "Telangana Diamond Hub",
      address: "Road No. 36, Jubilee Hills",
      country: "Hyderabad, Telangana 500033, India",
      phone: "+91 40 4822 7000",
      hours: "Mon - Sat: 10:00 AM - 07:30 PM IST (Enclosed Transporters)"
    },
    {
      city: "Chennai Coastal Atelier",
      region: "south",
      regionLabel: "Tamil Nadu Coast",
      address: "14 Boat Club Road, Raja Annamalaipuram",
      country: "Chennai, Tamil Nadu 600028, India",
      phone: "+91 44 4822 8000",
      hours: "Mon - Sat: 10:00 AM - 08:00 PM IST (ECR Coastal Run Lounge)"
    },
    {
      city: "Coimbatore Motorsport Atelier",
      region: "south",
      regionLabel: "Motorsport Capital",
      address: "82 Race Course Road, Near Kari Motor Speedway",
      country: "Coimbatore, Tamil Nadu 641018, India",
      phone: "+91 422 491 5000",
      hours: "Mon - Sat: 10:00 AM - 07:30 PM IST (Track Scrutineering Support)"
    },
    {
      city: "Cochin Portside Atelier",
      region: "south",
      regionLabel: "Kerala Marine Drive",
      address: "Waterfront Skyway, Marine Drive",
      country: "Cochin (Kochi), Kerala 682031, India",
      phone: "+91 484 492 6000",
      hours: "Mon - Sat: 10:30 AM - 07:30 PM IST (Helipad & Yacht Slipway Access)"
    },
    {
      city: "Mangalore Coastal Atelier",
      region: "south",
      regionLabel: "Coastal Karnataka",
      address: "Kadri Hills Luxury Pavilion, Airport Road",
      country: "Mangalore, Karnataka 575004, India",
      phone: "+91 824 493 7000",
      hours: "Mon - Sat: 10:00 AM - 07:00 PM IST (Coastal Express Enclosed Transit)"
    }
  ];

  const filteredAteliers = selectedRegion === "all" 
    ? ateliers 
    : ateliers.filter(a => a.region === selectedRegion);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSent(true);
    if (onShowToast) {
      onShowToast(`Thank you, ${name}. Your confidential inquiry for ${preferredLocation} has been routed to the Senior Partner.`);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-luxury-950 carbon-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-900 border border-gold-400/30 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pan-India Showroom Footprint</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Connect with Our Atelier Partners
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Schedule an appointment at any of our premier Indian salons across Mumbai BKC, New Delhi Aerocity, Bengaluru UB City, Hyderabad Jubilee Hills, Chennai Boat Club Road, Coimbatore Race Course, Cochin Marine Drive, and Mangalore Kadri Hills—or arrange for our hydraulic enclosed transporters to deliver directly to your private estate.
          </p>

          {/* Region Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {[
              { id: "all", label: "All Indian Hubs (8)" },
              { id: "south", label: "South India Network (6)" },
              { id: "metro", label: "Metro Flagships (2)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedRegion === tab.id
                    ? 'bg-gold-400 text-luxury-950 shadow-glow-gold'
                    : 'bg-luxury-900/90 text-slate-400 hover:text-white border border-white/10 hover:border-gold-400/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Global Showrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAteliers.map((atelier, i) => (
            <motion.div
              key={atelier.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-6 border border-white/10 hover:border-gold-400/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-gold-400/15 text-gold-400 border border-gold-400/30">
                    {atelier.regionLabel}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                  {atelier.city}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {atelier.address}<br />
                  <span className="text-slate-400">{atelier.country}</span>
                </p>
              </div>
              
              <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gold-400 font-mono">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <a href={`tel:${atelier.phone.replace(/\s+/g, '')}`} className="hover:underline">
                    {atelier.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-slate-400 text-[11px] leading-snug">
                  <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span>{atelier.hours}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Form & Escrow Security Notice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10"
          >
            <h3 className="text-xl font-display font-bold text-white mb-1">
              Private Concierge Dispatch
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Transmitted under encrypted 256-bit protocol directly to the desk of the Managing Director.
            </p>

            {isSent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Discreet Inquiry Transmitted</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your communication has been registered. An Aureus Senior Concierge partner will reach out within two hours via your specified confidential channel.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-5 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Lord / Lady / Mr / Ms..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      Private Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@familyoffice.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      Direct Mobile / Signal (+91)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      Preferred Atelier / Hub
                    </label>
                    <select
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="Chennai Coastal Atelier (Boat Club Road / ECR)">Chennai Coastal Atelier (Boat Club Road / ECR)</option>
                      <option value="Coimbatore Motorsport Atelier (Race Course Road)">Coimbatore Motorsport Atelier (Race Course Road)</option>
                      <option value="Cochin Portside Atelier (Marine Drive, Kerala)">Cochin Portside Atelier (Marine Drive, Kerala)</option>
                      <option value="Mangalore Coastal Atelier (Kadri Hills, Karnataka)">Mangalore Coastal Atelier (Kadri Hills, Karnataka)</option>
                      <option value="Bengaluru Haute Atelier (UB City / Lavelle Road)">Bengaluru Haute Atelier (UB City / Lavelle Road)</option>
                      <option value="Hyderabad Private Salon (Jubilee Hills Road No. 36)">Hyderabad Private Salon (Jubilee Hills Road No. 36)</option>
                      <option value="Mumbai Flagship Atelier (One BKC)">Mumbai Flagship Atelier (One BKC)</option>
                      <option value="New Delhi Diplomatic Atelier (Aerocity)">New Delhi Diplomatic Atelier (Aerocity)</option>
                      <option value="Private Residence Enclosed Delivery (All India)">Private Residence Enclosed Delivery (All India)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                      Nature of Inquiry
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                    >
                      <option value="Acquisition Consultation">Vehicle Acquisition Consultation</option>
                      <option value="Allocation Slot Commissioning">Factory Allocation Slot Commissioning (Bespoke)</option>
                      <option value="Fleet Consignment & Asset Liquidation">Private Fleet Consignment & Asset Liquidation</option>
                      <option value="Track Program & Coaching">Track Program & Scuderia Coaching</option>
                      <option value="Private Estate Delivery">Private Estate Delivery Coordination</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    Specifications & Confidential Notes
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Specify desired models, chassis requirements, timeline, or transport preferences..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-luxury-900 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-[10px] text-slate-500">
                    * Strictly Non-Disclosure Governed. No marketing solicitation.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-500 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Confidential Dispatch</span>
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Right: Concierge Trust Protocol */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 space-y-4"
          >
            <div className="p-6 rounded-3xl bg-luxury-900/60 border border-gold-400/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Discretion Protocol</h4>
                  <p className="text-[11px] text-slate-400">Strict Client Anonymity</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                All client identities and transactions are governed under comprehensive Swiss banking-grade non-disclosure treaties. Vehicle registrations can be coordinated under offshore holding structures or family trusts upon request.
              </p>

              <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Encrypted Signal / Telegram Concierge lines</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>Escrow clearing with global tier-1 custodian banks</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-luxury-900/40 border border-white/10 text-center space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Direct Telephone Concierge</span>
              <p className="text-xl font-display font-bold text-white tracking-wider">+1 (800) 890-AUREUS</p>
              <p className="text-[10px] text-slate-500">24/7 International Dedicated Hotline</p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
