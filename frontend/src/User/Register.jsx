import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UserStyles/Form.css";
import { registerUser, removeErrors, removeSuccess } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");
  const { success, error, loading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, email, password } = user;

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
    } else {
      setUser({ ...user, [e.target.name]: [e.target.value] })
    }
  }
  const handleRegisterUser = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('name', name)
    myForm.set('email', email)
    myForm.set('password', password)
    myForm.set('avatar', avatar)
    // console.log(myForm.entries());
    // for(let pair of myForm.entries()) {
    //   console.log(pair[0]+ '-'+ pair[1])
    // }
    dispatch(registerUser(myForm))
  }

  useEffect(() => {
    if (error) {
      console.log(error)
      toast.error(error?.message, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (success) {
      toast.success("Registration Successfully", { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess())
      navigate('/');
    }
  }, [dispatch, success])

  return (
    <div className="form-container container">
      <div className="form-content">
        <form
          className="form"
          onSubmit={handleRegisterUser}
          encType="multipart/form-data"
        >
          <h2>Sign Up</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="input-group avatar-group">
            <input
              type="file"
              name="avatar"
              className="file-input"
              accept="image/"
              onChange={handleChange}
            />
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="avatar"
            />
          </div>
          <button className="authBtn">
            {loading ? "Signing Up" : "Sign Up"}
            </button>
          <p
            className="form-links">
            Already have an account?
            <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  )
};

export default Register;