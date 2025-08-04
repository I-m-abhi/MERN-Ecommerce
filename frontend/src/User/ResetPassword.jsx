import { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { useNavigate, useParams } from 'react-router-dom';
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {token} = useParams();
  console.log(token)
  const {loading, success, error} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetPasswordSubmit = (e)=> {
    e.preventDefault();
    const data = {
      password,
      confirmPassword
    }
    dispatch(resetPassword({token, userData: data}))
  }

    useEffect(()=> {
      if(error) {
        toast.error(error, {position: 'top-center', autoClose: 3000})
        dispatch(removeErrors())
      }
    }, [dispatch, error])
  
    useEffect(()=> {
      if(success) {
        toast.success('Password reset successful', {position: 'top-center', autoClose: 3000})
        dispatch(removeSuccess())
        navigate('/login')
      }
    }, [dispatch, success])

  return (
     <div className='container forgot-container'>
      <div className="form-content email-group">
        <form className="form" onSubmit={resetPasswordSubmit}>
          <h2>Reset Password</h2>
          <div className="input-group">
            <input
              type="password"
              placeholder='Enter your new password'
              name='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder='Confirm your Password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="authBtn">Reset Password</button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
