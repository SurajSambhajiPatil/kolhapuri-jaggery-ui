export default function BecomeSeller() {
  return (
    <section className="relative py-14 md:py-16 text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800 opacity-95" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl p-8 md:p-10 text-center">
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Become a Seller
          </h2>

          {/* Sub text */}
          <p className="text-base md:text-lg text-green-50 max-w-3xl mx-auto mb-6">
            Are you a farmer, manufacturer, or distributor?
            Partner with <span className="font-semibold">KolhapuriJaggery</span> and
            reach thousands of health-conscious customers across India.
          </p>

          {/* Key points */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8 text-left">
            <div className="flex gap-3">
              <span className="text-xl">🌱</span>
              <p>Fair pricing & transparent partnership</p>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🚚</span>
              <p>Distribution & logistics support</p>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">📈</span>
              <p>Grow your brand with us</p>
            </div>
          </div>

          <p className="text-sm text-green-100 mb-6">
            ✔ Transparent payments &nbsp; • &nbsp; ✔ Dedicated support &nbsp; • &nbsp; ✔ Pan-India reach
          </p>

          {/* CTA */}
          <button
            type="button"
            aria-label="Apply to become a seller"
            className="bg-white text-green-700 font-semibold px-7 py-3 rounded-xl shadow-lg hover:scale-105 transition"
          >
            Start Selling with Us
          </button>

          <p className="mt-4 text-xs text-green-100">
            Trusted by farmers & distributors across Maharashtra
          </p>

        </div>
      </div>
    </section>
  );
}
