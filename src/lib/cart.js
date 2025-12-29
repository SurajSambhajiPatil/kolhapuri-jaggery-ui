const STORAGE_KEY = "kolhapuri_cart";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
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

export function subtotal() {
  return read().reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
}

export default { getCart, addToCart, updateQty, removeItem, clearCart, subtotal };
