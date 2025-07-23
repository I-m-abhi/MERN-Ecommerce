import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";

export const createOrder = handleAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  })
  res.status(201).json({
    success: true,
    message: "Order Created Successfully",
    order
  })
})

export const getOrderDetails = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    return next(new HandleError("Order not found", 404));
  }
  res.status(200).json({
    success: true,
    order
  })
})

export const getMyOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders) {
    return next(new HandleError("No orders found", 404));
  }
  res.status(200).json({
    success: true,
    orders
  })
})

export const getAllOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");
  if (!orders) {
    return next(new HandleError("No orders found", 404));
  }
  let totalAmount = 0;
  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount
  })
})

export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("Order not found", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new HandleError("Order already delivered", 400));
  }
  await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)))
  order.orderStatus = req.body.status;
  if (order.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    sucess: true,
    message: "Order status updated successfully",
    order
  })
})

async function updateQuantity (productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {   
    throw new HandleError("Product not found", 404);
  } 
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

export const deleteOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("Order not found", 404));
  }
  if (order.orderStatus !== "Delivered") {
    return next(new HandleError(`Order Cannot be deleted with status: ${order.orderStatus}`, 400));
  }
  await order.deleteOne({_id: req.params.id});
  res.status(200).json({
    success: true,
    message: "Order deleted successfully"
  })
})