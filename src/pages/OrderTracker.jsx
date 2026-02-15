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
  const current = Math.min(Math.max(order.status || 0, 0), steps.length - 1);

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

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-6">
          Order Status
        </h2>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    i <= current ? "bg-green-700 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-1 w-full mx-2 ${
                      i < current ? "bg-green-700" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs sm:text-sm">
            {steps.map((s, i) => (
              <span
                key={s}
                className={i <= current ? "font-medium text-green-700" : "text-gray-500"}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  index <= current ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <span className={index <= current ? "font-medium" : "text-gray-400"}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
