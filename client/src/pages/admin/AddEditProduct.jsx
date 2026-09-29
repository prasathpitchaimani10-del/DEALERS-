import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Image } from 'lucide-react';
import { productAPI } from '../../services/api';
import { CATEGORIES } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function AddEditProduct() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: '', brand: '', stock: '', isFeatured: false
  });

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await productAPI.getById(id);
      const p = res.data.data.product;
      setFormData({
        name: p.name, description: p.description, price: p.price.toString(),
        originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
        category: p.category, brand: p.brand, stock: p.stock.toString(),
        isFeatured: p.isFeatured
      });
      setExistingImages(p.images || []);
    } catch {
      toast.error('Product not found.');
      navigate('/admin/products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.brand || !formData.stock) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      if (formData.originalPrice) data.append('originalPrice', formData.originalPrice);
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('stock', formData.stock);
      data.append('isFeatured', formData.isFeatured);

      imageFiles.forEach(file => {
        data.append('images', file);
      });

      if (isEdit) {
        await productAPI.update(id, data);
        toast.success('Product updated successfully.');
      } else {
        await productAPI.create(data);
        toast.success('Product added successfully.');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader text="Loading product..." />;

  return (
    <div className="max-w-3xl animate-fade-in">
      <h2 className="font-serif text-2xl text-text-primary mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Product Information</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-text-primary mb-1.5">Product Name *</label>
              <input id="product-name" name="name" value={formData.name} onChange={handleChange}
                className="input-field" placeholder="Enter product name" required />
            </div>
            <div>
              <label htmlFor="product-desc" className="block text-sm font-medium text-text-primary mb-1.5">Description *</label>
              <textarea id="product-desc" name="description" value={formData.description} onChange={handleChange}
                className="input-field min-h-[120px] resize-y" placeholder="Detailed product description" required />
              <p className="text-xs text-text-tertiary mt-1">{formData.description.length} characters</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-brand" className="block text-sm font-medium text-text-primary mb-1.5">Brand *</label>
                <input id="product-brand" name="brand" value={formData.brand} onChange={handleChange}
                  className="input-field" placeholder="Brand name" required />
              </div>
              <div>
                <label htmlFor="product-category" className="block text-sm font-medium text-text-primary mb-1.5">Category *</label>
                <select id="product-category" name="category" value={formData.category} onChange={handleChange}
                  className="input-field" required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Pricing & Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="product-price" className="block text-sm font-medium text-text-primary mb-1.5">Price (INR) *</label>
              <input id="product-price" name="price" type="number" min="0" value={formData.price} onChange={handleChange}
                className="input-field font-mono" placeholder="0" required />
            </div>
            <div>
              <label htmlFor="product-mrp" className="block text-sm font-medium text-text-primary mb-1.5">MRP / Original Price</label>
              <input id="product-mrp" name="originalPrice" type="number" min="0" value={formData.originalPrice} onChange={handleChange}
                className="input-field font-mono" placeholder="Optional" />
            </div>
            <div>
              <label htmlFor="product-stock" className="block text-sm font-medium text-text-primary mb-1.5">Stock Quantity *</label>
              <input id="product-stock" name="stock" type="number" min="0" value={formData.stock} onChange={handleChange}
                className="input-field font-mono" placeholder="0" required />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Product Images</h3>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {existingImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Upload Zone */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-all">
            <Upload size={28} className="text-text-tertiary mb-2" />
            <p className="text-sm text-text-secondary">Click to upload images</p>
            <p className="text-xs text-text-tertiary mt-1">JPEG, PNG, WebP up to 5MB each</p>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          {/* New Image Previews */}
          {imageFiles.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {imageFiles.map((file, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <img src={URL.createObjectURL(file)} alt={`New upload ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary accent-primary" />
            <div>
              <p className="text-sm font-medium text-text-primary">Mark as Featured</p>
              <p className="text-xs text-text-tertiary">Featured products appear on the homepage.</p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
