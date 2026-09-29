import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data.data.order);
    } catch {
      // Order not found
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading order details..." />;
  if (!order) return (
    <div className="page-container py-20 text-center">
      <h2 className="font-serif text-2xl text-text-primary mb-4">Order not found</h2>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );

  return (
    <div className="page-container py-12 md:py-20 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={40} className="text-success" />
          </div>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-text-primary mb-3">
          Your order has been placed successfully
        </h1>
        <p className="text-text-secondary mb-8">
          Thank you for your purchase. You will receive updates on your order status.
        </p>

        {/* Order Details Card */}
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 text-left mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="label-text mb-1">Order Number</p>
              <p className="font-mono text-sm font-semibold text-text-primary">{order.orderNumber}</p>
            </div>
            <div>
              <p className="label-text mb-1">Order Date</p>
              <p className="text-sm text-text-primary">{formatDate(order.orderDate || order.createdAt)}</p>
            </div>
            <div>
              <p className="label-text mb-1">Payment Method</p>
              <p className="text-sm text-text-primary">Cash on Delivery</p>
            </div>
            <div>
              <p className="label-text mb-1">Total Amount</p>
              <p className="font-mono text-sm font-semibold text-primary">{formatPrice(order.totalAmount)}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-border pt-4">
            <p className="label-text mb-3">Items Ordered</p>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-background-secondary flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={16} className="text-text-tertiary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{item.name}</p>
                    <p className="text-xs text-text-tertiary">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-border pt-4 mt-4">
            <p className="label-text mb-2">Shipping Address</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link to="/my-orders" className="btn-primary inline-flex items-center gap-2">
            View My Orders <ArrowRight size={16} />
          </Link>
          <Link to="/shop" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
