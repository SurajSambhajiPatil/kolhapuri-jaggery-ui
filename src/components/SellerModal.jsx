import { useEffect, useState, useRef } from "react";
import productsList from "../data/products";

export default function SellerModal({ visible, onClose }) {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [channel, setChannel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [errorField, setErrorField] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (visible) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  useEffect(() => {
    if (!visible) {
      setBusinessName(""); setOwnerName(""); setEmail(""); setMobile(""); setAddress(""); setGst(""); setWebsite(""); setCity(""); setState(""); setPincode(""); setBusinessType(""); setChannel(""); setCapacity(""); setNotes(""); setSelectedProducts([]); setProductQuery(""); setMessage("");
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
    setIsSuccess(false);
    setErrorField("");
    if (!businessName) { setErrorField("businessName"); return setMessage("Please provide your business/shop name."); }
    if (!ownerName) { setErrorField("ownerName"); return setMessage("Please provide owner name."); }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErrorField("email"); return setMessage("Please provide a valid email."); }
    if (!mobile || mobile.replace(/\D/g, '').length < 10) { setErrorField("mobile"); return setMessage("Please provide a valid mobile number."); }
    if (!city) { setErrorField("city"); return setMessage("Please provide city."); }
    if (!state) { setErrorField("state"); return setMessage("Please provide state."); }
    if (!pincode || pincode.replace(/\D/g, '').length < 6) { setErrorField("pincode"); return setMessage("Please provide a valid pincode."); }
    if (!businessType) { setErrorField("businessType"); return setMessage("Please select business type."); }
    if (!channel) { setErrorField("channel"); return setMessage("Please select preferred channel."); }
    if (!capacity) { setErrorField("capacity"); return setMessage("Please select monthly capacity."); }
    if (selectedProducts.length === 0) { setErrorField("products"); return setMessage("Please select at least one product or category."); }

    // Simulate submit (you can replace with API call)
    setIsSuccess(true);
    setMessage("Application submitted. We'll contact you soon (simulated).");
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="modal-overlay" onClick={onClose} />

      <div className="relative w-full max-w-3xl mx-4 modal-card">
        <div className="flex">
          <div className="w-1/3 hidden md:flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-l-2xl">
            <div className="p-6 text-center">
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
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12l9 4 9-4" stroke="currentColor" strokeWidth="1.5"/><path d="M3 17l9 4 9-4" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </span>
                  <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={`input pl-10 ${errorField==='businessName' ? 'border-red-500 ring-2 ring-red-500' : 'mt-0'}`} required />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Owner / Contact Person</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </span>
                  <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={`input pl-10 ${errorField==='ownerName' ? 'border-red-500 ring-2 ring-red-500' : 'mt-0'}`} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5"/><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5"/></svg>
                    </span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`input pl-10 ${errorField==='email' ? 'border-red-500 ring-2 ring-red-500' : 'mt-0'}`} required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-700">Mobile</label>
                  <div className={`mt-1 flex items-center rounded-lg border ${errorField==='mobile' ? 'border-red-500 ring-2 ring-red-500' : 'border-gray-300 focus-within:ring-2 focus-within:ring-green-500'}`}>
                    <span className="px-3 text-gray-600 select-none">+91</span>
                    <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} className="flex-1 px-4 py-3 outline-none rounded-r-lg" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700">Address</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 7-7 13-7-13 7-7z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </span>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className={`input pl-10 ${errorField==='address' ? 'border-red-500 ring-2 ring-red-500' : 'mt-0'}`} />
                </div>
                <p className="mt-1 text-xs text-gray-500">Include area, landmark and district.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-700">GSTIN (optional)</label>
                  <input value={gst} onChange={(e) => setGst(e.target.value)} className="mt-1 input" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Website (optional)</label>
                  <input value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 input" placeholder="https://" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Business Type</label>
                  <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={`mt-1 input ${errorField==='businessType' ? 'border-red-500 ring-2 ring-red-500' : ''}`}>
                    <option value="">Select</option>
                    <option value="retail">Retail Store</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="online">Online Seller</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-gray-700">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className={`mt-1 input ${errorField==='city' ? 'border-red-500 ring-2 ring-red-500' : ''}`} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">State</label>
                  <input value={state} onChange={(e) => setState(e.target.value)} className={`mt-1 input ${errorField==='state' ? 'border-red-500 ring-2 ring-red-500' : ''}`} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Pincode</label>
                  <input value={pincode} onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))} className={`mt-1 input ${errorField==='pincode' ? 'border-red-500 ring-2 ring-red-500' : ''}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Preferred Channel</label>
                  <select value={channel} onChange={(e) => setChannel(e.target.value)} className={`mt-1 input ${errorField==='channel' ? 'border-red-500 ring-2 ring-red-500' : ''}`}>
                    <option value="">Select</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700">Monthly Capacity</label>
                  <select value={capacity} onChange={(e) => setCapacity(e.target.value)} className={`mt-1 input ${errorField==='capacity' ? 'border-red-500 ring-2 ring-red-500' : ''}`}>
                    <option value="">Select</option>
                    <option value="small">Up to 50 units</option>
                    <option value="medium">50–200 units</option>
                    <option value="large">200+ units</option>
                  </select>
                </div>
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
                    <ul ref={suggestionsRef} className={`absolute left-0 right-0 mt-1 bg-white border rounded-2xl shadow-xl ring-1 ring-black/5 max-h-40 overflow-auto z-60 ${errorField==='products' ? 'border-red-500' : ''}`} role="listbox" aria-label="Product suggestions">
                      {productsList
                        .filter(p => !selectedProducts.includes(p.name))
                        .filter(p => productQuery ? p.name.toLowerCase().includes(productQuery.toLowerCase()) : true)
                        .map((p) => (
                          <li key={p.id}>
                            <button type="button" className="w-full text-left px-3 py-2 hover:bg-green-50" onMouseDown={(ev) => { ev.preventDefault(); setSelectedProducts(prev => [...prev, p.name]); setProductQuery(""); setIsSuggestionsVisible(false); inputRef.current && inputRef.current.focus(); }}>
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

              <div>
                <label className="text-sm text-gray-700">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 input h-24" placeholder="Share any details or requirements" />
              </div>

              {message && (
                <div className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
              )}

              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn-primary">Submit Application</button>
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 border">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
