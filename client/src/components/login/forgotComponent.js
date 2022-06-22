import {useEffect, useState, useContext, useRef} from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { LANDING_PAGE } from "../../constants/routePaths";

export default function RegisterComponent({closeLbFunc}) {
    const emailRef = useRef();
    const { dispatch } = useContext(AuthContext);
    const [isActiveStep, setIsActiveStep] = useState(0);
    const [isInputErrorActive, setIsInputErrorActive] = useState(false);
    const [email, setEmail] = useState("");

    const handleClick = (e) => {
        e.preventDefault();
        if(controlInputs(emailRef.current.value)){
            dispatch({ type: "LOGOUT" });
            const forgotPass = async () => {
                try {
                  const res = await axios.put("/auth/forgotpassword/", { email: emailRef.current.value }); //current chat varsa öneml
                  setStep(1);
                } catch (err) {
                    toast.error("Sistemde bu maile ait kullanıcı bulunmamaktadır.");
                }
              };
              forgotPass();
        }
    };

    const controlInputs = (emailToControl) => {
        if (emailToControl === "") {
            setIsInputErrorActive(true);
            return false;
        }

        else {
            setIsInputErrorActive(false);
            setEmail(emailToControl);
            return true;
        }
    }

    const setStep = (state) => {
        setIsActiveStep(state);
    }

    const callFunc = () => {
        const forgotPass = async () => {
            try {
              const res = await axios.put("/auth/forgotpassword/", { email: email}); //current chat varsa önemli
              toast.success("Mail başarıyla gönderildi");
            } catch (err) {}
          };
          forgotPass();
    }

    return (
        <div className="lb-root">
            <div className="lb-wrapper">
                <div className="lb-container content-container">
                    <div className="close-block">
                        <div className="close-item" onClick={closeLbFunc}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                                 fill="#000000">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="register-container">

                        {isActiveStep === 0 &&
                            <form onSubmit={handleClick}>
                                <div className="input-block">
                                    <div className={`login-input-item`}>
                                        <label className="text-title-item">kayıtlı mail adresin</label>
                                        <input ref={emailRef} type="text"/>
                                    </div>
                                </div>
                                <div className="btn-block">
                                    <button type="submit" className="btn-item btn-blue">
                                        şifremi sıfırla
                                    </button>
                                </div>
                                <ToastContainer
                                    hideProgressBar
                                    position="bottom-center"
                                    pauseOnHover={true}
                                    autoClose={1000}
                                />
                                {
                                    isInputErrorActive &&
                                    <div className="error-text">
                                        <p>email hatalı gibi, bi' tekrar bak kontrol et.</p>
                                    </div>
                                }
                            </form>
                        }

                        {isActiveStep === 1 &&
                            <>
                                <div className="title-block last-step border-none">
                                    <p>
                                        şifreni sıfırlayabilmen için <br/> <span>{email}</span> <br/> adresine bir mail
                                        gönderdik.
                                    </p>
                                    <p className="outlook-link-item">
                                        (e-mail'ini <a href="https://outlook.office365.com/" target="_blank">outlook</a> üzerinden kontrol etmelisin.)
                                    </p>
                                </div>
                                <div className="link-block">
                                    <div className="link-item" onClick={()=>{callFunc();}}>
                                      mail gelmediyse tıkla, tekrar gönderelim.
                                    </div>
                                </div>
                                <ToastContainer
                                    hideProgressBar
                                    position="bottom-center"
                                    pauseOnHover={true}
                                    autoClose={1000}
                                />
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    );

}

