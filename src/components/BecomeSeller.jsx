import { useState } from "react";
import SellerModal from "./SellerModal";

export default function BecomeSeller() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* ================= BECOME SELLER SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-green-700 text-white rounded-3xl p-12 shadow-xl text-center">
          <h2 className="text-4xl font-extrabold mb-4">
            Become a Seller
          </h2>

          <p className="text-lg opacity-90 mb-10">
            Partner with Gudora Foods and reach health-conscious customers
            across India.
          </p>

          {/* STATS */}
          <div className="flex justify-center gap-10 mb-10 text-sm font-semibold">
            <span>500+ Farmers</span>
            <span>3+ Regions</span>
            <span>100% Transparent</span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-green-700 font-bold px-8 py-3 rounded-full"
            >
              Start via WhatsApp
            </a>

            {/* APPLY VIA FORM */}
            <button
              onClick={() => {
                console.log("Apply via Form clicked");
                setIsModalOpen(true);
              }}
              className="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-green-700 transition"
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
