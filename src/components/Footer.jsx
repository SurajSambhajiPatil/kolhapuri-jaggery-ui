import { Facebook, Instagram, Twitter, Mail, Phone, Globe, ArrowRight } from "lucide-react";

export default function Footer() {
  const goHomeAndScroll = (id) => {
    localStorage.setItem("scrollTarget", id);
    if (window.location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <footer className="relative bg-[#1a1a1a] text-stone-400 pt-16 sm:pt-24 pb-12 overflow-hidden">
      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-900/10 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* TOP SECTION: NEWSLETTER */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center pb-16 sm:pb-20 border-b border-white/5 mb-16 sm:mb-20">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter mb-4 leading-tight">
              Join the Organic Revolution
            </h3>
            <p className="text-stone-500 font-medium text-sm sm:text-base">
              Subscribe to get health tips, traditional recipes, and exclusive offers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-green-500 transition-colors min-h-[3.5rem]"
              aria-label="Email address for newsletter"
            />
            <button className="bg-[#1F6F43] hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 min-h-[3.5rem] whitespace-nowrap">
              Join <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-12 sm:gap-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
            <img src="/images/hero/LogoV1.png" className="h-10 sm:h-12 brightness-0 invert mx-auto sm:mx-0 cursor-pointer" alt="Gudora Foods" onClick={() => goHomeAndScroll("hero")} />
            <p className="text-xs sm:text-sm leading-relaxed font-medium max-w-xs mx-auto sm:mx-0">
              Pure Kolhapuri jaggery crafted with passion, preserving centuries of tradition while meeting modern health standards.
            </p>
            <div className="flex justify-center sm:justify-start gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#1F6F43] hover:text-white transition-all" aria-label={`Follow us on ${Icon.name}`}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6 sm:mb-8">Shop & Explore</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm font-bold">
              {[
                { label: "All Products", id: "products" },
                { label: "Benefits", id: "benefits" },
                { label: "Partner", id: "become-seller" }
              ].map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => goHomeAndScroll(link.id)}
                    className="hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2 group w-full text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-900 group-hover:bg-green-500 transition-colors hidden sm:block" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6 sm:mb-8">Customer Support</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm font-bold">
              {[
                { label: "Track Order", url: "/orders" },
                { label: "About Us", url: "/about" },
                { label: "Privacy Policy", url: "#" },
                { label: "Terms of Service", url: "#" }
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.url} className="hover:text-white transition-colors flex items-center justify-center sm:justify-start gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-stone-500 transition-colors hidden sm:block" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="text-center sm:text-left">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6 sm:mb-8">Get In Touch</h4>
            <ul className="space-y-6">
              {[
                { icon: Phone, label: "Call Us", val: "+91 77568 65004" },
                { icon: Mail, label: "Email Us", val: "care@gudorafoods.com" },
                { icon: Globe, label: "Website", val: "www.gudorafoods.com" }
              ].map((item, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-green-500 shrink-0 group-hover:bg-[#1F6F43] group-hover:text-white transition-all">
                    <item.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-600 mb-0.5">{item.label}</p>
                    <p className="text-white font-bold text-sm sm:text-base break-all">{item.val}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest leading-relaxed">
            © 2026 GUDORAFOODS. Crafted for a Healthier Life.
          </p>
          <div className="flex gap-6 sm:gap-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
