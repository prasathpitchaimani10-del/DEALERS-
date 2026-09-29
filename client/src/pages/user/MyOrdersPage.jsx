import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, getStatusBadge, capitalize } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.data.orders);
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading your orders..." />;

  return (
    <div className="page-container py-8 md:py-12 animate-fade-in">
      <h1 className="section-title mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={56} className="mx-auto text-text-tertiary mb-4" strokeWidth={1} />
          <h2 className="font-serif text-2xl text-text-primary mb-2">No orders yet</h2>
          <p className="text-text-secondary text-sm mb-6">When you place an order, it will appear here.</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-surface border border-border rounded-xl overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-6 text-left">
                  <div>
                    <p className="label-text mb-0.5">Order</p>
                    <p className="font-mono text-sm font-semibold text-text-primary">{order.orderNumber}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="label-text mb-0.5">Date</p>
                    <p className="text-sm text-text-primary">{formatDate(order.orderDate || order.createdAt)}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="label-text mb-0.5">Items</p>
                    <p className="text-sm text-text-primary">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="label-text mb-0.5">Total</p>
                    <p className="font-mono text-sm font-semibold text-text-primary">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                    {capitalize(order.orderStatus)}
                  </span>
                  {expandedOrder === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-border px-6 py-5 animate-fade-in">
                  {/* Status Timeline */}
                  <div className="mb-6">
                    <p className="label-text mb-3">Order Progress</p>
                    <div className="flex items-center gap-0">
                      {['placed', 'confirmed', 'shipped', 'delivered'].map((status, i) => {
                        const statusOrder = ['placed', 'confirmed', 'shipped', 'delivered'];
                        const currentIndex = statusOrder.indexOf(order.orderStatus);
                        const isActive = i <= currentIndex;
                        const isCancelled = order.orderStatus === 'cancelled';
                        return (
                          <div key={status} className="flex items-center flex-1 last:flex-initial">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isCancelled ? 'bg-red-100 text-error' :
                              isActive ? 'bg-primary text-white' : 'bg-background-secondary text-text-tertiary'
                            }`}>
                              {i + 1}
                            </div>
                            {i < 3 && (
                              <div className={`h-0.5 flex-1 mx-1 ${
                                isCancelled ? 'bg-red-200' :
                                i < currentIndex ? 'bg-primary' : 'bg-background-secondary'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2">
                      {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map(s => (
                        <span key={s} className="text-[10px] text-text-tertiary">{s}</span>
                      ))}
                    </div>
                    {order.orderStatus === 'cancelled' && (
                      <p className="text-sm text-error mt-2 font-medium">This order has been cancelled.</p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-background-secondary flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={18} className="text-text-tertiary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                          <p className="text-xs text-text-tertiary">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                        </div>
                        <span className="font-mono text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="label-text mb-1">Shipping Address</p>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {order.shippingAddress.fullName}, {order.shippingAddress.street},
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>
                    <div>
                      <p className="label-text mb-1">Payment</p>
                      <p className="text-sm text-text-secondary">Cash on Delivery</p>
                      <span className={`badge mt-1 ${getStatusBadge(order.paymentStatus)}`}>
                        {capitalize(order.paymentStatus)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
