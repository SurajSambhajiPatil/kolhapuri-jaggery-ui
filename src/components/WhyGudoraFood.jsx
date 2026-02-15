export default function WhyGudoraFood() {
  const items = [
    { icon: "🌿", title: "100% Pure Kolhapuri Jaggery", desc: "Traditional methods, rich minerals" },
    { icon: "✅", title: "FSSAI Certified", desc: "Meets national safety standards" },
    { icon: "🧪", title: "25+ Quality Checks", desc: "Multi-stage lab testing" },
    { icon: "🤝", title: "Ethically Sourced", desc: "Direct farmer network" },
    { icon: "🔍", title: "Farm-to-Pack Traceability", desc: "Every batch tracked" },
    { icon: "🚫", title: "No Chemicals or Additives", desc: "Naturally processed" },
    { icon: "🛡️", title: "HACCP-Ready Hygiene", desc: "Modern hygienic facilities" },
    { icon: "📦", title: "Freshness Sealed", desc: "Tamper-proof packaging" },
    { icon: "🌍", title: "Global Standards", desc: "250 testing parameters" },
    { icon: "❤️", title: "Loved by Families", desc: "10k+ loyal customers" },
  ];

  return (
    <section
      id="why-jaggery"
      className="
        scroll-mt-24
        relative
        py-16
        bg-green-50
        border-t border-green-100
      "
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-[#5A3214] rounded-full" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#5A3214] tracking-tight">
            Why Choose GUDORA FOOD
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#5A3214]/80">
            Pure, safe, and ethically made jaggery trusted by families and chefs
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {items.map((it, idx) => (
            <ValueItem key={idx} icon={it.icon} title={it.title} desc={it.desc} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <StatBadge label="10k+ Happy Customers" />
          <StatBadge label="50+ Retail Partners" />
          <StatBadge label="250+ Tests Verified" />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CertBadge label="FSSAI" />
          <CertBadge label="ISO 22000" />
          <CertBadge label="HACCP" />
          <CertBadge label="GMP" />
        </div>
      </div>
    </section>
  );
}

function ValueItem({ icon, title, desc }) {
  return (
    <div className="group bg-white rounded-2xl border border-[#5A3214]/10 shadow-sm hover:shadow-md transition p-5 flex items-start gap-4">
      <div className="h-12 w-12 rounded-xl border border-[#5A3214]/30 bg-white flex items-center justify-center text-2xl shadow-sm group-hover:-translate-y-0.5 transition">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#5A3214]">{title}</p>
        <p className="text-sm text-[#5A3214]/70 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function StatBadge({ label }) {
  return (
    <div className="inline-flex items-center justify-center bg-white px-4 py-3 rounded-xl border border-[#5A3214]/10 shadow-sm text-[#5A3214] font-semibold">
      {label}
    </div>
  );
}

function CertBadge({ label }) {
  return (
    <div className="inline-flex items-center justify-center bg-white px-3 py-2 rounded-lg border border-[#5A3214]/15 text-[#5A3214] text-sm font-semibold">
      {label}
    </div>
  );
}
