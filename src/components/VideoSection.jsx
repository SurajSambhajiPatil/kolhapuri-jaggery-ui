export default function VideoSection() {
  return (
    <section id="process" className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
        <div className="relative">
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/AMFrOVs3vO8?start=4"
              allowFullScreen
              title="How We Make Jaggery"
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#5A3214]">
            Inside Gudora Foods
          </h3>
          <p className="text-gray-700 mb-4">
            Get a glimpse of how we carefully craft every batch of Kolhapuri jaggery —
            from fresh sugarcane to the final golden blocks reaching your home.
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Fresh sugarcane sourced from trusted farmers</li>
            <li>Slow boiling in traditional pans for rich flavour</li>
            <li>No added chemicals, colours or preservatives</li>
            <li>Hygienic processing and careful packing</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
