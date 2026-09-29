import { useState, useEffect } from 'react';
import { Search, Package } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, getStatusBadge, capitalize } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await orderAPI.getAll(params);
      setOrders(res.data.data.orders);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
      toast.success(`Order status updated to "${capitalize(newStatus)}".`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const filtered = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.userId?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="animate-fade-in">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or customer..." className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(status => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary'
              }`}>
              {capitalize(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-background-secondary/50">
                <th className="px-6 py-3 label-text">Order</th>
                <th className="px-6 py-3 label-text">Customer</th>
                <th className="px-6 py-3 label-text">Date</th>
                <th className="px-6 py-3 label-text">Items</th>
                <th className="px-6 py-3 label-text">Total</th>
                <th className="px-6 py-3 label-text">Status</th>
                <th className="px-6 py-3 label-text">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((order) => (
                <tr key={order._id} className="border-b border-border last:border-0 hover:bg-background-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-text-primary">{order.userId?.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{order.items.length}</td>
                  <td className="px-6 py-4 font-mono text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                      {capitalize(order.orderStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedOrder(order)}
                        className="text-xs text-primary hover:text-primary-hover font-medium transition-colors">
                        View
                      </button>
                      {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-xs border border-border rounded px-2 py-1 outline-none focus:border-primary"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-text-tertiary">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-surface border border-border rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-surface px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-lg">Order {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-text-tertiary hover:text-text-primary">
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="label-text">Status:</span>
                <span className={`badge ${getStatusBadge(selectedOrder.orderStatus)}`}>
                  {capitalize(selectedOrder.orderStatus)}
                </span>
              </div>

              {/* Customer */}
              <div>
                <p className="label-text mb-1">Customer</p>
                <p className="text-sm text-text-primary">{selectedOrder.userId?.fullName || 'N/A'}</p>
                <p className="text-xs text-text-tertiary">{selectedOrder.userId?.email}</p>
              </div>

              {/* Items */}
              <div>
                <p className="label-text mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-background-secondary flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : <Package size={14} className="text-text-tertiary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-tertiary">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <p className="label-text mb-1">Shipping Address</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {selectedOrder.shippingAddress.fullName}, {selectedOrder.shippingAddress.phone}<br />
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}<br />
                  {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-medium text-text-primary">Total Amount</span>
                <span className="font-mono text-lg font-bold text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
