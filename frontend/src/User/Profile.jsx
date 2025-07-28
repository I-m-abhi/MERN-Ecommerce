import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import "../UserStyles/Profile.css";
import PageTitle from '../components/PageTitle';
import { useEffect } from 'react';
import Loader from '../components/Loader';

const Profile = () => {
  const {loading, isAuthenticated, user} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=> {
    if(isAuthenticated === false) {
      navigate('/login')
    }
  }, [isAuthenticated])

  if(loading) {
    return <Loader />
  }

  return (
    <div className="profile-container">
      <PageTitle title={`${user.name} Profile`} />
      <div className="profile-image">
        <h1 className="profile-heading">My Profile</h1>
        <img src={user.avatar.url ? user.avatar.url : './images/Profile.png'} alt="User Profile" className='profile-image' />
        <Link to='/profile/update'>Edit Profile</Link>
      </div>
      <div className="profile-details">
        <div className="profile-detail">
          <h2>Username:</h2>
          <p>{user.name}</p>
        </div>
        <div className="profile-detail">
          <h2>Email:</h2>
          <p>{user.email}</p>
        </div>
        <div className="profile-detail">
          <h2>Joined On:</h2>
          <p>{user.createdAt ? String(user.createdAt).substring(0, 10) : 'NA'}</p>
        </div>
      </div>
      <div className="profile-buttons">
        <Link to='/orders/user'>My Orders</Link>
        <Link to='/password/update'>Change Password</Link>
      </div>
    </div>
  )
}

export default Profile;
