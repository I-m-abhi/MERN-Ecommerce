import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeErrors, removeSuccess, updatePassword } from "../features/user/userSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { error, loading, success } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm))
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  useEffect(() => {
    if (success) {
      toast.success("Password updated", { position: 'top-center', autoClose: 3000 });
      dispatch(removeSuccess())
      navigate("/profile");
    }
  }, [dispatch, success])

  return (
    <div className="container update-container">
      <div className="form-content">
        <form
          className="form"
          onSubmit={handlePasswordSubmit}
        >
          <h2>Update Password</h2>
          <div className="input-group">
            <input
              type="password"
              name='oldPassword'
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name='newPassword'
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name='confirmPassword'
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className="authBtn">Update Password</button>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword;
