import { useNavigate } from "react-router-dom";
import "../UserStyles/UserDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, removeSuccess } from "../features/user/userSlice";
import { useState } from "react";

const UserDashboard = ({ user }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const {cartItems} = useSelector((state)=>state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const options = [
    { name: 'Orders', funcName: orders },
    { name: 'Account', funcName: profile },
    { name: `Cart(${cartItems.length})`, funcName: cart, isCart: true },
    { name: 'Logout', funcName: logoutUser },
  ]
  if (user.role === "admin") {
    options.unshift(
      { name: 'Admin Dashboard', funcName: dashboard },
    )
  }
  // console.log(menuVisible)

  function orders() {
    navigate("/my/orders")
  }
  function profile() {
    navigate("/profile")
  }
  function logoutUser() {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Logout Successful")
        dispatch(removeSuccess())
        navigate('/login')
      }).catch((error) => {
        toast.error(error.message) || "Logout Failed"
      })
  }
  function cart() {
    navigate("/cart")
  }
  function dashboard() {
    navigate("/admin/dashboard")
  }

  return (
    <>
    <div className={`overlay ${menuVisible ? 'show' : ''}`} onClick={toggleMenu}></div>
      <div className="dashboard-container">
        <div className="profile-header" onClick={toggleMenu}>
          <img
            src={user.avatar.url ? user.avatar.url : "/images/Profile.png"}
            alt="Profile Picture"
            className="profile-avatar"
          />
          <span className="profile-name">{user.name || 'User'}</span>
        </div>
        {menuVisible && <div className="menu-options">
          {options.map((item) => (
            <button
              key={item.name}
              className={`menu-option-btn ${item.isCart ? (cartItems.length > 0 ? 'cart-not-empty' : '') : ''}`}
              onClick={item.funcName}
            >{item.name}</button>
          ))}
        </div>}
      </div>
    </>
  )
}

export default UserDashboard;
