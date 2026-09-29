import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-text-primary text-white mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl mb-4">The Curated Store</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Thoughtfully curated products from brands that value quality and craftsmanship. We believe in fewer, better things.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide-label text-gray-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-sm text-gray-300 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=Electronics" className="text-sm text-gray-300 hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/shop?category=Fashion" className="text-sm text-gray-300 hover:text-white transition-colors">Fashion</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide-label text-gray-400 mb-4">Customer Service</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-gray-300">Shipping Information</span></li>
              <li><span className="text-sm text-gray-300">Return Policy</span></li>
              <li><span className="text-sm text-gray-300">Terms of Service</span></li>
              <li><span className="text-sm text-gray-300">Privacy Policy</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide-label text-gray-400 mb-4">Get in Touch</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-300">support@thecuratedstore.com</li>
              <li className="text-sm text-gray-300">+91 98765 43210</li>
              <li className="text-sm text-gray-300">Mon - Sat, 10AM - 7PM IST</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            2024 The Curated Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 border border-gray-600 px-3 py-1 rounded">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
