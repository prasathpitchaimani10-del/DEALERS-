import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, couponAPI } from '../../services/api';
import { formatPrice, INDIAN_STATES } from '../../utils/helpers';
import { Package, Tag, X, Award, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, cartCount, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India'
  });

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required.';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required.';
    if (!shippingAddress.state) newErrors.state = 'State is required.';
    if (!shippingAddress.pincode.trim()) newErrors.pincode = 'Pincode is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty.');
      navigate('/cart');
      return;
    }

    setLoading(true);
    try {
      const res = await orderAPI.place({ shippingAddress });
      const order = res.data.data.order;
      await fetchCart();
      toast.success('Your order has been placed successfully.');
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const items = cart.items || [];

  return (
    <div className="page-container py-8 md:py-12 animate-fade-in">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-serif text-xl text-text-primary mb-5">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout-name" className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                  <input id="checkout-name" name="fullName" value={shippingAddress.fullName}
                    onChange={handleChange} className={`input-field ${errors.fullName ? 'border-error' : ''}`} placeholder="Recipient name" />
                  {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                  <input id="checkout-phone" name="phone" type="tel" value={shippingAddress.phone}
                    onChange={handleChange} className={`input-field ${errors.phone ? 'border-error' : ''}`} placeholder="+91 98765 43210" />
                  {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="checkout-street" className="block text-sm font-medium text-text-primary mb-1.5">Street Address</label>
                  <input id="checkout-street" name="street" value={shippingAddress.street}
                    onChange={handleChange} className={`input-field ${errors.street ? 'border-error' : ''}`} placeholder="House no., building, street, area" />
                  {errors.street && <p className="text-xs text-error mt-1">{errors.street}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-city" className="block text-sm font-medium text-text-primary mb-1.5">City</label>
                  <input id="checkout-city" name="city" value={shippingAddress.city}
                    onChange={handleChange} className={`input-field ${errors.city ? 'border-error' : ''}`} placeholder="City" />
                  {errors.city && <p className="text-xs text-error mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-state" className="block text-sm font-medium text-text-primary mb-1.5">State</label>
                  <select id="checkout-state" name="state" value={shippingAddress.state}
                    onChange={handleChange} className={`input-field ${errors.state ? 'border-error' : ''}`}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-xs text-error mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-pincode" className="block text-sm font-medium text-text-primary mb-1.5">Pincode</label>
                  <input id="checkout-pincode" name="pincode" value={shippingAddress.pincode}
                    onChange={handleChange} className={`input-field ${errors.pincode ? 'border-error' : ''}`} placeholder="6-digit pincode" />
                  {errors.pincode && <p className="text-xs text-error mt-1">{errors.pincode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Country</label>
                  <input value="India" disabled className="input-field bg-background-secondary text-text-tertiary cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-serif text-xl text-text-primary mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 p-4 border border-primary rounded-lg bg-primary-light">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Cash on Delivery</p>
                  <p className="text-xs text-text-secondary">Pay when your order arrives at your doorstep.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-6 sticky top-24">
              <h3 className="font-serif text-lg text-text-primary mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;
                  return (
                    <div key={item._id || product._id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-background-secondary flex-shrink-0 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-primary truncate">{product.name}</p>
                        <p className="text-xs text-text-tertiary">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-xs font-medium text-text-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code */}
              <div className="border-t border-border pt-4 mb-4">
                <label className="label-text mb-2 block">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-green-600" />
                      <span className="font-mono text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                      <span className="text-xs text-green-600">(-{formatPrice(couponDiscount)})</span>
                    </div>
                    <button type="button" onClick={() => { setAppliedCoupon(null); setCouponDiscount(0); setCouponCode(''); }}
                      className="text-green-600 hover:text-red-500 transition-colors"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="input-field flex-1 font-mono text-sm" placeholder="Enter code" />
                    <button type="button" disabled={!couponCode || applyingCoupon}
                      onClick={async () => {
                        setApplyingCoupon(true);
                        try {
                          const res = await couponAPI.apply(couponCode, cart.totalAmount);
                          setAppliedCoupon(res.data.data.coupon);
                          setCouponDiscount(res.data.data.discount);
                          toast.success(res.data.message);
                        } catch (err) {
                          toast.error(err.response?.data?.message || 'Invalid coupon.');
                        } finally { setApplyingCoupon(false); }
                      }}
                      className="btn-secondary text-sm px-4 flex-shrink-0">
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* User Rewards */}
              {(user?.creditPoints > 0 || user?.giftVoucherBalance > 0) && (
                <div className="space-y-2 mb-4">
                  {user?.creditPoints > 0 && (
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Award size={12} className="text-primary" />
                      <span>You have <strong className="text-primary">{user.creditPoints}</strong> credit points</span>
                    </div>
                  )}
                  {user?.giftVoucherBalance > 0 && (
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Gift size={12} className="text-emerald-600" />
                      <span>Voucher balance: <strong className="text-emerald-600">{formatPrice(user.giftVoucherBalance)}</strong></span>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal ({cartCount} items)</span>
                  <span className="font-mono font-medium">{formatPrice(cart.totalAmount)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-medium">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>Credit Points Earned</span>
                  <span className="text-primary font-medium">+{Math.floor((cart.totalAmount - couponDiscount) / 100)} pts</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-text-primary">Total</span>
                  <span className="font-mono text-lg font-bold text-text-primary">{formatPrice(cart.totalAmount - couponDiscount)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
