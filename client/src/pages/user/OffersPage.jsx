import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Copy, Check, Ticket, Gift, Award, ArrowRight } from 'lucide-react';
import { couponAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function OffersPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await couponAPI.getActive();
      setCoupons(res.data.data.coupons);
    } catch {
      // Failed
    } finally {
      setLoading(false);
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) return <Loader text="Loading offers..." />;

  return (
    <div className="page-container py-8 md:py-12 animate-fade-in">
      <h1 className="section-title mb-2">Offers & Coupons</h1>
      <p className="text-text-secondary mb-10">Save more with our exclusive deals and coupon codes.</p>

      {/* Highlight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6">
          <Tag size={28} className="text-blue-600 mb-3" />
          <h3 className="font-serif text-lg text-text-primary mb-1">Seasonal Deals</h3>
          <p className="text-sm text-text-secondary">Up to 50% off on select categories. Limited-time offers on trending products.</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-xl p-6">
          <Gift size={28} className="text-emerald-600 mb-3" />
          <h3 className="font-serif text-lg text-text-primary mb-1">Gift Vouchers</h3>
          <p className="text-sm text-text-secondary">Send the gift of choice. Vouchers are redeemable across all product categories.</p>
          {isAuthenticated && user?.giftVoucherBalance > 0 && (
            <p className="text-sm font-semibold text-emerald-700 mt-2">
              Your balance: {formatPrice(user.giftVoucherBalance)}
            </p>
          )}
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 rounded-xl p-6">
          <Award size={28} className="text-amber-600 mb-3" />
          <h3 className="font-serif text-lg text-text-primary mb-1">Credit Points</h3>
          <p className="text-sm text-text-secondary">Earn 1 point for every Rs. 100 spent. Redeem points for discounts on future orders.</p>
          {isAuthenticated && user?.creditPoints > 0 && (
            <p className="text-sm font-semibold text-amber-700 mt-2">
              Your points: {user.creditPoints}
            </p>
          )}
        </div>
      </div>

      {/* Coupon Cards */}
      <h2 className="font-serif text-xl text-text-primary mb-6">Active Coupon Codes</h2>
      {coupons.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-xl">
          <Ticket size={48} className="mx-auto text-text-tertiary mb-4" strokeWidth={1} />
          <h3 className="font-serif text-xl text-text-primary mb-2">No active coupons right now</h3>
          <p className="text-text-secondary text-sm mb-6">Check back soon for new deals and offers.</p>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coupons.map((coupon) => {
            const daysLeft = Math.ceil((new Date(coupon.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={coupon._id} className="bg-surface border border-border rounded-xl overflow-hidden flex">
                {/* Left accent */}
                <div className="w-2 bg-gradient-to-b from-primary to-primary/60 flex-shrink-0" />
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-mono text-lg font-bold text-primary">{coupon.code}</span>
                      <p className="text-sm text-text-secondary mt-1">{coupon.description}</p>
                    </div>
                    <button onClick={() => copyCoupon(coupon.code)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:border-primary hover:text-primary transition-colors flex-shrink-0">
                      {copiedCode === coupon.code ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
                    {coupon.discountType === 'percentage' ? (
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">
                        {coupon.discountValue}% Off
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">
                        {formatPrice(coupon.discountValue)} Off
                      </span>
                    )}
                    {coupon.minOrderAmount > 0 && (
                      <span>Min. order: {formatPrice(coupon.minOrderAmount)}</span>
                    )}
                    {coupon.maxDiscount && (
                      <span>Max discount: {formatPrice(coupon.maxDiscount)}</span>
                    )}
                    <span className={daysLeft <= 7 ? 'text-error font-medium' : ''}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expires today'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-12">
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
