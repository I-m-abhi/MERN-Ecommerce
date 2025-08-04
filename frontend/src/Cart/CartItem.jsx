import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addItemsToCart, removeErrors, removeMessages, removeItemFromCart } from "../features/cart/cartSlice";

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity)
  const { loading, error, success, message, cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error('Quantity cannot less than 1', { autoClose: 3000 })
      return;
    }
    setQuantity((qty) => qty - 1)
  }
  const increaseQuantity = () => {
    if (item.stock <= quantity) {
      toast.error('cannot exceede available stock', { autoClose: 3000 })
      return;
    }
    setQuantity((qty) => qty + 1)
  }
  const handleUpdate = () => {
    if (loading) return;
    if (quantity !== item.quantity) {
      dispatch(addItemsToCart({ id: item.product, quantity }));
    }
  }
  const handleRemove = (id) => {
    if (loading) return;
    dispatch(removeItemFromCart(item.product))
    toast.success(`${item.name} removed from cart successfull`, { autoClose: 3000, toastId: 'cart-removeItem' })
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 3000, toastId: 'cart-error' })
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (success) {
      toast.success(message, { autoClose: 3000, toastId: 'cart-update' })
      dispatch(removeMessages())
    }
  }, [dispatch, success, message])

  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={item.image} alt="Product image" className='item-image' />
        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-quantity"><strong>Price: </strong>{item.price} /-</p>
          <p className="item-quantity"><strong>Quantity: </strong>{item.quantity}</p>
        </div>
      </div>

      <div className="quantity-controls">
        <button
          className="quantity-button decrease-btn"
          onClick={decreaseQuantity}
        >-
        </button>
        <input type="number" value={quantity} className="quantity-input" readOnly min='1' />
        <button
          className="quantity-button increase-btn"
          onClick={increaseQuantity}
        >+
        </button>
      </div>

      <div className="item-total">
        <span className="item-total-price">{(item.price * item.quantity).toFixed(2)} /-</span>
      </div>

      <div className="item-actions">
        <button
          className="update-item-btn"
          disabled={loading || item.quantity === quantity}
          onClick={handleUpdate}
        >Update
        </button>
        <button
          className="remove-item-btn"
          disabled={loading}
          onClick={() => handleRemove(item.product)}
        >Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem;
