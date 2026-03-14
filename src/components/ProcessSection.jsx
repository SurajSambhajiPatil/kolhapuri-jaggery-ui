import { Leaf, ArrowRight, Sprout, Wind, Coffee } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      id: 1,
      title: "Natural Farm",
      desc: "Sugarcane grown in the fertile soils of Kolhapur using organic farming practices.",
      icon: <Sprout size={32} />,
      color: "bg-green-50 text-[#1F6F43]"
    },
    {
      id: 2,
      title: "Premium Harvest",
      desc: "Only the finest sugarcane is selected at the peak of maturity for maximum sweetness.",
      icon: <Wind size={32} />,
      color: "bg-amber-50 text-[#D9A441]"
    },
    {
      id: 3,
      title: "Traditional Method",
      desc: "Slow-cooked in open pans by master artisans using centuries-old techniques.",
      icon: <Coffee size={32} />,
      color: "bg-stone-50 text-stone-700"
    },
    {
      id: 4,
      title: "Pure Jaggery",
      desc: "100% chemical-free natural jaggery, rich in minerals and authentic flavor.",
      icon: <Leaf size={32} />,
      color: "bg-green-50 text-[#1F6F43]"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white" id="process">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20 reveal">
          <span className="text-[#1F6F43] font-black text-xs uppercase tracking-[0.3em] mb-4 block">The Journey</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6">
            From Farm to Your Table
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            We preserve the traditional Kolhapuri heritage in every block of jaggery we produce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* CONNECTOR LINE */}
          <div className="hidden lg:block absolute top-1/4 left-0 w-full h-0.5 bg-stone-100 -z-0" />

          {steps.map((step, idx) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group reveal" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className={`w-24 h-24 rounded-[2.5rem] ${step.color} flex items-center justify-center mb-8 shadow-xl shadow-stone-200/50 group-hover:-translate-y-2 transition-all duration-500 border border-white`}>
                {step.icon}
              </div>
              
              <div className="relative">
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-6xl font-black text-stone-50 opacity-[0.05]">
                  0{step.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="lg:hidden w-0.5 h-12 bg-stone-100 my-8" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-24 text-center reveal">
          <button className="btn-premium-primary group">
            Learn More About Our Process
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
