import { useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Rating from "../components/Rating";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails, removeErrors } from "../features/products/productSlice";
import "../pageStyles/ProductDetails.css";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { addItemsToCart, removeMessages } from "../features/cart/cartSlice";

const ProductDetails = () => {
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const handleRatingChange = (newRating) => {
    setUserRating(newRating)
  }
  const { loading, error, product } = useSelector((state) => state.product);
  const { loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id))
    }
    return () => {
      dispatch(removeErrors());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      toast.error(error.message, {autoClose: 3000})
      dispatch(removeErrors())
    }
    if (cartError) {
      toast.error(cartError, {autoClose: 3000})
    }
  }, [dispatch, error, cartError])

  useEffect(() => {
    if (success) {
      toast.success(message, {autoClose:3000})
      dispatch(removeMessages())
    }
  }, [dispatch, success, message])

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error('Quantity cannot less than 1', { autoClose: 3000 })
      return;
    }
    setQuantity((preQuan) => preQuan - 1)
  }
  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error('cannot exceede available stock', { autoClose: 3000 })
      return;
    }
    setQuantity((preQuan) => preQuan + 1)
  }

  const addToCart = ()=> {
    dispatch(addItemsToCart({id, quantity}))
  }

  if (!product) {
    return <Loader />
  }

  return (
    <>
      <PageTitle title={`${product.name} - Details`} />
      <Navbar />
      {product &&
        <div className="product-details-container">
          <div className="product-detail-container">
            <div className="product-image-container">
              <img src={product.images[0].url} alt={product.name} className="product-detail-image" />
            </div>

            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: {product.price}</p>
              <div className="product-rating">
                <Rating
                  value={product.ratings}
                  disabled={true}
                />
                <span className="productCardSpan">({product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"})</span>
              </div>

              <div className="stock-status">
                <span className={product.stock > 0 ? `in-stock` : `out-of-stock`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : `Out of Stock`}
                </span>
              </div>

              {product.stock > 0 &&
                <>
                  <div className="quantity-controls">
                    <span className="quantity-label">Quantity:</span>
                    <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                    <input type="text" value={quantity} className="quantity-value" readOnly />
                    <button className="quantity-button" onClick={increaseQuantity}>+</button>
                  </div>

                  <button className="add-to-cart-btn" onClick={addToCart} disabled={cartLoading}>{cartLoading ? 'Adding' : 'Add to Cart'}</button>
                </>
              }

              <form className="review-form">
                <h3>Write a review</h3>
                <Rating
                  value={0}
                  disabled={false}
                  onRatingChange={handleRatingChange}
                />
                <textarea placeholder="Write your review here..." className="review-input"></textarea>
                <button className="submit-review-btn">Submit Review</button>
              </form>
            </div>
          </div>

          <div className="reviews-container">
            <h3>Customer Reviews</h3>
            {
              product.reviews && product.reviews.length > 0 ?

                (<div className="reviews-section">
                  {product.reviews.map((review) => (
                    <div className="review-item" key={review._id}>
                      <div className="review-header">
                        <Rating value={review.rating} disabled={true} />
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <p className="review-name">By {review.name}</p>
                    </div>
                  ))}
                </div>) :
                (<p className="no-reviews">No reviews yet. Be the first to review this product!</p>)
            }
          </div>
        </div>
      }
    </>
  )
};

export default ProductDetails;