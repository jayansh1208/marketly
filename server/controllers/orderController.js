const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        console.log('=== ORDER CREATION REQUEST ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const { orderItems, shippingAddress, paymentMethod, paymentResult, totalPrice, isPaid, paidAt } = req.body;

        if (!orderItems || orderItems.length === 0) {
            console.log('ERROR: No order items');
            return res.status(400).json({
                success: false,
                message: 'No order items'
            });
        }

        // Verify stock and reduce quantities
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Handle payment info - support both paymentMethod and paymentResult
        const paymentInfo = paymentMethod || paymentResult || { type: 'cod' };

        // Determine if order is paid based on payment type
        let orderIsPaid = false;
        let orderPaidAt = null;

        if (isPaid !== undefined) {
            orderIsPaid = isPaid;
            orderPaidAt = paidAt || (isPaid ? Date.now() : null);
        } else if (paymentInfo.type === 'cod') {
            orderIsPaid = false;
            orderPaidAt = null;
        } else {
            // Card or UPI payment
            orderIsPaid = true;
            orderPaidAt = Date.now();
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod: typeof paymentInfo === 'string' ? paymentInfo : (paymentInfo.type || 'cod'),
            paymentResult: typeof paymentInfo === 'object' ? paymentInfo : undefined,
            totalPrice,
            isPaid: orderIsPaid,
            paidAt: orderPaidAt
        });

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [], totalPrice: 0 }
        );


        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.orderStatus = orderStatus;

        if (orderStatus === 'Delivered') {
            order.deliveredAt = Date.now();

            // If the order was COD and not paid yet, mark it as paid upon delivery
            if (!order.isPaid && order.paymentMethod === 'cod') {
                order.isPaid = true;
                order.paidAt = Date.now();
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};
