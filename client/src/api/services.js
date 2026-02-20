import api from './axios';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

export const productService = {
    getProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data.data; // Extract products array from {success, count, data}
    },

    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data.data; // Extract single product from {success, data}
    },

    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data.data; // Extract created product from {success, data}
    },

    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data.data; // Extract updated product from {success, data}
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};

export const cartService = {
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data.data;
    },

    addToCart: async (productId, quantity) => {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data.data;
    },

    updateCartItem: async (productId, quantity) => {
        const response = await api.put('/cart/update', { productId, quantity });
        return response.data.data;
    },

    removeFromCart: async (productId) => {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data.data;
    },

    clearCart: async () => {
        const response = await api.delete('/cart/clear');
        return response.data.data;
    }
};

export const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders/myorders');
        return response.data.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data.data;
    },

    getAllOrders: async () => {
        const response = await api.get('/orders');
        return response.data.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, { orderStatus: status });
        return response.data.data;
    }
};

export const paymentService = {
    createPaymentIntent: async (amount) => {
        const response = await api.post('/payment/create-payment-intent', { amount });
        return response.data;
    }
};
