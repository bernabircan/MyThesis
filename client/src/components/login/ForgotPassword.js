import "./forgotPassword.css";
import { useRef, useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';





export default function ForgotPassword() {
  const email = useRef();
  const { dispatch } = useContext(AuthContext);
  const [message, setMessage] = useState(false);
  const [disabled, setDisabled] = useState(false);





  const handleClick = (e) => {
    e.preventDefault();

    dispatch({ type: "LOGOUT" });
    if (email.current.value) {
      const forgotPass = async () => {
        try {
          const res = await axios.put("/auth/forgotpassword/", { email: email.current.value }); //current chat varsa önemli

          toast.success("Please check your email");

        } catch (err) {
          toast.error("operation failed");
        }
      };
      forgotPass();
      setDisabled(true);

    }
  };

  




  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">

          < form className="loginBox" onSubmit={handleClick}>
            Please enter your email for resetting password
            <input
              placeholder="Email"
              type="email"
              className="loginInput"
              required
              ref={email}
            />
            <div>
            <button className="loginButton" type="submit" disabled={disabled}>
              Send Reset Link
            </button>
            <ToastContainer
              hideProgressBar
              position="bottom-center"
              pauseOnHover={true}
              autoClose={1000}
            />
            </div>
            {(disabled) &&
              <div>
                <button className="loginButton" type="submit">
                  Send Reset Link Again
                </button>
                <ToastContainer
                  hideProgressBar
                  position="bottom-center"
                  pauseOnHover={true}
                  autoClose={1000}
                />
              </div>  }




          </form>
          <div>



          </div>

        </div>
      </div>
    </div>
  );
}