export default function Navbar() {
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-leaf">GUDORA-KolhapuriJaggery</h1>

        <ul className="hidden md:flex gap-6 font-medium">
          <li
            className="cursor-pointer"
            onClick={() => scrollToId("home")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && scrollToId("home")}
          >
            Home
          </li>

          <li className="relative group" tabIndex={0}>
            <button
              className="cursor-pointer"
              onClick={() => scrollToId("products")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollToId("products")}
            >
              Products
            </button>

            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
              <ul className="py-2">
                <li>
                  <a href="/category/jaggery-powder" className="w-full block text-left px-4 py-2 hover:bg-gray-100">Jaggery Powder</a>
                </li>
                <li>
                  <a href="/category/jaggery-cubes" className="w-full block text-left px-4 py-2 hover:bg-gray-100">Jaggery Cubes</a>
                </li>
                <li>
                  <a href="/category/jaggery-blocks" className="w-full block text-left px-4 py-2 hover:bg-gray-100">Jaggery Blocks</a>
                </li>
                <li>
                  <a href="/category/jaggery-candies" className="w-full block text-left px-4 py-2 hover:bg-gray-100">Jaggery Candys</a>
                </li>
                <li>
                  <a href="/category/masala-jaggery-blocks" className="w-full block text-left px-4 py-2 hover:bg-gray-100">Masala Jaggery Blocks</a>
                </li>
              </ul>
            </div>
          </li>

          <li
            className="cursor-pointer"
            onClick={() => scrollToId("why-jaggery")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && scrollToId("why-jaggery")}
          >
            Why Jaggery?
          </li>

          <li
            className="cursor-pointer"
            onClick={() => scrollToId("process")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && scrollToId("process")}
          >
            Process
          </li>

          <li
            className="cursor-pointer"
            onClick={() => scrollToId("reviews")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && scrollToId("reviews")}
          >
            Reviews
          </li>

          <li
            className="cursor-pointer"
            onClick={() => scrollToId("become-seller")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && scrollToId("become-seller")}
          >
            Become a Seller
          </li>
        </ul>

        <div className="flex gap-4">
          <button onClick={() => (window.__showLoginModal ? window.__showLoginModal() : (window.location.href = "/login"))}>Login</button>
          <button
            onClick={() => (window.__showCartModal ? window.__showCartModal() : (window.location.href = "/cart"))}
            className="bg-leaf text-white px-4 py-2 rounded"
          >
            Cart
          </button>
        </div>
      </div>
    </nav>
  );
}
