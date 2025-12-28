export default function VideoSection() {
  return (
    <section id="process" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-6">
        <iframe
          className="w-full h-64 rounded"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          allowFullScreen
          title="How We Make Jaggery"
        />

        <div>
          <h3 className="text-2xl font-bold mb-4">How We Make Jaggery</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Organic sugarcane</li>
            <li>No chemicals</li>
            <li>Traditional Kolhapuri method</li>
            <li>Hygienic process</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
