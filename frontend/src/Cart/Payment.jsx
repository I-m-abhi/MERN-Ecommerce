import { Link, useNavigate } from 'react-router-dom';
import '../CartStyles/Payment.css';
import CheckoutPath from './CheckoutPath';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Payment = () => {
  const orderItem = JSON.parse(sessionStorage.getItem('orderItem'))
  const { user } = useSelector((state) => state.user);
  const { shippingInfo } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  if (!window.Razorpay) {
  console.error("Razorpay SDK not loaded ❌");
}

  const completePayment = async (amount) => {
    try {
      const { data: keyData } = await axios.get('/api/v1/getKey');
      const { key } = keyData;
      const { data: orderData } = await axios.post('/api/v1/process/payment', { amount });
      const { order } = orderData;
      console.log(key, "key")
      console.log("order", order)
      console.log("amount", amount)

      // Open Razorpay Checkout
      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'MERN_Ecommerce_Abhi',
        description: 'Ecommerce website Payment Transation',
        order_id: order.id,
        handler: async function (response) {
          console.log('✅ Razorpay handler STARTED');
          console.log('Response from Razorpay:', response);

          try {
            if (!response || !response.razorpay_payment_id) {
              console.error('❌ Missing payment ID in response!');
              return alert('Payment failed or incomplete.');
            }

            console.log('🔄 Sending payment verification request...');

            const { data } = await axios.post('/api/v1/payment-verification', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            console.log('✅ Payment verification response:', data);

            if (data.success) {
              navigate(`/paymentSuccess?reference=${data.reference}`);
            } else {
              alert('❌ Payment verification failed');
            }
          } catch (err) {
            console.error('🔥 Error inside handler:', err);
            alert('Something went wrong during payment verification.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNumber
        },
        theme: {
          color: '#3399cc'
        },
      };

      const rzp = new Razorpay(options)
      rzp.open();
    } catch (error) {
      console.log('Payment Error', error)
    }
  }

  return (
    <>
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to='/order/confirm' className='payment-go-back'>Go Back</Link>
        <button
          className="payment-btn"
          onClick={() => completePayment(orderItem.total)}
        >Pay ({orderItem.total})
        </button>
      </div>
    </>
  )
}

export default Payment;
