import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { wishlistAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { formatPrice, getDiscount } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await wishlistAPI.get();
      setProducts(res.data.data.wishlist.products || []);
    } catch {
      // Failed
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Removed from wishlist.');
    } catch {
      toast.error('Failed to remove item.');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId);
      await wishlistAPI.remove(productId);
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Moved to cart.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to move to cart.');
    }
  };

  if (loading) return <Loader text="Loading your wishlist..." />;

  return (
    <div className="page-container py-8 md:py-12 animate-fade-in">
      <h1 className="section-title mb-8">My Wishlist</h1>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={56} className="mx-auto text-text-tertiary mb-4" strokeWidth={1} />
          <h2 className="font-serif text-2xl text-text-primary mb-2">Your wishlist is empty</h2>
          <p className="text-text-secondary text-sm mb-6">Save items you love to your wishlist and revisit them anytime.</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discount = getDiscount(product.price, product.originalPrice);
            return (
              <div key={product._id} className="card group overflow-hidden">
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative aspect-[4/3] bg-background-secondary">
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
                  </div>
                </Link>
                <div className="p-4">
                  <p className="label-text text-xs mb-1">{product.brand}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-mono text-base font-semibold text-text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="font-mono text-xs text-text-tertiary line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleMoveToCart(product._id)}
                      className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-1.5"
                      disabled={product.stock === 0}>
                      <ShoppingCart size={14} /> {product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                    <button onClick={() => handleRemove(product._id)}
                      className="p-2 border border-border rounded-lg text-text-tertiary hover:text-error hover:border-error transition-colors"
                      aria-label="Remove from wishlist">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
