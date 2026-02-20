import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../api/services';
import { formatDate, formatPrice, getStatusColor } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await orderService.getOrderById(id);
            setOrder(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    if (!order) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Order Details</h1>

            <div className="space-y-6">
                {/* Order Info */}
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-semibold">{order._id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>

                {/* Shipping Address */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p>Phone: {order.shippingAddress.phone}</p>
                </div>

                {/* Order Items */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex gap-4 border-b pb-4 last:border-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-primary-600 font-bold">{formatPrice(item.price)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment Status</span>
                            <span className={order.isPaid ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                                {order.isPaid ? 'Paid' : (order.paymentMethod === 'cod' ? 'COD (Pending)' : 'Unpaid')}
                            </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatPrice(order.totalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
