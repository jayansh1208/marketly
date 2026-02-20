import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../api/services';
import { formatDate, formatPrice, getStatusColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getMyOrders();
            setOrders(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

    if (orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <EmptyState
                    icon="📦"
                    title="No orders yet"
                    message="Start shopping to place your first order"
                    action={
                        <Link to="/products" className="btn-primary">
                            Browse Products
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Order History</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        key={order._id}
                        to={`/orders/${order._id}`}
                        className="card block hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Items</p>
                                <p className="font-semibold">{order.orderItems.length} product(s)</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment</p>
                                <p className={`font-semibold ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                                    {order.isPaid ? 'Paid' : (order.paymentMethod === 'cod' ? 'COD (Pending)' : 'Unpaid')}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
