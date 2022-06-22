import RegisterComponent from "../components/login/registerComponent";
import ForgotComponent from "../components/login/forgotComponent";
import {useRef, useState, useContext} from "react";
import {loginCall} from "../apiCalls";
import {AuthContext} from "../context/AuthContext"
import {Link} from "react-router-dom"
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {LOCAL_ASSETS} from "../constants/Paths";

export default function LoginPage() {
    const email = useRef();
    const password = useRef();
    const [isInputErrorActive, setIsInputErrorActive] = useState(false);
    const [isRegisterLbOpen, setIsRegisterLbOpen] = useState(false);
    const [isForgotLbOpen, setIsForgotLbOpen] = useState(false);
    const {user, isFetching, error, dispatch} = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault(); //logine basınca sayfa yenilenmesin diye

        controlInputs(email.current.value, password.current.value);
    };

    const controlInputs = (userNameToControl, passwordToControl) => {
        if (userNameToControl === "") {
            setIsInputErrorActive(true);
        }

        else if (passwordToControl === "") {
            setIsInputErrorActive(true);
        }

        else {
            loginCall({username: email.current.value, password: password.current.value}, dispatch).then(
                value => setIsInputErrorActive(!value)
            )
        }
    }


    const toggleRegisterLbState = () => {
        setIsRegisterLbOpen(!isRegisterLbOpen);

    }

    const toggleForgotLbState = () => {
        setIsForgotLbOpen(!isForgotLbOpen);

    }

    return (
        <div className="login-root">
            <div className="login-wrapper">
                <div className="login-container content-container">
                    <div className="top-block">
                        <div className="logo-item">
                            <img src={`${LOCAL_ASSETS}/img/logo.png`} alt="logo"/>
                        </div>
                        <div className="text-item">
                            <p>öğrenciler için, öğrenciler tarafından</p>
                        </div>
                    </div>
                    <form className="login-block" onSubmit={handleClick}>
                        <div className="input-block">
                            <div className={`login-input-item`}>
                                <label className="text-title-item">kullanıcı adın</label>
                                <input type="text" ref={email}/>
                            </div>
                            <div className={`login-input-item`}>
                                <label className="text-title-item">şifren</label>
                                <input type="password" ref={password}/>
                            </div>
                        </div>
                        <div className="btn-block">
                            <button type="submit" className="btn-item btn-blue">
                                giriş yap
                            </button>
                            <div className="btn-item btn-white-blue" onClick={toggleRegisterLbState}>
                                kayıt ol
                            </div>
                        </div>
                        {
                            isInputErrorActive &&
                            <div className="error-text">
                                <p>bilgilerine bi' tekrar bak.</p>
                            </div>
                        }
                        <div className="link-block">
                            <div className="link-item" onClick={() => {
                                toggleForgotLbState()
                            }}>
                                kullanıcı adımı veya şifremi unuttum.
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {
                isRegisterLbOpen && <RegisterComponent closeLbFunc={toggleRegisterLbState}/>
            }
            {
                isForgotLbOpen && <ForgotComponent closeLbFunc={toggleForgotLbState}/>
            }
        </div>
    );

}

