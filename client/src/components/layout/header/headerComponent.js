import HeaderSearchResultComponent from "./headerSearchResultComponent";
import {ASSETS, LOCAL_ASSETS} from "../../../constants/Paths";
import {AuthContext} from "../../../context/AuthContext";
import {SearchContext} from "../../../context/SearchContext";
import SettingsLbComponent from "../../common/settingsLbComponent";
import {Link} from "react-router-dom";
import {useEffect, useState, useContext, useRef} from "react";
import SearchPage from "../../../pages/searchPage"
import axios from "axios";
import ChatLbComponent from "../../chat/chatLbComponent";
import NotifyItemComponent from "./notifyItemComponent";
import {SocketContext} from "../../../context/SocketContext";

import {LANDING_PAGE} from "../../../constants/routePaths";
import {PROFILE_PAGE} from "../../../constants/routePaths";

export default function HeaderComponent({}) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const {user: currentUser, dispatch} = useContext(AuthContext);
    const userActionProfile = useRef();
    const userActionNotify = useRef();
    const userActionChat = useRef();
    const mobileSearch = useRef();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    //search
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);

    // const [newMessages, setNewMessages] = useState(true);


    const [notifications, setNotifications] = useState([]);


    const {socket, users: onlineUsers} = useContext(SocketContext);

    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isOpened, SetIsOpened] = useState(false);
    const [isReal, SetIsReal] = useState(false);
    const [newNotNumb, setNewNotNumb] = useState(0);
    

    const [newChatNumb, setNewChatNumb] = useState(0);
    
    //notification için
    const notificationHandler = async () => {
        try {
            const res = await axios.get("/notifications/users/" + currentUser._id);
            setNotifications(res.data);
        } catch (err) {
            console.log("eror", err);
        }
    };

    useEffect(() => {
        socket.on("getNotification", (receiverId) => {  //serverden gelen mesajı almak için -mesaj göndermek 4
            if (onlineUsers.includes(currentUser._id) && onlineUsers.includes(receiverId.receiverId)) {
                console.log("ikiside online header");
                SetIsReal(!isReal);
            }
        });

    }, [isReal]);


    useEffect(() => {
        window.addEventListener("click", windowClicked);
        const notificationNum = async () => {
            try {
                const res = await axios.get("/notifications/usersnew/" + currentUser._id);
                setNewNotNumb(res.data);
            } catch (err) {
                console.log("eror", err);
            }
        }
        notificationNum();
    }, [isOpened, isReal]);

    const toggleMenu = (menu) => {

        switch (menu) {
            case "profile":
                setIsProfileMenuOpen(!isProfileMenuOpen);
                break;

            case "notify":
                if (!isNotifyOpen) {
                    SetIsOpened(true);
                } else {
                    setNewNotNumb(0);
                    SetIsOpened(false);
                }
                setIsNotifyOpen(!isNotifyOpen);
                notificationHandler();
                break;
        }
    }
    
    
    const chatNumb = (num) => {

        setNewChatNumb(num);
    }
    

    const toggleChat = () => {

        setIsChatOpen(!isChatOpen)
    }

    const toggleSettings = (value) => {
        setIsSettingsOpen(!isSettingsOpen);
    }


    useEffect(() => {
        window.addEventListener("click", windowClicked);

        return () => {
            window.removeEventListener('click', windowClicked);
        }

    });

    const windowClicked = (e) => {
        if (isProfileMenuOpen) {
            setIsProfileMenuOpen(false);
        }

        if (isNotifyOpen) {
            setIsNotifyOpen(false);
        }

        /*if (userActionChat.current && !userActionChat.current.contains(e.target)) {
            setIsChatOpen(false);
        }*/

        if (mobileSearch.current && !mobileSearch.current.contains(e.target) && isMobileSearchOpen) {
            setIsMobileSearchOpen(false);
        }
    }


    const logOut = () => {
        dispatch({type: "LOGOUT"});
    };

    const openMobileSearch = () => {
        if (typeof window !== "undefined" && window.innerWidth <= 768 && !isMobileSearchOpen) {
             setIsMobileSearchOpen(true);
        }
    };

    return (
        <header className="header-root">
            <div className="header-wrapper">
                <div className="header-container">
                    <Link to={LANDING_PAGE} className="logo-item">
                        <div className="logo">
                            <img src={`${LOCAL_ASSETS}/img/logo.png`} alt="logo"/>
                        </div>
                    </Link>
                    <div className={`search-block ${query ? "focused" : ""} ${isMobileSearchOpen ? "mobile-search-open" : ""}`} ref={mobileSearch} onClick={()=>{openMobileSearch()}}>
                        <div className="input-item">
                            <div className="icon-item">
                                <svg height="20px" viewBox="0 0 24 24" width="20px" fill="#777777"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path
                                        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </div>
                            <input type="search" placeholder="Kullanıcı, kategori ya da gönderi arayın... "
                                   onChange={(e) => {
                                       setQuery(e.target.value.toLowerCase())
                                   }}/>

                            {
                                (query !== "") &&
                                <HeaderSearchResultComponent query={query} setQuery={setQuery}/>
                            }

                        </div>
                    </div>
                    <div className={`user-action-block`}>
                        <div className={`user-action-item chat ${newChatNumb > 0 ? "new" : ""}`}
                             onClick={() => {
                                 toggleChat()
                             }}>
                            <div className="icon-item">
                            {newChatNumb!==0 && <span>{newChatNumb}</span>}
                                <svg width={18} height={18} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20.61,19.19A7,7,0,0,0,17.87,8.62,8,8,0,1,0,3.68,14.91L2.29,16.29a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,18H8.69A7,7,0,0,0,15,22h6a1,1,0,0,0,.92-.62,1,1,0,0,0-.21-1.09ZM8,15a6.63,6.63,0,0,0,.08,1H5.41l.35-.34a1,1,0,0,0,0-1.42A5.93,5.93,0,0,1,4,10a6,6,0,0,1,6-6,5.94,5.94,0,0,1,5.65,4c-.22,0-.43,0-.65,0A7,7,0,0,0,8,15ZM18.54,20l.05.05H15a5,5,0,1,1,3.54-1.46,1,1,0,0,0-.3.7A1,1,0,0,0,18.54,20Z"/>
                                </svg>
                            </div>
                            <div/>
                        </div>

                        <div ref={userActionNotify}
                             className={`user-action-item notify ${newNotNumb > 0 ? "new" : ""} ${isNotifyOpen ? "opened" : ""}`}
                             onClick={() => {
                                 toggleMenu("notify")
                             }}>
                            <div className="icon-item">
                            {newNotNumb!==0 && <span>{newNotNumb}</span>}
                                <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M14 3V3.28988C16.8915 4.15043 19 6.82898 19 10V17H20V19H4V17H5V10C5 6.82898 7.10851 4.15043 10 3.28988V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3ZM7 17H17V10C17 7.23858 14.7614 5 12 5C9.23858 5 7 7.23858 7 10V17ZM14 21V20H10V21C10 22.1046 10.8954 23 12 23C13.1046 23 14 22.1046 14 21Z"
                                          fill="currentColor"/>
                                </svg>
                            </div>
                            <div className="open-user-action-root">
                                <div className="open-user-action-block">
                                    {notifications.slice(0, 20).map((n, index) => (
                                        <NotifyItemComponent key={index} notifyData={n} isOpened={isOpened}/>))}
                                </div>
                            </div>
                        </div>

                        <div className={`user-action-item profile ${isProfileMenuOpen ? "opened" : ""}`}
                             onClick={() => {toggleMenu("profile")}}>
                            <div className="img-item">
                                <picture>
                                    <img src={currentUser?.profilePicture
                                        ? ASSETS + currentUser.profilePicture
                                        : ASSETS + "person/noAvatar.png"}
                                         alt="bil-muh"/>
                                </picture>
                            </div>
                            <span>{currentUser?.username}</span>
                            <i>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                                     width="24px" fill="#000000">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                                </svg>
                            </i>
                            <div className="open-user-action-root content-container" ref={userActionProfile}>
                                <div className="open-user-action-block">
                                    <Link to={PROFILE_PAGE + currentUser?.username} className="open-user-action-item">
                                        Profil </Link>
                                    <span className="open-user-action-item" onClick={toggleSettings}>Ayarlar</span>

                                    {
                                        currentUser &&
                                        <Link to={LANDING_PAGE} className="open-user-action-item" onClick={logOut}>
                                            Çıkış Yap
                                        </Link>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    isSettingsOpen &&
                    <SettingsLbComponent closeLbFunc={toggleSettings}/>
                }
                {
                    isChatOpen &&
                    <ChatLbComponent closeLbFunc={toggleChat} chatNumb={chatNumb}/>
                }
            </div>
        </header>
    );

}




