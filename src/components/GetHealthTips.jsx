export default function GetHealthTips() {
  return (
    <section className="relative py-14 bg-[#FBF7F2]">
      {/* soft separator from above section */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5A3214]/15 to-transparent" />

      {/* subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[220px] bg-green-200/30 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            border border-black/5
            px-8 py-10 md:px-12
            text-center
          "
        >
          {/* Heading */}
          <h3 className="text-2xl md:text-3xl font-bold text-[#2A1A0A] mb-3">
            Get Health Tips & Offers
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-base">
            Jaggery health benefits, traditional recipes, and exclusive Gudora
            offers — delivered occasionally, never spam.
          </p>

          {/* Input */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="
                w-full sm:w-80
                px-5 py-3.5
                rounded-xl
                border border-gray-300
                focus:outline-none
                focus:ring-2 focus:ring-green-600
                text-gray-800
              "
            />

            <button
              type="submit"
              className="
                bg-green-700
                hover:bg-green-800
                text-white
                px-7 py-3.5
                rounded-xl
                font-semibold
                shadow
                transition
                whitespace-nowrap
              "
            >
              Subscribe
            </button>
          </form>

          {/* Trust note */}
          <p className="mt-4 text-xs text-gray-500">
            No spam • Unsubscribe anytime • 100% natural goodness 🌿
          </p>
        </div>
      </div>
    </section>
  );
}
