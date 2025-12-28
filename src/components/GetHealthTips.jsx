export default function GetHealthTips() {
  return (
    <section className="relative py-20 bg-white">
      {/* subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="
          bg-white
          rounded-3xl
          shadow-xl
          border border-black/5
          p-10 md:p-14
          text-center
        ">
          {/* Heading */}
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Get Health Tips & Offers
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            Weekly health tips, jaggery benefits, recipes, and exclusive
            KolhapuriJaggery offers — straight to your inbox.
          </p>

          {/* Input */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="
                w-full sm:w-96
                px-5 py-4
                rounded-xl
                border border-gray-300
                focus:outline-none
                focus:ring-2 focus:ring-green-500
                text-gray-800
              "
            />

            <button
              type="submit"
              className="
                bg-leaf
                hover:bg-green-700
                text-white
                px-8 py-4
                rounded-xl
                font-semibold
                shadow-lg
                transition
                whitespace-nowrap
              "
            >
              Subscribe
            </button>
          </form>

          {/* Trust note */}
          <p className="mt-6 text-sm text-gray-500">
            No spam. Unsubscribe anytime. 100% natural goodness 🌿
          </p>
        </div>
      </div>
    </section>
  );
}
