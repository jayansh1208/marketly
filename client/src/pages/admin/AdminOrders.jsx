import { useState, useEffect } from 'react';
import { orderService } from '../../api/services';
import { formatDate, formatPrice, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="card">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                <p className="text-sm text-gray-700 mt-2">
                                    Customer: {order.user?.name} ({order.user?.email})
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                                <p className="font-semibold text-green-600">Paid</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Shipping</p>
                                <p className="font-semibold text-sm">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={order.orderStatus}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="input-field flex-1"
                            >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
