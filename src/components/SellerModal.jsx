import { useEffect, useState, useRef } from "react";
import productsList from "../data/products";

export default function SellerModal({ visible, onClose }) {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (visible) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  useEffect(() => {
    if (!visible) {
      setBusinessName(""); setOwnerName(""); setEmail(""); setMobile(""); setAddress(""); setGst(""); setSelectedProducts([]); setProductQuery(""); setMessage("");
    }
    // always hide suggestions when modal visibility changes
    setIsSuggestionsVisible(false);
  }, [visible]);

  // hide suggestions when clicking outside
  useEffect(() => {
    function onDocDown(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setIsSuggestionsVisible(false);
      }
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (!businessName) return setMessage("Please provide your business/shop name.");
    if (!ownerName) return setMessage("Please provide owner name.");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setMessage("Please provide a valid email.");
    if (!mobile || mobile.replace(/\D/g, '').length < 10) return setMessage("Please provide a valid mobile number.");
    if (selectedProducts.length === 0) return setMessage("Please select at least one product or category.");

    // Simulate submit (you can replace with API call)
    setMessage("Application submitted. We'll contact you soon (simulated).");
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-xl">
        <div className="flex">
          <div className="w-1/3 hidden md:flex items-center justify-center bg-green-700">
            <div className="p-6 text-center text-white">
              <h4 className="text-lg font-bold mb-2">Start Selling with Us</h4>
              <p className="text-sm">Reach thousands of customers. Fast onboarding.</p>
            </div>
          </div>

          <div className="w-full md:w-2/3 p-6">
            <div className="flex justify-end">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">Seller Application</h3>
            <p className="text-sm text-gray-600 mb-4">Tell us about your business and we'll get back to you.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">Business / Shop Name</label>
                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
              </div>

              <div>
                <label className="text-sm text-gray-700">Owner / Contact Person</label>
                <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Mobile</label>
                  <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9+]/g, ''))} className="mt-1 w-full rounded border px-3 py-2" required />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">GSTIN (optional)</label>
                  <input value={gst} onChange={(e) => setGst(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                </div>
                <div className="relative" ref={wrapperRef}>
                  <label className="text-sm text-gray-700">Products / Categories</label>

                  <div className="mt-1 w-full rounded border px-3 py-2 bg-white">
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((p) => (
                        <span key={p} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
                          {p}
                          <button type="button" onClick={() => setSelectedProducts(prev => prev.filter(x => x !== p))} className="text-gray-500 hover:text-gray-800">✕</button>
                        </span>
                      ))}

                      <input
                        ref={inputRef}
                        value={productQuery}
                        onChange={(e) => { setProductQuery(e.target.value); setIsSuggestionsVisible(true); }}
                        onFocus={() => setIsSuggestionsVisible(true)}
                        placeholder={selectedProducts.length ? "" : "e.g. Jaggery Blocks, Powder"}
                        className="flex-1 min-w-[120px] outline-none"
                      />
                    </div>
                  </div>
                  {/* suggestions: show when focused or when typing; show all when query empty */}
                  {isSuggestionsVisible && (
                    <ul ref={suggestionsRef} className="absolute left-0 right-0 mt-1 bg-white border rounded shadow max-h-40 overflow-auto z-60" role="listbox" aria-label="Product suggestions">
                      {productsList
                        .filter(p => !selectedProducts.includes(p.name))
                        .filter(p => productQuery ? p.name.toLowerCase().includes(productQuery.toLowerCase()) : true)
                        .map((p) => (
                          <li key={p.id}>
                            <button type="button" className="w-full text-left px-3 py-2 hover:bg-gray-100" onMouseDown={(ev) => { ev.preventDefault(); setSelectedProducts(prev => [...prev, p.name]); setProductQuery(""); setIsSuggestionsVisible(false); inputRef.current && inputRef.current.focus(); }}>
                              {p.name}
                            </button>
                          </li>
                        ))}
                      {productsList.filter(p => !selectedProducts.includes(p.name)).filter(p => productQuery ? p.name.toLowerCase().includes(productQuery.toLowerCase()) : true).length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-500">No matches</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {message && <div className="text-sm text-green-600">{message}</div>}

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full py-2">Submit Application</button>
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-full bg-gray-100">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
