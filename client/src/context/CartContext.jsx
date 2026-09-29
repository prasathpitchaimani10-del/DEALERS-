import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      const cartData = response.data.data.cart;
      setCart(cartData);
      setCartCount(cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch {
      setCart({ items: [], totalAmount: 0 });
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    const response = await cartAPI.add({ productId, quantity });
    const cartData = response.data.data.cart;
    setCart(cartData);
    setCartCount(cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    return response.data;
  };

  const updateQuantity = async (productId, quantity) => {
    const response = await cartAPI.update({ productId, quantity });
    const cartData = response.data.data.cart;
    setCart(cartData);
    setCartCount(cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    return response.data;
  };

  const removeFromCart = async (productId) => {
    const response = await cartAPI.remove(productId);
    const cartData = response.data.data.cart;
    setCart(cartData);
    setCartCount(cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    return response.data;
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart({ items: [], totalAmount: 0 });
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{
      cart, cartCount, loading,
      fetchCart, addToCart, updateQuantity, removeFromCart, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
