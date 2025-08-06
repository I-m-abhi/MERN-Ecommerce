import { Link, useSearchParams } from 'react-router-dom';
import '../CartStyles/PaymentSuccess.css';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { createOrder, removeError, removeSuccess } from '../features/order/orderSlice';
import { clearCart } from '../features/cart/cartSlice';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const { cartItems, shippingInfo } = useSelector(state => state.cart)
  const { success, error, loading } = useSelector(state => state.order)
  const dispatch = useDispatch();

  useEffect(() => {
    const createOrderData = async () => {
      try {
        const orderItem = JSON.parse(sessionStorage.getItem('orderItem'))
        if (!orderItem) return;
        const orderData = {
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pincode,
            phoneNo: shippingInfo.phoneNumber,
          },
          orderItems: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: 'succeeded',
          },
          itemsPrice: orderItem.subTotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shippingPrice,
          totalPrice: orderItem.total,
        }
        dispatch(createOrder(orderData))
        sessionStorage.removeItem('orderItem')
      } catch (error) {
        console.log('Order Creation Error', error.message)
        toast.error(error.message || 'Order Creation Error', { autoClose: 3000 })
      }
    }

    createOrderData()
  }, [reference, dispatch])

  useEffect(() => {
    if (success) {
      toast.success('Order Placed', { autoClose: 3000 })
      dispatch(removeSuccess())
      dispatch(clearCart())
    }
  }, [dispatch, success])

  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 3000 })
      dispatch(removeError())
    }
  }, [dispatch, error])

  return (
    <>
      <Navbar />
      <div className="payment-success-container">
        <div className="success-content">
          <div className="success-icon">
            <div className="checkmark"></div>
          </div>
          <h1>Order Confirmed</h1>
          <p>Your payment was successful. Reference ID <strong>{reference}</strong></p>
          <Link to='/orders/user' className='explore-btn'>View Orders</Link>
        </div>
      </div>
    </>
  )
}

export default PaymentSuccess;
