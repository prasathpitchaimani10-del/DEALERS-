import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { productAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productAPI.getAll({ limit: 100 });
      setProducts(res.data.data.products);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productAPI.delete(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully.');
    } catch {
      toast.error('Failed to delete product.');
    }
    setDeleteId(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader text="Loading products..." />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or brand..."
            className="input-field pl-9 text-sm"
          />
        </div>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-background-secondary/50">
                <th className="px-6 py-3 label-text">Product</th>
                <th className="px-6 py-3 label-text">Category</th>
                <th className="px-6 py-3 label-text">Price</th>
                <th className="px-6 py-3 label-text">Stock</th>
                <th className="px-6 py-3 label-text">Featured</th>
                <th className="px-6 py-3 label-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <tr key={product._id} className="border-b border-border last:border-0 hover:bg-background-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-background-secondary flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={18} className="text-text-tertiary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-text-tertiary">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{product.category}</td>
                    <td className="px-6 py-4 font-mono text-sm font-medium">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-error'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isFeatured ? (
                        <span className="badge bg-primary-light text-primary">Yes</span>
                      ) : (
                        <span className="text-xs text-text-tertiary">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-2 text-text-tertiary hover:text-primary rounded-lg hover:bg-primary-light transition-colors"
                          aria-label="Edit product"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product._id)}
                          className="p-2 text-text-tertiary hover:text-error rounded-lg hover:bg-red-50 transition-colors"
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-text-tertiary">
                    {search ? 'No products match your search.' : 'No products added yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative bg-surface border border-border rounded-xl p-6 w-full max-w-sm mx-4 animate-fade-in">
            <h3 className="font-serif text-lg text-text-primary mb-2">Delete Product</h3>
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-error text-white font-medium px-4 py-3 rounded-lg text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
