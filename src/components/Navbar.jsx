export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-leaf">KolhapuriJaggery</h1>

        <ul className="hidden md:flex gap-6 font-medium">
          <li>Home</li>
          <li>Products</li>
          <li>Why Jaggery?</li>
          <li>Process</li>
          <li>Reviews</li>
          <li>Become a Seller</li>
        </ul>

        <div className="flex gap-4">
          <button>Login</button>
          <button className="bg-leaf text-white px-4 py-2 rounded">Cart</button>
        </div>
      </div>
    </nav>
  );
}
