import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../api/services';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart({ items: [], totalPrice: 0 });
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartService.getCart();
            console.log('Cart fetched:', response);
            setCart(response || { items: [], totalPrice: 0 });
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart({ items: [], totalPrice: 0 });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await cartService.addToCart(productId, quantity);
            console.log('Item added to cart:', response);
            setCart(response);
            toast.success('Added to cart!');
        } catch (error) {
            console.error('Add to cart error:', error);
            toast.error(error.message || 'Failed to add to cart');
            throw error;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await cartService.updateCartItem(productId, quantity);
            console.log('Cart updated:', response);
            setCart(response);
        } catch (error) {
            console.error('Update quantity error:', error);
            toast.error(error.message || 'Failed to update quantity');
            throw error;
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await cartService.removeFromCart(productId);
            console.log('Item removed:', response);
            setCart(response);
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Remove item error:', error);
            toast.error(error.message || 'Failed to remove item');
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            const response = await cartService.clearCart();
            console.log('Cart cleared:', response);
            setCart(response || { items: [], totalPrice: 0 });
        } catch (error) {
            console.error('Clear cart error:', error);
            toast.error(error.message || 'Failed to clear cart');
            throw error;
        }
    };

    const getCartCount = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
        cartCount: getCartCount(),
        cartTotal: cart?.totalPrice || 0
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
