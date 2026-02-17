import VideoSection from "../components/VideoSection";

export default function About() {
  return (
    <main className="bg-white">
      <section className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">About Gudora Foods</h1>
          <p className="mt-4 text-gray-700 max-w-3xl">
            Gudora Foods is dedicated to bringing authentic Kolhapuri jaggery to your home.
            We source premium sugarcane, follow traditional methods, and maintain modern hygiene
            standards to deliver pure, chemical-free sweetness.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="text-lg font-semibold text-green-800">100% Pure</div>
              <p className="text-gray-700 mt-2">No additives, no chemicals—just natural jaggery.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="text-lg font-semibold text-green-800">Traditional Process</div>
              <p className="text-gray-700 mt-2">Prepared using time-tested Kolhapuri techniques.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="text-lg font-semibold text-green-800">Quality Assured</div>
              <p className="text-gray-700 mt-2">Hygienic preparation with strict quality checks.</p>
            </div>
          </div>
        </div>
      </section>

      <VideoSection />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5A3214]">Our Promise</h2>
          <p className="mt-3 text-gray-700 max-w-3xl">
            We focus on purity, taste, and health. From sourcing to packaging, every step is designed
            to preserve the natural goodness of jaggery. Your trust drives us to keep improving.
          </p>
        </div>
      </section>
    </main>
  );
}
