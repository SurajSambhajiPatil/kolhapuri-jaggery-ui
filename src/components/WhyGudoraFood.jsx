import { ShieldCheck, Leaf, FlaskConical, Droplets, Award, Search, CheckCircle2 } from "lucide-react";

export default function WhyGudoraFood() {
  const items = [
    { icon: <Leaf size={20} />, title: "100% Pure Kolhapuri Jaggery", desc: "Traditional methods, rich minerals" },
    { icon: <ShieldCheck size={20} />, title: "FSSAI Certified", desc: "Meets national safety standards" },
    { icon: <Search size={20} />, title: "25+ Quality Checks", desc: "Multi-stage lab testing" },
    { icon: <CheckCircle2 size={20} />, title: "Ethically Sourced", desc: "Direct farmer network" },
    { icon: <Droplets size={20} />, title: "Farm-to-Pack Traceability", desc: "Every batch tracked" },
    { icon: <FlaskConical size={20} />, title: "No Chemicals or Additives", desc: "Naturally processed" },
    { icon: <ShieldCheck size={20} />, title: "HACCP-Ready Hygiene", desc: "Modern hygienic facilities" },
    { icon: <Award size={20} />, title: "Freshness Sealed", desc: "Tamper-proof packaging" },
  ];

  return (
    <section
      id="benefits"
      className="scroll-mt-24 relative py-16 md:py-24 bg-white overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-50/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50/50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="text-[#1F6F43] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">The Gudora Promise</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6">
            Why Choose GUDORA FOOD
          </h2>
          <p className="text-base text-slate-500 font-medium leading-relaxed">
            Pure, safe, and ethically made jaggery trusted by thousands of families across the nation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, idx) => (
            <ValueItem key={idx} icon={it.icon} title={it.title} desc={it.desc} delay={idx * 100} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center reveal">
          <StatBadge label="10k+ Happy Customers" sub="Trusted nationwide" />
          <StatBadge label="50+ Retail Partners" sub="Available locally" />
          <StatBadge label="250+ Tests Verified" sub="Safety guaranteed" />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 reveal">
          {["FSSAI", "ISO 22000", "HACCP", "GMP", "Organic Certified"].map((label) => (
            <CertBadge key={label} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueItem({ icon, title, desc, delay }) {
  return (
    <div 
      className="group bg-slate-50/50 hover:bg-white rounded-[1.5rem] border border-slate-100 hover:border-green-100 p-6 transition-all duration-500 hover:shadow-xl hover:shadow-green-900/5 reveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-[#1F6F43] shadow-sm border border-slate-100 group-hover:bg-[#1F6F43] group-hover:text-white transition-all duration-500 mb-5">
        {icon}
      </div>
      <div>
        <h4 className="text-base font-black text-slate-900 mb-2 tracking-tight group-hover:text-green-900 transition-colors leading-tight">{title}</h4>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function StatBadge({ label, sub }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-lg font-black text-slate-900 tracking-tight mb-1">{label}</span>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sub}</span>
    </div>
  );
}

function CertBadge({ label }) {
  return (
    <div className="inline-flex items-center justify-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-slate-900 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:border-green-200 hover:text-green-700 transition-all cursor-default">
      {label}
    </div>
  );
}
