import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Heart, Award, Truck, RotateCcw, Tag, Gift,
  Smartphone, Shirt, ChefHat, BookOpen, Dumbbell, Sparkles, Package, Ticket, Copy, Check,
  Footprints, Gamepad2, HeartPulse, Gem, Lamp, Car, ShoppingBag, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { productAPI, couponAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice, getDiscount, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICON_COLORS } from '../../utils/helpers';
import { ProductSkeleton } from '../../components/common/Loader';
import toast from 'react-hot-toast';

// Map category names to icon components
const categoryIcons = {
  'Electronics': Smartphone,
  'Fashion': Shirt,
  'Home & Kitchen': ChefHat,
  'Books': BookOpen,
  'Sports': Dumbbell,
  'Beauty': Sparkles,
  'Footwear': Footprints,
  'Toys & Games': Gamepad2,
  'Health & Personal Care': HeartPulse,
  'Jewelry & Accessories': Gem,
  'Home Decor': Lamp,
  'Automotive': Car,
  'Groceries & Food': ShoppingBag,
  'Office & Stationery': Briefcase
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, couponsRes] = await Promise.all([
        productAPI.getFeatured(),
        couponAPI.getActive().catch(() => ({ data: { data: { coupons: [] } } }))
      ]);
      setFeaturedProducts(productsRes.data.data.products);
      setCoupons(couponsRes.data.data.coupons);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      return;
    }
    try {
      await addToCart(productId);
      toast.success('Added to cart.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      {isAuthenticated && !isAdmin && (
        <div className="bg-gradient-to-r from-primary/10 via-primary-light to-primary/10 border-b border-primary/20">
          <div className="page-container py-3 flex items-center justify-between">
            <p className="text-sm text-text-primary">
              Welcome back, <span className="font-semibold">{user?.fullName}</span>
              {user?.creditPoints > 0 && (
                <span className="ml-3 inline-flex items-center gap-1 text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                  <Award size={12} /> {user.creditPoints} Credit Points
                </span>
              )}
              {user?.giftVoucherBalance > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  <Gift size={12} /> {formatPrice(user.giftVoucherBalance)} Voucher Balance
                </span>
              )}
            </p>
            <Link to="/shop" className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
              Shop Now <ArrowRight size={12} className="inline" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary-light to-background">
        <div className="page-container py-24 md:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="label-text text-primary mb-4">Curated with care</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight tracking-tight-heading">
              Thoughtfully Curated, Delivered to Your Door
            </h1>
            <p className="text-lg text-text-secondary mt-6 max-w-lg leading-relaxed">
              Discover products chosen for quality, design, and lasting value. From the latest smartphones to handcrafted home essentials.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/offers" className="btn-secondary inline-flex items-center gap-2">
                <Tag size={16} /> View Offers
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-40 w-48 h-48 bg-primary/8 rounded-full blur-2xl" />
      </section>

      {/* Quality & Trust Badges */}
      <section className="border-b border-border bg-surface">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Every product is quality-verified' },
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above Rs. 999' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
              { icon: Star, title: '4.8 Rating', desc: 'Trusted by 50,000+ customers' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-tertiary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Coupons / Offers Ticker */}
      {coupons.length > 0 && (
        <section className="bg-gradient-to-r from-primary/5 to-amber-50 border-b border-border">
          <div className="page-container py-5">
            <div className="flex items-center gap-3 mb-4">
              <Ticket size={20} className="text-primary" />
              <h2 className="text-base font-semibold text-text-primary">Available Offers & Coupons</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="flex-shrink-0 bg-surface border border-dashed border-primary/40 rounded-xl p-4 min-w-[260px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                      {coupon.code}
                    </span>
                    <button onClick={() => copyCoupon(coupon.code)}
                      className="text-xs flex items-center gap-1 text-text-tertiary hover:text-primary transition-colors">
                      {copiedCode === coupon.code ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary">{coupon.description}</p>
                  {coupon.minOrderAmount > 0 && (
                    <p className="text-xs text-text-tertiary mt-1">Min. order: {formatPrice(coupon.minOrderAmount)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories with Icons */}
      <section className="page-container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="text-text-secondary mt-2">Find exactly what you are looking for.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((category) => {
              const IconComp = categoryIcons[category] || Package;
              const colorClass = CATEGORY_COLORS[category] || 'from-gray-50 to-gray-100';
              const iconColor = CATEGORY_ICON_COLORS[category] || 'text-gray-600';
              return (
                <Link
                  key={category}
                  to={`/shop?category=${encodeURIComponent(category)}`}
                  className={`group bg-gradient-to-br ${colorClass} border rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]`}
                >
                  <div className={`mx-auto w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${iconColor}`}>
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {category}
                  </h3>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="page-container pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Trending Right Now</h2>
              <p className="text-text-secondary mt-2">Our most popular picks, chosen by customers like you.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  showActions={isAuthenticated && !isAdmin}
                />
              ))}
            </div>
          )}

          <div className="md:hidden text-center mt-8">
            <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Gift Voucher Banner */}
      <section className="page-container pb-16">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Gift size={32} className="text-emerald-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-serif text-2xl text-text-primary mb-2">Gift Vouchers Available</h3>
            <p className="text-text-secondary">
              Send the gift of choice. Gift vouchers are redeemable on any product across the store. Apply voucher balance at checkout.
            </p>
          </div>
          <Link to="/shop" className="btn-primary flex-shrink-0">
            Browse Products
          </Link>
        </div>
      </section>

      {/* Credit Points Explainer */}
      <section className="bg-background-secondary py-16">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title">Earn While You Shop</h2>
            <p className="text-text-secondary mt-2">Our loyalty program rewards every purchase.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Shop Products', desc: 'Browse and order from our curated collection of quality products.' },
              { step: '02', title: 'Earn Credit Points', desc: 'Earn 1 credit point for every Rs. 100 spent. Points accumulate with every order.' },
              { step: '03', title: 'Redeem Rewards', desc: 'Use your credit points for discounts on future purchases. More points, bigger savings.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-mono font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onAddToCart, showActions }) {
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <Link to={`/product/${product._id}`} className="card group overflow-hidden">
      {/* Image */}
      <div className="product-image-zoom relative aspect-[4/3] bg-background-secondary">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <Package size={40} strokeWidth={1} />
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-error text-white text-xs font-semibold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {/* Wishlist button overlay */}
        {showActions && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast('Add to wishlist from product page.'); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-text-tertiary hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart size={16} />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <p className="label-text text-xs mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
            <span className="text-xs font-semibold text-green-700">{product.ratings}</span>
            <Star size={10} className="fill-green-600 text-green-600" />
          </div>
          <span className="text-xs text-text-tertiary">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-base font-semibold text-text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-mono text-xs text-text-tertiary line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Add to Cart */}
        {showActions && (
          <button
            onClick={(e) => onAddToCart(e, product._id)}
            className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
