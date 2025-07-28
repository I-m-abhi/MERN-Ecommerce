import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../UserStyles/Form.css";
import { loginUser, registerUser, removeErrors, removeSuccess } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const { success,error, loading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLoginUser = (e) => {
    e.preventDefault();
    dispatch(loginUser({email, password}))
  }

  useEffect(() => {
    if (error) {
      toast.error(error?.message, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (success) {
      toast.success("Login Successfully", { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess())
    }
  }, [dispatch, success])

  return (
    <div className="form-container container">
      <div className="form-content">
        <form
          className="form"
          onSubmit={handleLoginUser}
        >
          <h2>Welcome Back Plaese Login</h2>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <button className="authBtn">Sign In</button>
          <p
            className="form-links">
            Forget your password?
            <Link to="/password/forgot">Reset Here</Link>
          </p>
          <p
            className="form-links">
            Don't have an account?
            <Link to="/register">Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  )
};

export default Login;