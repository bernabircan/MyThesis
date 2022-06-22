import { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { loginCall } from "../../apiCalls";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function RegisterComponent({ closeLbFunc }) {
    const studentNo = useRef();
    const userName = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory();

    const [isActiveStep, setIsActiveStep] = useState(0);

    const [isInputErrorActive, setIsInputErrorActive] = useState(false);
    const [unmatchedPass, setUnmatchedPass] = useState(false);
    const [existingMail, setExistingMail] = useState(false);

    const [isMailSentAgain, setIsMailSentAgain] = useState("mail gelmediyse tıkla, tekrar gönderelim.");

    const handleClick = async (e) => {
        e.preventDefault();
        var isError;
        isError = controlInputs(studentNo.current.value, userName.current.value, password.current.value, passwordAgain.current.value);
        var exist;
        var email = studentNo.current.value + "@ogrenci.ege.edu.tr";
        try { //isteğe sistemde olmayan maili vermemek için
            const res = await axios.post("/auth/mailcontrol", { email: email }); //current chat varsa önemli
            exist=res.data;
        } catch (err) {}
        console.log("existing mail", exist);
        if (isError == false && exist==false) {
            let email = studentNo.current.value + "@ogrenci.ege.edu.tr";

            const user = {
                username: userName.current.value,
                email: email,
                password: password.current.value,
            };
            console.log("user", user);

            
            try {
              const res = await axios.post("/auth/activateAccount/", user); //current chat varsa önemli
              console.log("buraya girildi")
            } catch (err) { }

            setStep(1);
            

        }
    };




    const controlInputs = (studentNoToControl, userNameToControl, passwordToControl, passwordAgainToControl) => {
     
        if (studentNoToControl === "") {
            setIsInputErrorActive(true);
            return true;
        }else{
            const mailControl = async ()=>{ //bu ui'da mail sistemde yok yazısı için
            var email = studentNoToControl + "@ogrenci.ege.edu.tr";
            try {
                const res = await axios.post("/auth/mailcontrol", { email: email }); //current chat varsa önemli
                setExistingMail(res.data);
            } catch (err) {}
            }
            mailControl();
            
        } 
      
        
        const passMatch = passwordToControl === passwordAgainToControl
        if (!passMatch) {
            setUnmatchedPass(true);
            return true;
        }
        else {
            setUnmatchedPass(false);
        }
      
        if (userNameToControl === "") {
            setIsInputErrorActive(true);
            return true;

        } else if (passwordToControl === "") {
            setIsInputErrorActive(true);
            return true;

        } else if (passwordAgainToControl === "") {
            setIsInputErrorActive(true);
            return true;

        } else {
            if (passMatch) {
                setIsInputErrorActive(false);
                return false;
            }
        }
        

    }

    /*
    const setSentMail = () => {
        setIsMailSentAgain("tekrar gönderdik.");
    } */

    const setStep = (state) => {
        setIsActiveStep(state);
    }

    return (
        <div className="lb-root">
            <div className="lb-wrapper">
                <div className="lb-container content-container">
                    <div className="close-block">
                        <div className="close-item" onClick={closeLbFunc}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                                fill="#000000">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </div>
                    </div>
                    <div className="register-container">

                        {isActiveStep === 0 &&
                            <form onSubmit={handleClick}>
                                <div className="title-block">
                                    <p>öncelikle bize öğrenci mail'in,<br />kullanıcı adın ve şifren lazım.</p>
                                </div>
                                <div className="input-block">
                                    <div className={`login-input-item row-reverse`}>
                                        <label className="text-title-item">@ogrenci.ege.edu.tr</label>
                                        <input ref={studentNo} type="text" placeholder="öğrenci numaran" />
                                    </div>
                                    {
                                    existingMail &&
                                    <div className="error-text password">
                                        <p>Bu mail sistemde zaten kayıtlı.</p>
                                    </div>
                                    }
                                    <div className={`login-input-item`}>
                                        <label className="text-title-item">kullanıcı adın</label>
                                        <input ref={userName} type="text" />
                                    </div>
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
                                <div className="title-block border-none">
                                    <p>
                                        <span>{studentNo.current.value}@ogrenci.ege.edu.tr </span> adresine üyeliğini onaylaman
                                        için bir link gönderdik, bakabilir misin?
                                    </p>
                                    <p className="outlook-link-item">
                                        (e-mail'ini <a href="https://outlook.office365.com/" target="_blank">outlook</a> üzerinden kontrol etmelisin.)
                                    </p>
                                </div>
                                <div className="link-block">
                                    <div className="link-item" onClick={() => {/*callFunc(); setSentMail();*/ }}>

                                    </div>
                                </div>
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    );

}

