export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* TOP GRID */}
        <div className="grid gap-10 md:grid-cols-4">

          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">
              GUDORAFOODS
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Pure organic jaggery crafted in Kolhapur using
              traditional methods and modern hygiene standards.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Products</li>
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* SELLER */}
          <div>
            <h4 className="text-white font-semibold mb-4">Partnership</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">
                Become a Seller
              </li>
              <li className="hover:text-white cursor-pointer">
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>9561192015</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🌐</span>
                <span>www.gudorafoods.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center">
          <p className="text-xs text-gray-400">
            © 2025 GUDORAFOODS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
