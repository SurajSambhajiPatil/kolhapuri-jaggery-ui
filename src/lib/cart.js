const BASE_KEY = "kolhapuri_cart";
const USER_KEY = "current_user_id";
const FREE_CHIKKI_ID = "free-chikki-promo";

function key() {
  try {
    const uid = localStorage.getItem(USER_KEY);
    return uid ? `${BASE_KEY}:user:${uid}` : BASE_KEY;
  } catch {
    return BASE_KEY;
  }
}

function read(k) {
  try {
    const raw = localStorage.getItem(k || key());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(cart, k) {
  const updatedCart = applySpecialOffers(cart);
  localStorage.setItem(k || key(), JSON.stringify(updatedCart));
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCart }));
}

function applySpecialOffers(cart) {
  // Filter out existing free chikki to re-evaluate
  let newCart = cart.filter(item => item.id !== FREE_CHIKKI_ID);
  
  const sub = newCart.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const isFirstOrder = localStorage.getItem("is_first_order") !== "false"; // Assume true if not set
  const overThreshold = sub >= 499;

  if (overThreshold || isFirstOrder) {
    newCart.push({
      id: FREE_CHIKKI_ID,
      name: "Gudora Special Chikki",
      price: 0,
      originalPrice: 120,
      image: "/images/products/Chikki.png",
      qty: 1,
      isFree: true,
      promoType: overThreshold ? "ORDER_VALUE" : "FIRST_ORDER"
    });
  }

  return newCart;
}

export function getCart() {
  return read();
}

export function addToCart(item) {
  const cart = read();
  const idx = cart.findIndex((c) => c.id === item.id);
  const normalized = { ...item, price: Number(item.price) || 0, qty: item.qty || 1 };
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 1) + normalized.qty;
    cart[idx].price = normalized.price; // ensure numeric
  } else {
    cart.push(normalized);
  }
  write(cart);
}

export function updateQty(id, qty) {
  if (id === FREE_CHIKKI_ID) return; // Cannot manually update free item qty
  const cart = read().map((c) => (c.id === id ? { ...c, qty } : c)).filter((c) => c.qty > 0);
  write(cart);
}

export function removeItem(id) {
  if (id === FREE_CHIKKI_ID) return; // Cannot manually remove free item
  const cart = read().filter((c) => c.id !== id);
  write(cart);
}

export function clearCart() {
  write([]);
}

export function clearAllCarts() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((k) => {
      if (k.startsWith("kolhapuri_cart")) {
        localStorage.setItem(k, "[]");
      }
    });
  } catch {}
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));
}

export function subtotal() {
  return read().reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
}

export function mergeCarts(guestKey, userKey) {
  const g = read(guestKey);
  const u = read(userKey);
  const byId = {};
  [...u, ...g].forEach((it) => {
    const prev = byId[it.id];
    if (prev) {
      byId[it.id] = { ...prev, qty: (prev.qty || 1) + (it.qty || 1) };
    } else {
      byId[it.id] = { ...it, qty: it.qty || 1 };
    }
  });
  const merged = Object.values(byId);
  write(merged, userKey);
  localStorage.removeItem(guestKey);
  return merged;
}

export default { getCart, addToCart, updateQty, removeItem, clearCart, subtotal };
