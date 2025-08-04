import { Link } from 'react-router-dom';
import '../CartStyles/Cart.css';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);

  const subTotal = cartItems.reduce((acc,item)=>acc + item.price * item.quantity,0);
  const tax = subTotal * 0.18;
  const shippingPrice = subTotal > 500 ? 0 : 50;
  const total = subTotal + tax + shippingPrice;

  return (
    <>
      {cartItems.length === 0 ?
        (<div className="empty-cart-container">
          <p className="empty-cart-message">Your cart is empty</p>
          <Link to='/products' className='viewProducts'>View Products</Link>
        </div>)
        :
        (<div className="cart-page">
          <div className="cart-items">
            <div className="cart-items-heading">Your Cart</div>
            <div className="cart-table">
              <div className="cart-table-header">
                <div className="header-product">Product</div>
                <div className="header-quantity">Quantity</div>
                <div className="header-total item-total-heading">Item Total</div>
                <div className="header-action">Actions</div>
              </div>

              {/* Cart Items */}
              {cartItems && cartItems.map((item) => <CartItem key={item.product} item={item} />)}
            </div>
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <h3 className="price-summary-heading">Price Summary</h3>
            <div className="summary-item">
              <p className="summary-label">Sub total:</p>
              <p className="summary-value">{subTotal}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Tax (18%):</p>
              <p className="summary-value">{tax}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Shipping:</p>
              <p className="summary-value">{shippingPrice}</p>
            </div>
            <div className="summary-total">
              <p className="total-label">Total:</p>
              <p className="total-value">{total}</p>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>)}
    </>
  )
}

export default Cart;