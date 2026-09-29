import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Minus, Plus, ChevronRight, Package, Heart, Award, Camera, Trash2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { productAPI, reviewAPI, wishlistAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice, getDiscount, formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewDistribution, setReviewDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
    loadReviews();
    if (isAuthenticated && !isAdmin) checkWishlist();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getById(id);
      setProduct(res.data.data.product);
    } catch {
      toast.error('Product not found.');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await reviewAPI.getByProduct(id);
      setReviews(res.data.data.reviews);
      setReviewDistribution(res.data.data.distribution);
    } catch {
      // Silently fail
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await wishlistAPI.get();
      const products = res.data.data.wishlist.products || [];
      setInWishlist(products.some(p => p._id === id));
    } catch {
      // Silently fail
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items.');
      navigate('/login');
      return;
    }
    try {
      if (inWishlist) {
        await wishlistAPI.remove(id);
        setInWishlist(false);
        toast.success('Removed from wishlist.');
      } else {
        await wishlistAPI.add(id);
        setInWishlist(true);
        toast.success('Added to wishlist.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist.');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue.');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      navigate('/cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a review comment.');
      return;
    }
    setSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append('rating', reviewForm.rating);
      formData.append('title', reviewForm.title);
      formData.append('comment', reviewForm.comment);
      reviewPhotos.forEach(file => formData.append('photos', file));

      await reviewAPI.add(id, formData);
      toast.success('Review submitted successfully.');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      setReviewPhotos([]);
      loadReviews();
      loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewAPI.delete(reviewId);
      toast.success('Review deleted.');
      loadReviews();
      loadProduct();
    } catch {
      toast.error('Failed to delete review.');
    }
  };

  if (loading) return <Loader text="Loading product details..." />;
  if (!product) return null;

  const discount = getDiscount(product.price, product.originalPrice);
  const inStock = product.stock > 0;
  const totalReviews = reviews.length;

  return (
    <div className="page-container py-8 md:py-12 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-8">
        <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-text-primary transition-colors">Shop</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-text-primary transition-colors">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="aspect-square bg-background-secondary rounded-xl overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                <Package size={80} strokeWidth={1} />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${selectedImage === i ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
                  <img src={img} alt={`${product.name} - view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="label-text text-primary mb-2">{product.brand}</p>
              <h1 className="font-serif text-3xl md:text-4xl text-text-primary tracking-tight-heading">
                {product.name}
              </h1>
            </div>
            {!isAdmin && (
              <button onClick={toggleWishlist}
                className={`p-2.5 rounded-full border transition-all ${inWishlist ? 'border-red-300 bg-red-50 text-red-500' : 'border-border text-text-tertiary hover:text-red-500 hover:border-red-300'}`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                <Heart size={20} className={inWishlist ? 'fill-red-500' : ''} />
              </button>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
              <span className="text-sm font-bold text-green-700">{product.ratings}</span>
              <Star size={14} className="fill-green-600 text-green-600" />
            </div>
            <span className="text-sm text-text-secondary">
              {product.numReviews} reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-mono text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="font-mono text-lg text-text-tertiary line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm font-semibold text-success bg-green-50 px-2 py-0.5 rounded">Save {discount}%</span>
              </>
            )}
          </div>

          {/* Quality Badge */}
          <div className="flex items-center gap-2 mt-4 text-sm">
            <Award size={16} className="text-primary" />
            <span className="text-text-secondary">Quality Verified Product</span>
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {inStock ? (
              <span className="text-sm font-medium text-success">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-sm font-medium text-error">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Description</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity & Actions */}
          {inStock && !isAdmin && (
            <div className="mt-8 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Quantity</label>
                <div className="flex items-center border border-border rounded-lg w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-text-secondary hover:text-text-primary transition-colors" disabled={quantity <= 1}>
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-mono font-medium text-text-primary">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 text-text-secondary hover:text-text-primary transition-colors" disabled={quantity >= product.stock}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddToCart} disabled={addingToCart}
                  className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {addingToCart ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShoppingCart size={18} />}
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button onClick={handleBuyNow} className="btn-secondary flex-1">Buy Now</button>
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="mt-8 pt-6 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Category</span>
              <span className="text-text-primary font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Brand</span>
              <span className="text-text-primary font-medium">{product.brand}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Payment</span>
              <span className="text-text-primary font-medium">Cash on Delivery</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Rewards</span>
              <span className="text-primary font-medium">Earn {Math.floor(product.price / 100)} credit points</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 pt-12 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Customer Reviews</h2>
          {isAuthenticated && !isAdmin && (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-secondary text-sm">
              Write a Review
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Rating Summary */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="text-center mb-6">
              <p className="font-mono text-4xl font-bold text-text-primary">{product.ratings}</p>
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < Math.floor(product.ratings) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-sm text-text-secondary mt-2">{totalReviews} reviews</p>
            </div>
            {/* Distribution bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewDistribution[star] || 0;
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3 text-text-secondary">{star}</span>
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-background-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs text-text-tertiary">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-surface border border-border rounded-xl p-6 mb-6 animate-fade-in">
                <h3 className="font-serif text-lg text-text-primary mb-4">Write Your Review</h3>
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Your Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-110">
                          <Star size={28} className={star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="review-title" className="block text-sm font-medium text-text-primary mb-1.5">Title (optional)</label>
                    <input id="review-title" value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="input-field" placeholder="Summarize your experience" />
                  </div>
                  <div>
                    <label htmlFor="review-comment" className="block text-sm font-medium text-text-primary mb-1.5">Your Review</label>
                    <textarea id="review-comment" value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="input-field min-h-[100px] resize-y" placeholder="Share your experience with this product..." required />
                  </div>
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Photos (optional, max 3)</label>
                    <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors w-fit">
                      <Camera size={16} className="text-text-tertiary" />
                      <span className="text-sm text-text-secondary">Add photos</span>
                      <input type="file" multiple accept="image/*" className="hidden"
                        onChange={(e) => setReviewPhotos(Array.from(e.target.files).slice(0, 3))} />
                    </label>
                    {reviewPhotos.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {reviewPhotos.map((file, i) => (
                          <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                            <img src={URL.createObjectURL(file)} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={submittingReview} className="btn-primary flex items-center gap-2">
                      {submittingReview && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              </form>
            )}

            {/* Review Cards */}
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-surface border border-border rounded-xl">
                <Star size={36} className="mx-auto text-text-tertiary mb-3" strokeWidth={1} />
                <p className="text-sm text-text-tertiary">No reviews yet. Be the first to review this product.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-surface border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                          <User size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{review.userId?.fullName || 'Customer'}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                              ))}
                            </div>
                            {review.isVerifiedPurchase && (
                              <span className="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Verified Purchase</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-tertiary">{formatDate(review.createdAt)}</span>
                        {user && (review.userId?._id === user._id || user.role === 'admin') && (
                          <button onClick={() => handleDeleteReview(review._id)}
                            className="p-1 text-text-tertiary hover:text-error transition-colors" aria-label="Delete review">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {review.title && <p className="text-sm font-semibold text-text-primary mb-1">{review.title}</p>}
                    <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                    {/* Review Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.photos.map((photo, i) => (
                          <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                            <img src={photo} alt={`Review photo ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
