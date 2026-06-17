import { FlaskConical, ShieldCheck, Leaf, Truck, Award } from "lucide-react";

const KPIs = [
  { icon: <FlaskConical size={28} />, label: "No Chemicals\nor Additives" },
  { icon: <ShieldCheck size={28} />, label: "FSSAI\nCertified" },
  { icon: <Leaf size={28} />, label: "100% Pure\nKolhapuri" },
  { icon: <Truck size={28} />, label: "Farm to\nYour Door" },
  { icon: <Award size={28} />, label: "Lab Tested\n& Verified" },
];

export default function WhyGudoraFood() {
  return (
    <section id="benefits" className="scroll-mt-24 py-14 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="text-green-700 font-black text-[10px] uppercase tracking-[0.3em] mb-3 block">
          The Gudora Promise
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-12">
          Why Choose Gudora Foods?
        </h2>

        <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12">
          {KPIs.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 w-24 md:w-28">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-slate-200 flex items-center justify-center text-[#1F6F43] hover:border-green-500 hover:bg-green-50 transition-all duration-200">
                {icon}
              </div>
              <p className="text-xs font-bold text-slate-700 leading-snug text-center whitespace-pre-line">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
