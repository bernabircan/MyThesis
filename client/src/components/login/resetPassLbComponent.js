import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { LANDING_PAGE } from "../../constants/routePaths";


export default function ResetPassLbComponent({ closeLbFunc }) {
    const password = useRef();
    const passwordAgain = useRef();
    const resetToken = useParams().resetToken;

    const [isInputErrorActive, setIsInputErrorActive] = useState(false);
    const [unmatchedPass, setUnmatchedPass] = useState(false);
    const [isActiveStep, setIsActiveStep] = useState(0);

   
    const handleClick = (e) => {
        e.preventDefault();
       if( !controlInputs(password.current.value, passwordAgain.current.value)){
        const resetPass = async () => {
            try {
              const res = await axios.put("/auth/resetpassword/", { resetToken: resetToken, password: password.current.value }); //current chat varsa önemli
               console.log("değiştiridi");
              password.current.value = "";
              passwordAgain.current.value = "";
              setStep(1);
    
            } catch (err) {
              toast.error("Bu link artık kullanılamamaktadır.");
            }
          };
          
          resetPass();
          

       }
    };

 

    const controlInputs = (passwordToControl, passwordAgainToControl) => {
        const passMatch = passwordToControl === passwordAgainToControl

        if (!passMatch) {
            setUnmatchedPass(true);
            return true;
        }
        else {
            setUnmatchedPass(false);
        }

        if (passwordToControl === "") {
            setIsInputErrorActive(true);
            return true;
        }

        else if (passwordAgainToControl === "") {
            setIsInputErrorActive(true);
            return true;
        }

        else {
            setIsInputErrorActive(false);

            if (passMatch) {
                
                return false;
            }
        }
    }

    const setStep = (state) => {
        setIsActiveStep(state);
    }

    return (
        <div className="lb-root">
            <div className="lb-wrapper">
                <div className="lb-container content-container">
                    <div className="close-block">
                        <Link to={LANDING_PAGE} className="close-item">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                                fill="#000000">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </Link>
                    </div>
                    <div className="register-container">

                        {isActiveStep === 0 &&
                            <form onSubmit={handleClick}>
                                <div className="title-block">
                                    <p>yeni şifreni belirle.</p>
                                </div>
                                <div className="input-block">
                                    <div className={`login-input-item`}>
                                        <label className="text-title-item">şifren</label>
                                        <input ref={password} type="password" />
                                    </div>
                                    <div className={`login-input-item`}>
                                        <label className="text-title-item">şifren tekrar</label>
                                        <input ref={passwordAgain} type="password" />
                                    </div>
                                </div>
                                {
                                    unmatchedPass &&
                                    <div className="error-text password">
                                        <p>şifreler uyuşmuyor.</p>
                                    </div>
                                }
                                <div className="btn-block">
                                    <button type="submit" className="btn-item btn-blue">
                                        devam
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
                                        <p>doldurdukların uygun değil, bi' tekrar bak kontrol et.</p>
                                    </div>
                                }
                            </form>
                        }

                        {isActiveStep === 1 &&
                            <>
                                <div className="title-block with-btn">
                                    <p>şifren başarıyla değiştirildi.</p>
                                </div>
                                <div className="btn-block">
                                    <Link to={LANDING_PAGE} className="btn-item btn-blue">
                                        giriş yap
                                    </Link>
                                </div>
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    );

}

