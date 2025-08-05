import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Country, State, City } from 'country-state-city';
import { saveShippingInfo } from '../features/cart/cartSlice';
import CheckoutPath from './CheckoutPath';
import '../CartStyles/Shipping.css';

const Shipping = () => {
  const { shippingInfo } = useSelector((state) => state.cart);
  const [shipping, setShipping] = useState({
    address: shippingInfo.address || "",
    pincode: shippingInfo.pincode || "",
    phoneNumber: shippingInfo.phoneNumber || "",
    country: shippingInfo.country || "",
    state: shippingInfo.state || "",
    city: shippingInfo.city || ""
  })
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'country') {
      setShipping((prev) => ({ ...prev, [name]: value, ['state']: '', ['city']: '' }));
    } else if (name === "state") {
      setShipping((prev) => ({ ...prev, [name]: value, ['city']: '' }));
    } else {
      setShipping((prev) => ({ ...prev, [name]: value }));
    }
  }
  const handleShippingSubmit = (e) => {
    e.preventDefault()
    // Authorization for form field
    dispatch(saveShippingInfo(shipping))
    navigate('/order/confirm')
  }

  return (
    <>
      <CheckoutPath activePath={0} />
      <div className="shipping-form-container">
        <h1 className="shipping-form-header">Shipping Details</h1>
        <form className="shipping-form" onSubmit={handleShippingSubmit}>
          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id='address'
                name='address'
                value={shipping.address}
                onChange={handleChange}
                placeholder='Enter your address'
              />
            </div>

            <div className="shipping-form-group">
              <label htmlFor="pincode">Pin Code</label>
              <input
                type="number"
                id='pincode'
                name='pincode'
                value={shipping.pincode}
                onChange={handleChange}
                placeholder='Enter your pincode'
              />
            </div>

            <div className="shipping-form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id='phoneNumber'
                name='phoneNumber'
                value={shipping.phoneNumber}
                onChange={handleChange}
                placeholder='Enter your number'
              />
            </div>
          </div>

          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="country">Country</label>
              <select
                name="country"
                id="country"
                value={shipping.country}
                onChange={handleChange}>
                <option value="">Select a Country</option>
                {Country && Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                ))}
              </select>
            </div>

            {shipping.country && <div className="shipping-form-group">
              <label htmlFor="state">State</label>
              <select
                name="state"
                id="state"
                value={shipping.state}
                onChange={handleChange}>
                <option value="">Select a State</option>
                {State && State.getStatesOfCountry(shipping.country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                ))}
              </select>
            </div>}

            {shipping.state && <div className="shipping-form-group">
              <label htmlFor="city">City</label>
              <select
                name="city"
                id="city"
                value={shipping.city}
                onChange={handleChange}>
                <option value="">Select a City</option>
                {City && City.getCitiesOfState(shipping.country, shipping.state).map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>}
          </div>

          <button className="shipping-submit-btn">Continue</button>
        </form>
      </div>
    </>
  )
}

export default Shipping;
