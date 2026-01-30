export default function WhyGudoraFood() {
  return (
<section
  id="why-jaggery"
  className="
    scroll-mt-24   /* 🔥 THIS IS THE FIX */
    relative
    py-20
    bg-[#FBF7F3]
    border-t border-[#5A3214]/10
  "
>
      {/* TOP ACCENT LINE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-[#5A3214] rounded-full" />

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}
        <h2
          className="
            text-center
            text-3xl md:text-4xl
            font-semibold
            text-[#5A3214]
            mb-14
            tracking-tight
          "
        >
          Why Choose GUDORA FOOD
        </h2>

        {/* VALUE PROPS */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-5
            gap-x-10 gap-y-14
            text-center
          "
        >
          <ValueItem
            icon="🌱"
            label="Sustainable Farming Techniques"
          />

          <ValueItem
            icon="🚫🧪"
            label="Chemical Pesticide-Free"
          />

          <ValueItem
            icon="🧬🚫"
            label="Non-GMO Produce"
          />

          <ValueItem
            icon="🍃"
            label="Locally & Ethically Sourced"
          />

          <ValueItem
            icon="🌍"
            label="250 Global Testing Standards"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- VALUE ITEM ---------------- */

function ValueItem({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div
        className="
          h-20 w-20
          rounded-full
          border border-[#5A3214]/40
          bg-white
          flex items-center justify-center
          text-3xl
          shadow-sm
          transition-all duration-300
          group-hover:shadow-md
          group-hover:-translate-y-1
        "
      >
        {icon}
      </div>

      <p
        className="
          text-sm
          font-medium
          text-[#5A3214]
          max-w-[170px]
          leading-snug
        "
      >
        {label}
      </p>
    </div>
  );
}
