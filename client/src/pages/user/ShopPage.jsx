import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, ShoppingCart, SlidersHorizontal, X, Package } from 'lucide-react';
import { productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice, getDiscount, CATEGORIES } from '../../utils/helpers';
import { ProductSkeleton } from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = Number(searchParams.get('page') || 1);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
      };
      if (currentCategory) params.category = currentCategory;
      if (currentSearch) params.search = currentSearch;
      if (currentSort) params.sort = currentSort;

      const res = await productAPI.getAll(params);
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      return;
    }
    try {
      await addToCart(productId);
      toast.success('Added to cart.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const hasFilters = currentCategory || currentSearch || currentSort;

  return (
    <div className="page-container py-8 md:py-12 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="section-title">
          {currentSearch ? `Results for "${currentSearch}"` : currentCategory || 'All Products'}
        </h1>
        <p className="text-text-secondary mt-2">
          Showing {pagination.total} product{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <FilterContent
              currentCategory={currentCategory}
              currentSort={currentSort}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              hasFilters={hasFilters}
            />
          </div>
        </aside>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setFilterOpen(true)}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 btn-primary flex items-center gap-2 shadow-lg"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        {/* Mobile Filter Overlay */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg">Filters</h3>
                <button onClick={() => setFilterOpen(false)} className="text-text-tertiary hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <FilterContent
                currentCategory={currentCategory}
                currentSort={currentSort}
                updateFilter={(k, v) => { updateFilter(k, v); setFilterOpen(false); }}
                clearFilters={() => { clearFilters(); setFilterOpen(false); }}
                hasFilters={hasFilters}
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="mx-auto text-text-tertiary mb-4" strokeWidth={1} />
              <h3 className="font-serif text-xl text-text-primary mb-2">No products found</h3>
              <p className="text-text-secondary text-sm mb-6">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ShopProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    showAddToCart={isAuthenticated && !isAdmin}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pagination.current === i + 1
                          ? 'bg-primary text-white'
                          : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterContent({ currentCategory, currentSort, updateFilter, clearFilters, hasFilters }) {
  return (
    <>
      {/* Categories */}
      <div>
        <h4 className="label-text mb-3">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilter('category', '')}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !currentCategory ? 'bg-primary-light text-primary font-medium' : 'text-text-secondary hover:bg-background-secondary'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                currentCategory === cat ? 'bg-primary-light text-primary font-medium' : 'text-text-secondary hover:bg-background-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="label-text mb-3">Sort By</h4>
        <select
          value={currentSort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="input-field text-sm"
        >
          <option value="">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearFilters} className="text-sm text-error hover:underline">
          Clear all filters
        </button>
      )}
    </>
  );
}

function ShopProductCard({ product, onAddToCart, showAddToCart }) {
  const discount = getDiscount(product.price, product.originalPrice);

  return (
    <Link to={`/product/${product._id}`} className="card group overflow-hidden">
      <div className="product-image-zoom relative aspect-[4/3] bg-background-secondary">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <Package size={40} strokeWidth={1} />
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-error text-white text-xs font-semibold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="label-text text-xs mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(product.ratings) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
          ))}
          <span className="text-xs text-text-tertiary ml-1">({product.numReviews})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-base font-semibold text-text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-mono text-xs text-text-tertiary line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {showAddToCart && (
          <button
            onClick={(e) => onAddToCart(e, product._id)}
            className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
