import { useState } from "react";

export default function ProcessSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative bg-[url('/images/process/sugarcane-crop.jpg')] bg-cover bg-center py-16">
      
      {/* REFINED BACKGROUND OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT: VIDEO */}
        <div className="relative">

          {/* SECTION TAG */}
          <div className="absolute -top-6 left-6 z-30">
            <span className="
              uppercase tracking-widest text-xs font-semibold
              text-green-300 bg-black/70
              px-4 py-2 rounded-lg
              backdrop-blur border border-white/10
            ">
              How We Make Jaggery
            </span>
          </div>

          {/* VIDEO CARD */}
          <div
            onClick={() => setOpen(true)}
            className="
              relative aspect-video rounded-3xl overflow-hidden
              cursor-pointer group shadow-2xl
            "
          >
            <img
              src="/images/process/youtube-poster.png"
              alt="Jaggery Making Process"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-black/40" />

            {/* PLAY BUTTON */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="
                w-20 h-20 rounded-full
                bg-white/20 backdrop-blur
                flex items-center justify-center
                group-hover:bg-green-500/80
                transition
              ">
                <svg
                  className="w-7 h-7 text-white ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 4l10 6-10 6V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className="
          text-white rounded-3xl
          bg-white/10 backdrop-blur-xl
          p-10 border border-white/10
          shadow-2xl
        ">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Clean & Hygienic{" "}
            <span className="text-green-300">Processing</span>
          </h2>

          <p className="text-lg text-gray-200 mb-8">
            Prepared in modern facilities while preserving
            authentic Kolhapuri traditions.
          </p>

          {/* FEATURES */}
          <ul className="space-y-4 text-lg">
            <li className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              Organic sugarcane
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              No chemicals or additives
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              Traditional Kolhapuri method
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-400 text-xl">✓</span>
              Hygienic & quality-controlled process
            </li>
          </ul>

          {/* TRUST BADGE */}
          <div className="
            inline-flex items-center gap-4
            bg-white text-gray-900
            px-6 py-4 rounded-2xl
            shadow-xl mt-10
          ">
            <img
              src="/images/hero/GudoraFoods-FinalLogo.png"
              alt="Trusted Kolhapuri Jaggery"
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="font-semibold leading-tight">
                Trusted Kolhapuri Jaggery
              </p>
              <p className="text-sm text-gray-600">
                100% Pure & Hygienic
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-white text-2xl z-50"
            >
              ✕
            </button>

            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/AMFrOVs3vO8?autoplay=1&mute=1&rel=0"
              title="How We Make Jaggery"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
