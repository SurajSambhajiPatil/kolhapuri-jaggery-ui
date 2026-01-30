export default function OrderTracker() {
  const order = JSON.parse(localStorage.getItem("lastOrder"));

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold">No orders found</h2>
        <p className="text-gray-500 mt-2">
          Place an order to see tracking details.
        </p>
      </div>
    );
  }

  const steps = [
    "Order Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <section className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-8">
        Track Your Order
      </h1>

      {/* ORDER SUMMARY */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="font-semibold text-lg mb-3">
          Order Summary
        </h2>
        <p><b>Order ID:</b> {order.id}</p>
        <p><b>Total:</b> ₹{order.total}</p>
        <p><b>Payment:</b> {order.payment}</p>
        <p><b>Delivery Address:</b> {order.address}</p>
      </div>

      {/* TRACKER */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-6">
          Order Status
        </h2>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  index <= order.status
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
              <span
                className={
                  index <= order.status
                    ? "font-medium"
                    : "text-gray-400"
                }
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
