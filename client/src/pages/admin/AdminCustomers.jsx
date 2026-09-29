import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { userAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await userAPI.getAll({ limit: 100 });
      setCustomers(res.data.data.customers);
    } catch {
      toast.error('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader text="Loading customers..." />;

  return (
    <div className="animate-fade-in">
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..." className="input-field pl-9 text-sm" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-background-secondary/50">
                <th className="px-6 py-3 label-text">Customer</th>
                <th className="px-6 py-3 label-text">Email</th>
                <th className="px-6 py-3 label-text">Phone</th>
                <th className="px-6 py-3 label-text">Registered</th>
                <th className="px-6 py-3 label-text">Orders</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((customer) => (
                <tr key={customer._id} className="border-b border-border last:border-0 hover:bg-background-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {customer.fullName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-text-primary">{customer.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(customer.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-text-primary">{customer.totalOrders || 0}</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users size={36} className="mx-auto text-text-tertiary mb-3" strokeWidth={1} />
                    <p className="text-sm text-text-tertiary">
                      {search ? 'No customers match your search.' : 'No customers registered yet.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
