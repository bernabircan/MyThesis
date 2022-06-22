import RegisterComponent from "../components/login/registerComponent";
import ForgotComponent from "../components/login/forgotComponent";
import {useRef, useState, useContext} from "react";
import {loginCall} from "../apiCalls";
import {AuthContext} from "../context/AuthContext"
import {Link} from "react-router-dom"
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {LOCAL_ASSETS} from "../constants/Paths";
import ResetPassLbComponent from "../components/login/resetPassLbComponent";

export default function ResetPassPage() {

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
                    <div className="login-block">
                        <div className="input-block">
                            <div className={`login-input-item`}>
                                <label className="text-title-item">kullanıcı adın</label>
                                <input type="text"/>
                            </div>
                            <div className={`login-input-item`}>
                                <label className="text-title-item">şifren</label>
                                <input type="password"/>
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

            <ResetPassLbComponent/>
        </div>
    );

}

