import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../lib/auth.jsx";
import { supabase } from "../lib/supabase";

export default function OrderTracker() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = ["Order Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const statusIndex = (s) => {
    const v = String(s || "").toLowerCase();
    if (v.includes("deliver")) return 4;
    if (v.includes("out_for") || v.includes("out for")) return 3;
    if (v.includes("ship")) return 2;
    if (v.includes("pack")) return 1;
    return 0;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (!user || user.guest) {
          setOrders([]);
          setItemsByOrder({});
          setActiveId(null);
          return;
        }
        const { data: list } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        const safeList = list || [];
        setOrders(safeList);
        setActiveId(safeList[0]?.id || null);
        const ids = safeList.map((o) => o.id);
        if (ids.length) {
          const { data: allItems } = await supabase
            .from("order_items")
            .select("*")
            .in("order_id", ids);
          const grouped = {};
          (allItems || []).forEach((it) => {
            grouped[it.order_id] = grouped[it.order_id] || [];
            grouped[it.order_id].push(it);
          });
          setItemsByOrder(grouped);
        } else {
          setItemsByOrder({});
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const active = useMemo(() => orders.find((o) => o.id === activeId) || orders[0], [orders, activeId]);
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="h-72 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }
  if (!orders.length && !active) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold">No orders found</h2>
        <p className="text-gray-500 mt-2">Place an order to see tracking details.</p>
      </div>
    );
  }

  const current = statusIndex(active?.status);
  const lines = itemsByOrder[active?.id] || [];
  const total = active?.total_cents ?? 0;

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-8">Track Your Order</h1>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">Order Summary</div>
              <div className="text-sm px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                {String(active?.status || "confirmed").replaceAll("_", " ")}
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div><b>Order ID:</b> {active?.order_number || active?.id}</div>
              <div><b>Total:</b> ₹{total}</div>
              <div><b>Payment:</b> {active?.payment_method === "ONLINE" ? "Online Payment" : "Cash on Delivery"}</div>
              <div><b>Delivery Address:</b> {active?.address_line1}, {active?.city} {active?.pincode}</div>
            </div>
            <div className="mt-4 border-t pt-4">
              {(lines.length ? lines : []).map((it) => (
                <div key={it.id} className="flex items-center justify-between text-sm py-2">
                  <div className="flex items-center gap-3">
                    {it.product_image ? <img src={it.product_image} className="h-10 w-10 rounded bg-gray-50 object-contain" /> : <div className="h-10 w-10 rounded bg-gray-100" />}
                    <div className="font-medium">{it.product_name}</div>
                  </div>
                  <div className="text-gray-700">₹{it.unit_price_cents} × {it.qty}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="font-semibold text-lg mb-6">Order Status</div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1 flex items-center">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold ${i <= current ? "bg-green-700 text-white" : "bg-gray-200 text-gray-600"}`}>
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-1 w-full mx-2 ${i < current ? "bg-green-700" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs sm:text-sm">
                {steps.map((s, i) => (
                  <span key={s} className={i <= current ? "font-medium text-green-700" : "text-gray-500"}>{s}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${i <= current ? "bg-green-600" : "bg-gray-300"}`} />
                  <span className={i <= current ? "font-medium" : "text-gray-400"}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="font-semibold text-lg mb-4">All Orders</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Order</th>
                    <th className="py-2 pr-4">Items</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const ls = itemsByOrder[o.id] || [];
                    return (
                      <tr
                        key={o.id}
                        onClick={() => setActiveId(o.id)}
                        className={`cursor-pointer hover:bg-green-50 ${o.id === activeId ? "bg-green-50" : ""}`}
                      >
                        <td className="py-2 pr-4 font-medium">{o.order_number || o.id}</td>
                        <td className="py-2 pr-4">{ls.reduce((n, it) => n + (it.qty || 0), 0)}</td>
                        <td className="py-2 pr-4">₹{o.total_cents ?? 0}</td>
                        <td className="py-2 pr-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            {String(o.status || "confirmed").replaceAll("_", " ")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
