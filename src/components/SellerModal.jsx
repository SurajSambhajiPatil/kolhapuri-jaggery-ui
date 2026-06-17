import { useEffect, useState, useRef } from "react";
import {
  X, Building2, User, Mail, Phone, MapPin, Package,
  FileText, Loader2, CheckCircle2, ChevronDown, Store,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import productsList from "../data/products";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli",
  "Daman and Diu","Delhi","Lakshadweep","Puducherry",
];

const EMPTY = {
  businessName: "", businessType: "", gstin: "", website: "",
  ownerName: "", email: "", mobile: "",
  address: "", city: "", state: "", pincode: "",
  channel: "", capacity: "", message: "",
};

/* ── Reusable field wrapper ── */
function FieldLabel({ label, required }) {
  return (
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function inputCls(err) {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-slate-900 bg-slate-50 placeholder:text-slate-300 focus:outline-none focus:bg-white transition-all ${
    err ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-green-500"
  }`;
}

/* ── Section heading inside the form ── */
function SectionHead({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
        <Icon size={12} className="text-green-700" />
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

export default function SellerModal({ visible, onClose }) {
  const [form, setForm]               = useState(EMPTY);
  const [errors, setErrors]           = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [done, setDone]               = useState(false);
  const overlayRef                    = useRef(null);
  const productWrapRef                = useRef(null);
  const productInputRef               = useRef(null);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => ({ ...er, [k]: "" }));
  };

  /* ── Escape key ── */
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    if (visible) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [visible, onClose]);

  /* ── Reset on close ── */
  useEffect(() => {
    if (!visible) {
      setForm(EMPTY);
      setErrors({});
      setSelectedProducts([]);
      setProductQuery("");
      setShowSuggestions(false);
      setSaving(false);
      setDone(false);
    }
  }, [visible]);

  /* ── Close suggestions on outside click ── */
  useEffect(() => {
    const fn = (e) => {
      if (productWrapRef.current && !productWrapRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ── Validate ── */
  const validate = () => {
    const e = {};
    if (!form.businessName.trim())                                e.businessName = "Required";
    if (!form.businessType)                                       e.businessType = "Required";
    if (!form.ownerName.trim())                                   e.ownerName    = "Required";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Valid email required";
    if (form.mobile.replace(/\D/g, "").length < 10)              e.mobile       = "10-digit number required";
    if (!form.city.trim())                                        e.city         = "Required";
    if (!form.state)                                              e.state        = "Required";
    if (form.pincode.replace(/\D/g, "").length < 6)              e.pincode      = "6-digit pincode required";
    if (!form.channel)                                            e.channel      = "Required";
    if (!form.capacity)                                           e.capacity     = "Required";
    if (selectedProducts.length === 0)                            e.products     = "Select at least one product";
    return e;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    const { error } = await supabase.from("seller_applications").insert({
      business_name:     form.businessName.trim(),
      business_type:     form.businessType,
      gstin:             form.gstin.trim() || null,
      website:           form.website.trim() || null,
      owner_name:        form.ownerName.trim(),
      email:             form.email.trim().toLowerCase(),
      mobile:            form.mobile.replace(/\D/g, "").slice(-10),
      address:           form.address.trim() || null,
      city:              form.city.trim(),
      state:             form.state,
      pincode:           form.pincode.trim(),
      preferred_channel: form.channel,
      monthly_capacity:  form.capacity,
      products_interest: selectedProducts,
      message:           form.message.trim() || null,
    });
    setSaving(false);

    if (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
      return;
    }

    setDone(true);
    setTimeout(onClose, 3000);
  };

  /* ── Product suggestion helpers ── */
  const availableProducts = productsList
    .filter(p => !selectedProducts.includes(p.name))
    .filter(p => productQuery
      ? p.name.toLowerCase().includes(productQuery.toLowerCase())
      : true
    );

  const addProduct = (name) => {
    setSelectedProducts(prev => [...prev, name]);
    setProductQuery("");
    setShowSuggestions(false);
    productInputRef.current?.focus();
  };

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[600] flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm"
      style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="shrink-0 bg-gradient-to-r from-[#0d2818] to-[#1F6F43] px-6 pt-7 pb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #D9A441 0%, transparent 60%)" }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
          >
            <X size={15} />
          </button>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Store size={20} className="text-[#D9A441]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Seller Application</h2>
              <p className="text-sm text-white/60 font-medium mt-0.5">Tell us about your business and we'll reach out.</p>
            </div>
          </div>
        </div>

        {/* ── Success screen ── */}
        {done ? (
          <div className="flex flex-col items-center justify-center px-8 py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 size={30} className="text-green-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Application Submitted!</h3>
            <p className="text-sm text-slate-500 font-medium max-w-xs">
              Our team will review your application and contact you within 2 business days.
            </p>
          </div>
        ) : (

          /* ── Form ── */
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

            {/* Business Info */}
            <SectionHead icon={Building2} label="Business Information" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel label="Business / Shop Name" required />
                <input
                  value={form.businessName}
                  onChange={set("businessName")}
                  placeholder="Patil Traders"
                  className={inputCls(errors.businessName)}
                />
                {errors.businessName && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.businessName}</p>}
              </div>
              <div>
                <FieldLabel label="Business Type" required />
                <div className="relative">
                  <select
                    value={form.businessType}
                    onChange={set("businessType")}
                    className={inputCls(errors.businessType) + " appearance-none pr-9"}
                  >
                    <option value="">Select type</option>
                    <option value="retail">Retail Store</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="online">Online Seller</option>
                    <option value="distributor">Distributor</option>
                    <option value="supermarket">Supermarket / Chain</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.businessType && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.businessType}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel label="GSTIN" />
                <input
                  value={form.gstin}
                  onChange={set("gstin")}
                  placeholder="22AAAAA0000A1Z5 (optional)"
                  className={inputCls(false)}
                />
              </div>
              <div>
                <FieldLabel label="Website" />
                <input
                  value={form.website}
                  onChange={set("website")}
                  placeholder="https://yourstore.com (optional)"
                  className={inputCls(false)}
                />
              </div>
            </div>

            {/* Contact Info */}
            <SectionHead icon={User} label="Contact Details" />

            <div>
              <FieldLabel label="Owner / Contact Person" required />
              <input
                value={form.ownerName}
                onChange={set("ownerName")}
                placeholder="Suraj Patil"
                className={inputCls(errors.ownerName)}
              />
              {errors.ownerName && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.ownerName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel label="Email Address" required />
                <div className="relative">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className={inputCls(errors.email) + " pl-9"}
                  />
                </div>
                {errors.email && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.email}</p>}
              </div>
              <div>
                <FieldLabel label="Mobile Number" required />
                <div className={`flex items-center rounded-xl border overflow-hidden transition-all ${
                  errors.mobile ? "border-red-400" : "border-slate-200 focus-within:border-green-500"
                } bg-slate-50 focus-within:bg-white`}>
                  <span className="px-3 text-sm font-black text-slate-500 border-r border-slate-200 select-none py-2.5">+91</span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => {
                      setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }));
                      if (errors.mobile) setErrors(er => ({ ...er, mobile: "" }));
                    }}
                    placeholder="98765 43210"
                    className="flex-1 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none bg-transparent"
                  />
                </div>
                {errors.mobile && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.mobile}</p>}
              </div>
            </div>

            {/* Location */}
            <SectionHead icon={MapPin} label="Location" />

            <div>
              <FieldLabel label="Full Address" />
              <input
                value={form.address}
                onChange={set("address")}
                placeholder="Shop No., Building, Area, Landmark (optional)"
                className={inputCls(false)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <FieldLabel label="City" required />
                <input
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Kolhapur"
                  className={inputCls(errors.city)}
                />
                {errors.city && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.city}</p>}
              </div>
              <div>
                <FieldLabel label="State" required />
                <div className="relative">
                  <select
                    value={form.state}
                    onChange={set("state")}
                    className={inputCls(errors.state) + " appearance-none pr-9"}
                  >
                    <option value="">Select</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.state && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.state}</p>}
              </div>
              <div>
                <FieldLabel label="Pincode" required />
                <input
                  value={form.pincode}
                  onChange={(e) => {
                    setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }));
                    if (errors.pincode) setErrors(er => ({ ...er, pincode: "" }));
                  }}
                  placeholder="416001"
                  className={inputCls(errors.pincode)}
                  maxLength={6}
                />
                {errors.pincode && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.pincode}</p>}
              </div>
            </div>

            {/* Partnership Details */}
            <SectionHead icon={Store} label="Partnership Details" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel label="Preferred Contact Channel" required />
                <div className="relative">
                  <select
                    value={form.channel}
                    onChange={set("channel")}
                    className={inputCls(errors.channel) + " appearance-none pr-9"}
                  >
                    <option value="">Select channel</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.channel && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.channel}</p>}
              </div>
              <div>
                <FieldLabel label="Monthly Buying Capacity" required />
                <div className="relative">
                  <select
                    value={form.capacity}
                    onChange={set("capacity")}
                    className={inputCls(errors.capacity) + " appearance-none pr-9"}
                  >
                    <option value="">Select range</option>
                    <option value="small">Up to 50 units / month</option>
                    <option value="medium">50–200 units / month</option>
                    <option value="large">200–500 units / month</option>
                    <option value="bulk">500+ units / month</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.capacity && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.capacity}</p>}
              </div>
            </div>

            {/* Products multi-select */}
            <div ref={productWrapRef}>
              <FieldLabel label="Products Interested In" required />
              <div
                className={`rounded-xl border px-3 py-2 bg-slate-50 cursor-text min-h-[44px] flex flex-wrap gap-2 focus-within:border-green-500 focus-within:bg-white transition-all ${
                  errors.products ? "border-red-400" : "border-slate-200"
                }`}
                onClick={() => productInputRef.current?.focus()}
              >
                {selectedProducts.map(p => (
                  <span key={p} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-lg bg-green-50 border border-green-100 text-green-800 text-xs font-black">
                    {p}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedProducts(prev => prev.filter(x => x !== p)); }}
                      className="text-green-400 hover:text-green-700 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <input
                  ref={productInputRef}
                  value={productQuery}
                  onChange={(e) => { setProductQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={selectedProducts.length ? "" : "Search products…"}
                  className="flex-1 min-w-[140px] outline-none bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-300"
                />
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <ul className="mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl ring-1 ring-black/5 max-h-36 overflow-auto z-50 relative">
                  {availableProducts.length === 0 ? (
                    <li className="px-4 py-3 text-xs text-slate-400 font-semibold">No matches</li>
                  ) : availableProducts.map(p => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); addProduct(p.name); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                      >
                        {p.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {errors.products && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.products}</p>}
            </div>

            {/* Message */}
            <SectionHead icon={FileText} label="Additional Info" />

            <div>
              <FieldLabel label="Message / Requirements" />
              <textarea
                value={form.message}
                onChange={set("message")}
                rows={3}
                placeholder="Share any specific requirements, questions or details about your business… (optional)"
                className={inputCls(false) + " resize-none"}
              />
            </div>

            {/* Submit error */}
            {errors.submit && (
              <p className="text-sm font-bold text-red-500 text-center">{errors.submit}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 pb-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-800 hover:bg-green-900 text-white text-sm font-black transition-all disabled:opacity-60 active:scale-95"
              >
                {saving ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Submit Application"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-600 text-sm font-black hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
