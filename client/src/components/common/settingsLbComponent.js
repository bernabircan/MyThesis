import {ASSETS} from "../../constants/Paths";
import {useEffect, useState, useContext, useRef} from "react";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import ResetPassLbComponent from "../login/resetPassLbComponent";
import {Link} from "react-router-dom";
import {RESET_PASSWORD_PAGE}  from "../../constants/routePaths";
import {URL}  from "../../constants/routePaths";
import { LANDING_PAGE } from "../../constants/routePaths";

export default function SettingsLbComponent({closeLbFunc}) {
    const [isDescActive, setIsDescActive] = useState(false);
    const [isMailActive, setIsMailActive] = useState(false);
    const [isImgActive, setIsImgActive] = useState(false);
    const [file, setFile] = useState(null);
    const [descr, setDescr] = useState("");
    const [email, setEmail] = useState("");
    const {user: currentUser, dispatch} = useContext(AuthContext);
    const [isInputErrorActive, setIsInputErrorActive] = useState(false);
    const [isSettingsChanged, setIsSettingsChanged] = useState(false);

    const toggleSettingItem = (toggleItem) => {
        switch (toggleItem) {
            case "email":
                setIsMailActive(!isMailActive);
                break;
            case "desc":
                setIsDescActive(!isDescActive);
                break;
            case "img":
                setIsImgActive(!isImgActive);
                break;
            default:
                break;
        }
    }

    

    const passwordHandle = async () => {
        var token;
       
           
            try {
              const res = await axios.put("/auth/nomailforgot/", { email: currentUser.email}); //current chat varsa öneml
              console.log(res.data)
             token=res.data;

            } catch (err) {
              
            } 
           
            window.location.replace(URL+ RESET_PASSWORD_PAGE + token);
            dispatch({ type: "LOGOUT" });
            
          

         

       
    };


    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const setInputFunc = (value, input) => {
        switch (input) {
            case "email":
                setEmail(value);
                break;
            case "desc":
                setDescr(value);
                break;
            case "img":
                setFile(value);
                break;
            default:
                break;
        }
    }

    const submitSettingHandler = async (e) => {
        e.preventDefault();
        let fileName = "";
        if (file) {
             const data = new FormData();
            fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            try {
                await axios.post("/upload", data);
            } catch (err) {}
        }

        if (validateEmail(email)) {
            try {
                //mail değiştirme call'u gelecek.
            } catch (err) {
            }
        } else {
            setIsInputErrorActive(true);
        }

        try {
            await axios.put("/users/"+ currentUser._id,{ desc: descr,profilePicture:fileName});

            setIsSettingsChanged(true);
            setTimeout(()=>{
                window.location.reload();
            }, 2100)

          } catch (err) { }
          

    };

    
    return (
        <div className="lb-root settings-root ">
            {
                !isSettingsChanged &&
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

                        <div className="settings-container">

                            <div className="settings-block">

                                <h2 className="title-item">Hesap Ayarları</h2>
                                <div className={`setting-item`}>
                                    {<div className="btn-block"  onClick={passwordHandle}>
                                        <button className="btn-item btn-white-blue">
                                            şifre değiştir
                                        </button>
                                    </div>}
                                </div>
                                <form onSubmit={submitSettingHandler}>
                                    <h2 className="title-item">Profil Ayarları</h2>
                                    <div className={`setting-item ${isDescActive ? "active" : ""}`}>
                                    <span onClick={() => {
                                        toggleSettingItem("desc")
                                    }}>
                                        Hakkımda Ekle
                                        <i>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24"
                                                 width="18px" fill="#000000">
                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                                            </svg>
                                        </i>
                                    </span>
                                        {(isDescActive) &&
                                            (<div className="login-input-item">
                                                <input type="text"
                                                       value={descr}
                                                       autoFocus="autoFocus"
                                                       placeholder={"yeni hakkında gir."}
                                                       onChange={(e) => {
                                                           setInputFunc(e.target.value, "desc")
                                                       }}/>

                                            </div>)}
                                    </div>
                                    {/*TODO:bu alana display none verdim..*/}
                                    <div className={`setting-item ${isMailActive ? "active" : ""}`} style={{display: "none"}}>
                                    <span onClick={() => {
                                        toggleSettingItem("email")
                                    }}>
                                        e-mail değiştir
                                        <i>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24"
                                                 width="18px" fill="#000000">
                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                                            </svg>
                                        </i>
                                    </span>
                                        {
                                            (isMailActive) &&
                                            (<div className="login-input-item">
                                                <input type="text"
                                                       value={email}
                                                       autoFocus="autoFocus"
                                                       placeholder={"yeni e-mail adresini gir."}
                                                       onChange={(e) => {
                                                           setInputFunc(e.target.value, "email")
                                                       }}/>
                                            </div>)
                                        }
                                    </div>
                                    <div className={`setting-item ${isImgActive ? "active" : ""}`}>
                                    <span onClick={() => {
                                        toggleSettingItem("img")
                                    }}>
                                        Profil Resmi Ekle
                                        <i>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24"
                                                 width="18px" fill="#000000">
                                                <path d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                                            </svg>
                                        </i>
                                    </span>
                                        {(isImgActive) &&
                                            (<div className="settings-input-item">
                                                <input
                                                    type="file"
                                                    id="file"
                                                    accept=".png,.jpeg,.jpg"
                                                    onChange={(e) => setInputFunc(e.target.files[0], "img")}/>
                                            </div>)}
                                    </div>
                                    <button className="btn-blue" type="submit">
                                        kaydet
                                    </button>
                                    {/*TODO:bu alanı kapattım.*/}
                                    {/*{
                                    isInputErrorActive &&
                                    <div className="error-text">
                                        <p>e-mail'in uygun değil, bi' tekrar bak kontrol et.</p>
                                    </div>
                                }*/}
                                </form>
                            </div>


                        </div>
                    </div>
                </div>
            }
            {
                isSettingsChanged &&
                <div className="success-msj-item content-container">
                    <p>değişiklikler kaydedildi!</p>
                </div>
            }

        </div>
    );

}


