import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess, updateProfile } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Loader from '../components/Loader';

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");

  const { user, error, success, message, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUpdate = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result)
        setAvatar(reader.result)
      }
    }
    reader.onerror = (error) => {
      toast.error("Error reading file");
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name)
    myForm.set("email", email)
    myForm.set("avatar", avatar)
    dispatch(updateProfile(myForm))
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (success) {
      toast.success(message, { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess())
      navigate("/profile")
    }
  }, [dispatch, success])

    useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setAvatarPreview(user.avatar.url || './images/profile.png')
    }
  }, [user])

  if(loading) {
    return <Loader />
  }

  return (
    <div className="container update-container">
      <div className="form-content">
        <form
          className="form"
          encType='multipart/form-data'
          onSubmit={handleUpdateSubmit}
        >
          <h2>Update Profile</h2>
          <div className="input-group avatar-group">
            <input
              type="file"
              name='avatar'
              accept='image/'
              className='file-input'
              onChange={profileImageUpdate}
            />
            <img src={avatarPreview} alt="User Profile" className="avatar" />
          </div>
          <div className="input-group">
            <input
              type="text"
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="authBtn">Update</button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile;
