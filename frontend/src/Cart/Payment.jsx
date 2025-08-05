import { Link } from 'react-router-dom';
import '../CartStyles/Payment.css';
import CheckoutPath from './CheckoutPath';

const Payment = () => {
  const orderItem = JSON.parse(sessionStorage.getItem('orderItem'))
  return (
    <>
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to='/order/confirm' className='payment-go-back'>Go Back</Link>
        <button className="payment-btn">Pay ({orderItem.total})</button>
      </div>
    </>
  )
}

export default Payment;
