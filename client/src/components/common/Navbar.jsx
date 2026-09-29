import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, ChevronDown, Heart, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav border-b border-border">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="font-serif text-xl md:text-2xl text-text-primary hover:text-primary transition-colors">
            The Curated Store
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Shop
            </Link>
            <Link to="/offers" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
              <Tag size={14} /> Offers
            </Link>
            {isAuthenticated && !isAdmin && (
              <Link to="/my-orders" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                My Orders
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 md:w-64 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-all"
                    autoFocus
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="ml-2 text-text-tertiary hover:text-text-primary">
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 text-text-secondary hover:text-text-primary transition-colors" aria-label="Search products">
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Wishlist */}
            {isAuthenticated && !isAdmin && (
              <Link to="/wishlist" className="p-2 text-text-secondary hover:text-red-500 transition-colors" aria-label="View wishlist">
                <Heart size={20} />
              </Link>
            )}

            {/* Cart */}
            {isAuthenticated && !isAdmin && (
              <Link to="/cart" className="relative p-2 text-text-secondary hover:text-text-primary transition-colors" aria-label="View cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`hidden md:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-lg py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary truncate">{user?.fullName}</p>
                      <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
                    </div>
                    {isAdmin ? (
                      <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors">
                        <Package size={16} /> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link to="/my-orders" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors">
                          <Package size={16} /> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors">
                          <Heart size={16} /> Wishlist
                        </Link>
                        <Link to="/offers" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors">
                          <Tag size={16} /> Offers & Coupons
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors">
                Home
              </Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors">
                Shop
              </Link>
              <Link to="/offers" onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors flex items-center gap-2">
                <Tag size={14} /> Offers & Coupons
              </Link>
              {isAuthenticated && !isAdmin && (
                <>
                  <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors flex items-center gap-2">
                    <Heart size={14} /> Wishlist
                  </Link>
                  <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-colors">
                    My Orders
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
