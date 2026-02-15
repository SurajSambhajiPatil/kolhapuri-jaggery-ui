import { useState } from "react";
import SellerModal from "./SellerModal";

export default function BecomeSeller() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* ================= BECOME SELLER SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100 rounded-3xl p-12 shadow-xl text-center border border-green-200">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-4">
            Become a Seller
          </h2>

          <p className="text-base md:text-lg text-gray-700 mb-10">
            Partner with Gudora Foods and reach health-conscious customers
            across India.
          </p>

          {/* STATS */}
          <div className="flex justify-center gap-3 sm:gap-6 mb-10 text-sm font-semibold flex-wrap">
            <span className="inline-flex items-center gap-2 bg-white text-green-800 px-4 py-2 rounded-xl border border-green-200">500+ Farmers</span>
            <span className="inline-flex items-center gap-2 bg-white text-green-800 px-4 py-2 rounded-xl border border-green-200">3+ Regions</span>
            <span className="inline-flex items-center gap-2 bg-white text-green-800 px-4 py-2 rounded-xl border border-green-200">100% Transparent</span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-xl shadow-sm"
            >
              Start via WhatsApp
            </a>

            {/* APPLY VIA FORM */}
            <button
              onClick={() => {
                console.log("Apply via Form clicked");
                setIsModalOpen(true);
              }}
              className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-700 hover:text-white transition shadow-sm"
            >
              Apply via Form
            </button>
          </div>
        </div>
      </div>

      {/* ================= SELLER MODAL ================= */}
      <SellerModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log("Seller application submitted:", data);
        }}
      />
    </>
  );
}
