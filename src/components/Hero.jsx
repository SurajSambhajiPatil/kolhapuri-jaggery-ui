export default function Hero() {
  return (
    <section id="home"
      className="
        relative
        min-h-[80vh] md:min-h-[75vh]
        bg-[url('/images/hero/factory-background.png')]
        bg-cover
        bg-center
        bg-no-repeat
        flex
        items-center
      "
    >
      {/* Gradient overlay for readability */}
     <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 pointer-events-none"></div>


      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div className="text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Pure Kolhapuri <br />
            <span className="text-yellow-400 drop-shadow">
              Jaggery
            </span>
          </h1>

          <p className="mt-6 text-xl md:text-2xl max-w-xl text-gray-100">
            Hygienically prepared in modern facilities using traditional
            Kolhapuri techniques.
          </p>

          <p className="mt-3 text-lg text-gray-300">
            100% natural · No chemicals · No compromise
          </p>

          <div className="mt-10 flex gap-4 flex-wrap items-center">
            <button className="bg-leaf hover:bg-green-700 text-white px-9 py-4 rounded-xl text-lg font-semibold shadow-lg">
              Shop Now
            </button>

            <button className="border-2 border-white/80 text-white px-9 py-4 rounded-xl text-lg bg-black/20 hover:bg-white hover:text-black transition">
              Watch Process
            </button>
          </div>
        </div>

        {/* RIGHT BRAND VISUAL */}
        <div className="hidden md:flex justify-center">
          <div className="relative bg-white/90 rounded-2xl shadow-xl p-6">
            <img
              src="/images/hero/GUDORA-FinalLogoV1.png"
              alt="Kolhapuri Jaggery"
              className="max-w-[220px]"
            />

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-leaf/90 text-white px-4 py-1 rounded-full text-xs font-medium shadow">
              Trusted Since 1999
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
