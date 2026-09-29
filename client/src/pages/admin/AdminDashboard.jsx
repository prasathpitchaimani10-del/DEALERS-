import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, IndianRupee, ArrowRight } from 'lucide-react';
import { userAPI } from '../../services/api';
import { formatPrice, formatDate, getStatusBadge, capitalize } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await userAPI.getDashboardStats();
      setData(res.data.data);
    } catch {
      // Failed
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading dashboard..." />;
  if (!data) return <p className="text-text-secondary">Failed to load dashboard data.</p>;

  const { stats, recentOrders, recentCustomers } = data;

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="label-text">{card.label}</span>
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-text-primary font-mono">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-serif text-lg text-text-primary">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="px-6 py-3 label-text">Order ID</th>
                  <th className="px-6 py-3 label-text">Customer</th>
                  <th className="px-6 py-3 label-text">Date</th>
                  <th className="px-6 py-3 label-text">Total</th>
                  <th className="px-6 py-3 label-text">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-border last:border-0 hover:bg-background-secondary/50 transition-colors">
                      <td className="px-6 py-3 font-mono text-sm">{order.orderNumber}</td>
                      <td className="px-6 py-3 text-sm text-text-primary">{order.userId?.fullName || 'N/A'}</td>
                      <td className="px-6 py-3 text-sm text-text-secondary">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-3 font-mono text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-3">
                        <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                          {capitalize(order.orderStatus)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-tertiary">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-surface border border-border rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-serif text-lg text-text-primary">Recent Customers</h2>
            <Link to="/admin/customers" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCustomers && recentCustomers.length > 0 ? (
              recentCustomers.map((customer) => (
                <div key={customer._id} className="px-6 py-4 flex items-center gap-3 hover:bg-background-secondary/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {customer.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{customer.fullName}</p>
                    <p className="text-xs text-text-tertiary truncate">{customer.email}</p>
                  </div>
                  <span className="text-xs text-text-tertiary ml-auto flex-shrink-0">
                    {formatDate(customer.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-text-tertiary">
                No customers yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
