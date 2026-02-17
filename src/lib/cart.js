const BASE_KEY = "kolhapuri_cart";
const USER_KEY = "current_user_id";

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
  localStorage.setItem(k || key(), JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
}

export function getCart() {
  return read();
}

export function addToCart(item) {
  const cart = read();
  const idx = cart.findIndex((c) => c.id === item.id);
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 1) + (item.qty || 1);
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  write(cart);
}

export function updateQty(id, qty) {
  const cart = read().map((c) => (c.id === id ? { ...c, qty } : c)).filter((c) => c.qty > 0);
  write(cart);
}

export function removeItem(id) {
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
