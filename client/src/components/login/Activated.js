import "./activated.css";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from "react-router";
import axios from "axios";


export default function Activated() {
    const activatedToken = useParams().token;

    const handleClick  = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/register",{ activatedToken: activatedToken});
            toast.success("Kayıt başarıyla tamamlandı");

        } catch (err) {
            console.log(err);
            toast.error("Kayıt başarısız")
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
                    < div className="loginBox">
                        <span >Lütfen kaydı tamamlamak için butona tıklayın</span>

                        <div>
                            <button className="loginButton" onClick={handleClick}>
                            Kaydı tamamlamak için tıklayın
                            </button>
                            <ToastContainer
                                hideProgressBar
                                position="bottom-center"
                                pauseOnHover={true}
                                autoClose={1000}
                            />
                        </div>
                        <Link to="/login">
                        <button className="loginButton" >
                            Log in
                        </button>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}