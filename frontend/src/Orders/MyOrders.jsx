import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import '../OrderStyles/MyOrders.css';
import { LaunchOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllMyOrders, removeError } from '../features/order/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const MyOrders = () => {
  const { loading, error, orders } = useSelector(state => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMyOrders())
    if (error) {
      toast.error(error, { autoClose: 3000 })
      dispatch(removeError())
    }
  }, [dispatch, error])

  return (
    <>
      <Navbar />
      <PageTitle title='User Order' />
      {loading ?
        (<Loader />)
        :
        orders.length > 0 ?
          (<div className="my-orders-container">
            <h1>My Orders</h1>
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Items Count</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>View Order</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.orderItems.length}</td>
                      <td>{order.orderStatus}</td>
                      <td>{order.totalPrice}</td>
                      <td><Link className='order-link' to={`/order/${order._id}`}><LaunchOutlined /></Link></td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)
          :
          (<div className="no-orders">
            <p className="no-order-message">No Orders Found</p>
          </div>)
      }
    </>
  )
}

export default MyOrders;
