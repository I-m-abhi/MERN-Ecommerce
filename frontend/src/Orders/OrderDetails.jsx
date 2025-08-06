import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import '../OrderStyles/OrderDetails.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, removeError } from '../features/order/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const OrderDetails = () => {
  const { id } = useParams();
  const { loading, error, order } = useSelector(state => state.order);
  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    taxPrice,
    shippingPrice,
    itemsPrice,
    paidAt
  } = order;
  const paymentStatus = paymentInfo?.status === 'succeeded' ? 'Paid' : 'Not Paid';
  const finalOrderStatus = paymentStatus === 'Not Paid' ? 'Cancelled' : orderStatus;
  const orderStatusClass = finalOrderStatus === 'Delivered' ? 'status-tag delivered' : `status-tag ${finalOrderStatus.toLowerCase()}`;
  const paymentStatusClass = `pay-tag ${paymentStatus === 'Paid' ? 'paid' : 'not-paid'}`;
  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(getOrderDetails(id))
    if (error) {
      toast.error(error, { autoClose: 3000 })
      dispatch(removeError())
    }
  }, [dispatch, error, id])

  return (
    <>
      <PageTitle title={id} />
      <Navbar />
      {loading ?
        (<Loader />)
        :
        (<div className="order-box">
          {/* Order Item Table */}
          <div className="table-block">
            <h2 className="table-title">Order Items</h2>
            <table className="table-main">
              <thead>
                <tr>
                  <th className="head-cell">Image</th>
                  <th className="head-cell">Name</th>
                  <th className="head-cell">Quantity</th>
                  <th className="head-cell">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr className="table-row" key={item.name}>
                    <td className="table-cell">
                      <img src={item.image} alt={item.name} className='item-img' />
                    </td>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.quantity}</td>
                    <td className="table-cell">{item.price}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
          {/* Shipping Info Table */}
          <div className="table-block">
            <h2 className="table-title">Shipping Info</h2>
            <table className="table-main">
              <tbody>
                <tr className='table-row'>
                  <th className="table-cell">Address</th>
                  <td className="table-cell">{`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}, ${shippingInfo.pinCode}`}</td>
                </tr>
                <tr className='table-row'>
                  <th className="table-cell">Phone</th>
                  <td className="table-cell">{shippingInfo.phoneNo}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Order Summary Table */}
          <div className="table-block">
            <h2 className="table-title">Order Summary</h2>
            <table className="table-main">
              <tbody>
                <tr className="table-row">
                  <th className="table-cell">Order Status</th>
                  <td className="table-cell">
                    <span className={orderStatusClass}>{finalOrderStatus}</span>
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Payment Status</th>
                  <td className="table-cell">
                    <span className={paymentStatusClass}>{paymentStatus}</span>
                  </td>
                </tr>
                {paidAt && (<tr className="table-row">
                  <th className="table-cell">Paid At</th>
                  <td className="table-cell">
                    {new Date(paidAt).toLocaleString()}
                  </td>
                </tr>)}
                <tr className="table-row">
                  <th className="table-cell">Items Price</th>
                  <td className="table-cell">
                    {itemsPrice}
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Tax Price</th>
                  <td className="table-cell">
                    {taxPrice}
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Shipping Price</th>
                  <td className="table-cell">
                    {shippingPrice}
                  </td>
                </tr>
                <tr className="table-row">
                  <th className="table-cell">Total Price</th>
                  <td className="table-cell">
                    {totalPrice}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>)}
    </>
  )
}

export default OrderDetails;
