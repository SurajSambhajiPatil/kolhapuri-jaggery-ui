import { useState } from "react";

export default function ProcessSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative bg-[url('/images/process/sugarcane-crop.jpg')] bg-cover bg-center py-16">
      
      {/* BACKGROUND OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

        {/* VIDEO BLOCK */}
        <div className="relative">

          {/* ✅ SECTION LABEL — FIXED POSITION */}
          <div className="absolute -top-6 left-6 z-30">
            <span
              className="
                uppercase tracking-widest text-xs font-semibold
                text-green-300
                bg-black/70
                px-4 py-2
                rounded-lg
                backdrop-blur-sm
                border border-white/10
                shadow-md
              "
            >
              How We Make Jaggery
            </span>
          </div>

          {/* VIDEO CARD */}
          <div
            onClick={() => setOpen(true)}
            className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
          >
            <img
              src="/images/process/youtube-poster.png"
              className="w-full h-full object-cover"
              alt="Jaggery Process"
            />

            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            {/* PLAY ICON */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-green-400/80 transition">
                <svg
                  className="w-6 h-6 md:w-7 md:h-7 text-white ml-1"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 4l10 6-10 6V4z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="text-white bg-black/40 backdrop-blur rounded-3xl p-10">
          <h2 className="text-4xl font-extrabold mb-6">
            Clean & Hygienic <span className="text-green-300">Processing</span>
          </h2>

          <p className="text-lg text-gray-200 mb-6">
            Prepared in modern facilities while preserving traditional Kolhapuri techniques.
          </p>

          <ul className="space-y-2 text-lg">
            <li>✔ Organic sugarcane</li>
            <li>✔ No chemicals</li>
            <li>✔ Traditional method</li>
            <li>✔ Hygienic process</li>
          </ul>

          <div className="inline-flex items-center gap-3 bg-white/95 text-gray-900 px-5 py-3 rounded-xl shadow-lg mt-6">
            <img
              src="/images/hero/FinalLogo.png"
              alt="Trusted Kolhapuri Jaggery"
              className="h-9 w-9 object-contain"
            />
            <div className="leading-tight">
              <p className="font-semibold">Trusted KolhapuriJaggery</p>
              <p className="text-sm text-gray-600">100% Pure & Hygienic</p>
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
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-50 text-white text-xl"
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
