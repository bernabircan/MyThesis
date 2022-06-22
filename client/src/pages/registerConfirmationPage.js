import 'react-toastify/dist/ReactToastify.css';
import { LOCAL_ASSETS } from "../constants/Paths";
import ResetPassLbComponent from "../components/login/resetPassLbComponent";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import {LANDING_PAGE, LOGIN_PAGE, RESET_PASSWORD_PAGE, URL} from "../constants/routePaths";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useEffect, useState, useContext, useRef } from "react";

export default function RegisterConfirmationPage() {
    const activatedToken = useParams().confirmToken;
    console.log(activatedToken);

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/register", { activatedToken: activatedToken });
            toast.success("Kayıt başarıyla tamamlandı");
            window.location.replace(URL+ LOGIN_PAGE);

        } catch (err) {
            console.log(err);
            toast.error("Kayıt zaten tamamlandı")
            window.location.replace(URL+ LOGIN_PAGE);
        }
    };

    return (
        <div className="login-root">
            <div className="login-wrapper">
                <div className="login-container content-container">
                    <div className="top-block">
                        <div className="logo-item">
                            <img src={`${LOCAL_ASSETS}/img/logo.png`} alt="logo" />
                        </div>
                        <div className="text-item">
                            <p>öğrenciler için, öğrenciler tarafından</p>
                        </div>
                    </div>
                    <div className="login-block">
                        <div className="input-block">
                            <div className={`login-input-item`}>
                                <label className="text-title-item">kullanıcı adın</label>
                                <input type="text" />
                            </div>
                            <div className={`login-input-item`}>
                                <label className="text-title-item">şifren</label>
                                <input type="password" />
                            </div>
                        </div>
                        <div className="btn-block">
                            <button type="submit" className="btn-item btn-blue">
                                giriş yap
                            </button>
                            <div className="btn-item btn-white-blue">
                                kayıt ol
                            </div>
                        </div>
                        <div className="link-block">
                            <div className="link-item">
                                kullanıcı adımı veya şifremi unuttum.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

                            <div className="btn-block">
                                <button className="btn-item btn-blue" onClick={handleClick}>
                                    kaydı tamamla
                                </button>
                            </div>

                            <ToastContainer
                                hideProgressBar
                                position="bottom-center"
                                pauseOnHover={true}
                                autoClose={1000}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

