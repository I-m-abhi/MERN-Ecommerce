import { useSelector } from 'react-redux';
import '../CartStyles/OrderConfirm.css';
import CheckoutPath from './CheckoutPath';
import { useNavigate } from 'react-router-dom';

const OrderConfirm = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subTotal * 0.18;
  const shippingPrice = subTotal > 500 ? 0 : 50;
  const total = subTotal + tax + shippingPrice;
  const navigate = useNavigate();

  const proceedToPayment = ()=> {
    const data = {
      subTotal,
      tax,
      shippingPrice,
      total
    }
    sessionStorage.setItem('orderItem', JSON.stringify(data))
    navigate('/process/payment')
  }

  return (
    <>
      <CheckoutPath activePath={1} />
      <div className="confirm-container">
        <h1 className="confirm-header">Order Confirmation</h1>
        <div className="confirm-table-container">
          <table className="confirm-table">
            <caption>Shipping Details</caption>
            <thead>
              <tr>
                <th>Nane</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.name}</td>
                <td>{shippingInfo.phoneNumber}</td>
                <td>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}-{shippingInfo.pincode}</td>
              </tr>
            </tbody>
          </table>

          <table className="confirm-table cart-table">
            <caption>Cart Items</caption>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product}>
                  <td><img src={item.images} alt={item.name} className="product-image" /></td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="confirm-table">
            <caption>Order Summary</caption>
            <thead>
              <tr>
                <th>Subtotal</th>
                <th>Shipping Charges</th>
                <th>GST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{subTotal}</td>
                <td>{shippingPrice}</td>
                <td>{tax}</td>
                <td>{total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="proceed-button" onClick={proceedToPayment}>Proceed to Payment</button>
      </div>
    </>
  )
}

export default OrderConfirm;
