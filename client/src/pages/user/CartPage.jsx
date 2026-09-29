import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, cartCount, loading, updateQuantity, removeFromCart } = useCart();

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity.');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart.');
    } catch {
      toast.error('Failed to remove item.');
    }
  };

  if (loading) return <Loader text="Loading your cart..." />;

  const items = cart.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="page-container py-8 md:py-12 animate-fade-in">
      <h1 className="section-title mb-8">Shopping Cart</h1>

      {isEmpty ? (
        <div className="text-center py-20">
          <ShoppingBag size={56} className="mx-auto text-text-tertiary mb-4" strokeWidth={1} />
          <h2 className="font-serif text-2xl text-text-primary mb-2">Your cart is empty</h2>
          <p className="text-text-secondary text-sm mb-6">Looks like you have not added anything yet.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div key={item._id || product._id} className="card flex gap-4 p-4">
                  {/* Image */}
                  <Link to={`/product/${product._id}`} className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-background-secondary">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                        <Package size={28} strokeWidth={1} />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product._id}`} className="text-sm font-medium text-text-primary hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </Link>
                    <p className="font-mono text-sm font-semibold text-text-primary mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Subtotal & Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-sm font-semibold text-text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemove(product._id)}
                          className="p-1.5 text-text-tertiary hover:text-error transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-6 sticky top-24">
              <h3 className="font-serif text-lg text-text-primary mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal ({cartCount} items)</span>
                  <span className="font-mono font-medium text-text-primary">{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-medium text-text-primary">Total</span>
                  <span className="font-mono text-lg font-bold text-text-primary">{formatPrice(cart.totalAmount)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center mt-6 block">
                Proceed to Checkout
              </Link>

              <Link to="/shop" className="block text-center text-sm text-text-secondary hover:text-primary mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
