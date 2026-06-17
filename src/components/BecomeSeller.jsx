import { useState } from "react";
import { ArrowRight, Store, TrendingUp, Users, Truck, Award, MessageSquare } from "lucide-react";
import SellerModal from "./SellerModal";

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "High Margins",
    desc: "25–35% retail margins with competitive wholesale pricing direct from source.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    desc: "Personal account manager, marketing materials and sales training included.",
  },
  {
    icon: Truck,
    title: "Reliable Supply",
    desc: "Consistent stock with direct farm-to-seller delivery across India.",
  },
  {
    icon: Award,
    title: "Certified Quality",
    desc: "FSSAI certified, lab-tested jaggery. Easy compliance, easy selling.",
  },
];

const STATS = [
  { value: "500+", label: "Active Partners" },
  { value: "50+",  label: "Cities Covered" },
  { value: "4.8★", label: "Partner Rating"  },
];

export default function BecomeSeller() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id="become-seller"
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", background: "#0d2818" }}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[440px] h-[440px] rounded-full bg-green-900/50 blur-[110px]" />
          <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-[#D9A441]/10 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

          {/* ── Header ── */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9A441]/40 bg-[#D9A441]/10 text-[#D9A441] text-[10px] font-black uppercase tracking-[0.25em] mb-5">
              <Store size={11} />
              Partner Program
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Grow Your Business<br />
              <span className="text-[#D9A441]">with Gudora Foods</span>
            </h2>
            <p className="text-white/55 font-medium max-w-xl mx-auto text-base leading-relaxed">
              Join our growing network of distributors, retailers and online sellers.
              Premium jaggery that practically sells itself.
            </p>
          </div>

          {/* ── Benefits grid ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div className="w-10 h-10 rounded-xl bg-green-800/80 flex items-center justify-center mb-4 border border-green-700/50">
                  <Icon size={17} className="text-green-300" />
                </div>
                <h3 className="text-sm font-black text-white mb-1.5">{title}</h3>
                <p className="text-xs text-white/45 font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── Stats + CTA ── */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-6 border-t border-white/10">

            {/* Stats */}
            <div className="flex items-center gap-8 sm:gap-12">
              {STATS.map((s, i) => (
                <div key={i} className={`text-center ${i < STATS.length - 1 ? "pr-8 sm:pr-12 border-r border-white/10" : ""}`}>
                  <p className="text-3xl font-black text-[#D9A441] tracking-tight">{s.value}</p>
                  <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#D9A441] hover:bg-[#c99030] text-white text-sm font-black transition-all shadow-xl shadow-[#D9A441]/20 active:scale-95"
              >
                Apply to be a Seller
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/919284626577?text=Hi%2C%20I%27m%20interested%20in%20becoming%20a%20Gudora%20Foods%20seller."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40 text-sm font-black transition-all active:scale-95"
              >
                <MessageSquare size={15} />
                WhatsApp Us
              </a>
            </div>
          </div>

        </div>
      </section>

      <SellerModal visible={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
