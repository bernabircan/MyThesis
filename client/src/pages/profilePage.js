import React, { Component } from 'react';
import {ASSETS, LOCAL_ASSETS} from "../constants/Paths";
import SubscribeButtonComponent from "../components/common/subscribeButtonComponent";
import CreatePostsComponent from "../components/landing/createPostsComponent";
import CreatePostLbComponent from "../components/common/createPostLbComponent";
import FilterTabsComponent from "../components/landing/filterTabsComponent";
import PostsComponent from "../components/post/postsComponent";
import ChatLbComponent from "../components/chat/chatLbComponent";
import ProfileHoverComponent from "../components/common/profileHoverComponent";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router"
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import HeaderComponent from "../components/layout/header/headerComponent";
import { Link } from "react-router-dom";
import { PROFILE_PAGE } from "../constants/routePaths";
import { CATEGORY_PAGE } from "../constants/routePaths";
import FooterComponent from "../components/landing/footerComponent";

export default function ProfilePage() {
    const [user, setUser] = useState({});
    const username = useParams().username;
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const { socket, users } = useContext(SocketContext);

    const [followerFriendList, setFollowerFriendList] = useState([]);
    const [followingFriendList, setFollowingFriendList] = useState([]);
    const [followingCateList, setFollowingCateList] = useState([]);


    const [isFriend, setIsFriend] = useState(false);
    const [displayFriendButton, setDisplayFriendButton] = useState(false);

    const [isCreatePostOpen, setIsCreatePostOpen] = useState();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isActiveConv, setIsActiveConv] = useState("");
  


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`/users?username=${currentUser.username}`);
                dispatch({ type: "GET_CURRENT_USER", payload: res.data });
            } catch (err) { }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchProfileUser = async () => {
            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);
        };
        fetchProfileUser();
    }, [username]);

    useEffect(() => {
        if (user._id) {
            const fetchFollowingCateList = async () => {
                const res = await axios.get("/users/followingcates/" + user._id);
                setFollowingCateList(res.data);

            };
            fetchFollowingCateList();

        }

    }, [user]);


    useEffect(() => {
        if (user._id) {
            setIsFriend(currentUser.followingfriends.includes(user._id)); //currentuser userı takip ediyomu
            const fetchFollowingFriendList = async () => {
                const ress = await axios.get("/users/followerfriends/" + user._id);
                setFollowerFriendList(ress.data);
                const res = await axios.get("/users/followingfriends/" + user._id);
                setFollowingFriendList(res.data);

            };
            fetchFollowingFriendList();


            setDisplayFriendButton(true);
        }

    }, [user, isFriend, currentUser]);

    const handleFriendClick = async () => {


        try {
            if (isFriend) {
                await axios.put(`/users/${user._id}/removefriend`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "REMOVE_FRIEND", payload: user._id });
            } else {
                await axios.put(`/users/${user._id}/addfriend`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "ADD_FRIEND", payload: user._id });
            }
            if ((isFriend == false) && (user._id != currentUser._id)) {
                const newNot = {
                    receiverId: user._id,
                    senderId: currentUser._id,
                    action: "3",
                    isNew: "T",
                };
                console.log(newNot);
                try {
                    await axios.post("/notifications/", newNot);
                } catch (err) { }
    
    
               
                var receiverId = user._id;
    
                if (users.includes(currentUser._id) && users.includes(receiverId)) {
                    console.log("ikiside online followhandler")
                    socket.emit("sendNotification", { receiverId, });
                }
    
            }
            /*
            if (!isFriend) {
                const newNot = {
                    receiverId: user._id,
                    senderId: currentUser._id,
                    action: "3",
                    isNew: "T",

                };
                console.log(newNot);


                try {
                    await axios.post("/notifications/", newNot);
                } catch (err) { }

            } */




            setIsFriend(!isFriend);
        } catch (err) { }



    };

    const toggleCreatePost = () => {
        setIsCreatePostOpen(!isCreatePostOpen);
    }

    const toggleChatOpen = () => {

        setIsChatOpen(!isChatOpen);

    }

    const createConv = async () => {
        
        try {
            const res = await axios.post("/conversations",{senderId:currentUser._id, receiverId: user._id});
            setIsActiveConv(res.data._id);
            
        } catch (err) {
            console.log(err);
        } 

    }

   

    const OpenChat = () => {
        toggleChatOpen();
        createConv(); 
        

        

    }

    return (
        <div>
            <div className="profile-category-page-root profile">
                <div className="head-wrapper">
                    <div className="top-container" />
                    <div className="head-container">
                        <div className="safe-area">
                            <div className="head-block">
                                <div className="img-item">
                                    <picture>
                                        <img src={user?.profilePicture
                                            ? ASSETS + user.profilePicture
                                            : ASSETS + "person/noAvatar.png"}
                                             alt="pp" />
                                    </picture>
                                </div>
                                <div className="text-item">
                                    <h1>{user?.username}</h1>

                                </div>



                                {/* subscriber buton olması sıkıntı yaratıyordu */}
                                {(user?._id !== currentUser._id && displayFriendButton === true) && (

                                    <div className="btn-item" onClick={handleFriendClick} >
                                        <span className={`${currentUser?.followingfriends.includes(user._id) ? "btn-white-blue" : "btn-blue"}`} >
                                            {currentUser?.followingfriends.includes(user._id) ? "takibi bırak" : "takip et"}
                                        </span>
                                    </div>

                                )}

                                {user?._id !== currentUser._id && (
                                    <div className="btn-item send-msj" onClick={OpenChat}>
                                        <div className={`btn-blue`} >
                                            <svg width={18} height={18} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M20.61,19.19A7,7,0,0,0,17.87,8.62,8,8,0,1,0,3.68,14.91L2.29,16.29a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,18H8.69A7,7,0,0,0,15,22h6a1,1,0,0,0,.92-.62,1,1,0,0,0-.21-1.09ZM8,15a6.63,6.63,0,0,0,.08,1H5.41l.35-.34a1,1,0,0,0,0-1.42A5.93,5.93,0,0,1,4,10a6,6,0,0,1,6-6,5.94,5.94,0,0,1,5.65,4c-.22,0-.43,0-.65,0A7,7,0,0,0,8,15ZM18.54,20l.05.05H15a5,5,0,1,1,3.54-1.46,1,1,0,0,0-.3.7A1,1,0,0,0,18.54,20Z" />
                                            </svg>
                                        </div>
                                    </div>

                                )}
                                {
                                    isChatOpen &&
                                    <ChatLbComponent closeLbFunc={toggleChatOpen} activeConv={isActiveConv}/>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-wrapper">
                    <div className="main-container safe-area">
                        <div className="left-block">
                            {(user?._id === currentUser._id) &&
                                (<CreatePostsComponent openCreatePost={() => toggleCreatePost()} />)}

                            {isCreatePostOpen && (<CreatePostLbComponent closeCreatePost={() => toggleCreatePost()} />)}

                            {/*<FilterTabsComponent tab={"popular"} forUser={false} />*/}

                            <PostsComponent username={username} />
                        </div>
                        <div className="right-block">
                            <div className="about-me-container content-container">
                                <div className="head-title-block">
                                    <h2>Hakkımda</h2>
                                </div>
                                <div className="about-me-block">
                                    <div className="text-item">
                                        <p>{user?.desc}</p>
                                    </div>
                                    <div className="subs-item">
                                        {(displayFriendButton === true) &&
                                            (<span className="sub-num">
                                                {followerFriendList?.length}
                                            </span>)}
                                        <span className="text">
                                            Takipçi
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {
                                user?._id === currentUser._id &&
                                <div className="categories-container content-container">
                                    <div className="head-title-block my-profile">
                                        <h2>Takip Ettiklerim (Kategoriler)</h2>
                                    </div>
                                    <div className="categories-block">
                                        {
                                            (followingCateList.length > 0) && followingCateList.map((category) => (
                                                <div className="category-item" key={category._id}>
                                                    <div className="category">
                                                        <div className="category-img">
                                                            <picture>
                                                                {
                                                                    category?.categoryPath &&
                                                                    <img src={`${LOCAL_ASSETS}/img/category/${category?.categoryPath}.jpg`}
                                                                         alt={category?.name} />
                                                                }
                                                            </picture>
                                                        </div>
                                                        <Link to={CATEGORY_PAGE + category.name} className="category-name">
                                                            {category.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }

                            {
                                user?._id === currentUser._id &&
                                <div className="users-container content-container">
                                    <div className="head-title-block">
                                        <h2>Takip Ettiklerim (Kullanıcılar)</h2>
                                    </div>
                                    <div className="users-block">

                                        {
                                            (followingFriendList.length > 0) && followingFriendList.map((user) => (
                                                <div className="user-item" key={user._id} >
                                                    <div className="user">
                                                        <div className="user-img">
                                                            <source media="(min-width: 431px)"
                                                                srcSet={user?.profilePicture
                                                                    ? ASSETS + user.profilePicture
                                                                    : ASSETS + "person/noAvatar.png"} />
                                                            <source media="(max-width: 431px)"
                                                                srcSet={user?.profilePicture
                                                                    ? ASSETS + user.profilePicture
                                                                    : ASSETS + "person/noAvatar.png"} />
                                                            <img src={user?.profilePicture
                                                                ? ASSETS + user.profilePicture
                                                                : ASSETS + "person/noAvatar.png"}
                                                                alt="pp" />
                                                        </div>
                                                        <Link to={PROFILE_PAGE + user.username} className="user-name">
                                                            {user.username}
                                                        </Link>

                                                        {/*<ProfileHoverComponent user={user} /> */}
                                                    </div>
                                                </div>
                                            ))
                                        }


                                    </div>
                                </div>
                            }

                            {
                                user?._id === currentUser._id &&
                                <div className="users-container content-container">
                                    <div className="head-title-block my-profile">
                                        <h2>Takipçilerim</h2>
                                    </div>
                                    <div className="users-block">
                                        {
                                            (followerFriendList.length > 0) && followerFriendList.map((user) => (
                                                <div className="user-item" key={user._id}>
                                                    <div className="user">
                                                        <div className="user-img">
                                                            <source media="(min-width: 431px)"
                                                                srcSet={user?.profilePicture
                                                                    ? ASSETS + user.profilePicture
                                                                    : ASSETS + "person/noAvatar.png"} />
                                                            <source media="(max-width: 431px)"
                                                                srcSet={user?.profilePicture
                                                                    ? ASSETS + user.profilePicture
                                                                    : ASSETS + "person/noAvatar.png"} />
                                                            <img src={user?.profilePicture
                                                                ? ASSETS + user.profilePicture
                                                                : ASSETS + "person/noAvatar.png"}
                                                                alt="pp" />
                                                        </div>
                                                        <Link to={PROFILE_PAGE + user.username} className="user-name">
                                                            {user.username}
                                                        </Link>

                                                        {/*<ProfileHoverComponent user={user} />  */}
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                            }

                            <FooterComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}


