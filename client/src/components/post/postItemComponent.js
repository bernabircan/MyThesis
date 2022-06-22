import React, { Component, Fragment } from "react";
import {ASSETS, LOCAL_ASSETS} from "../../constants/Paths";
import CategoryHoverComponent from "../common/categoryHoverComponent";
import ProfileHoverComponent from "../common/profileHoverComponent";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";
import {CATEGORY_PAGE} from "../../constants/routePaths";
import {POST_PAGE} from "../../constants/routePaths";
import {PROFILE_PAGE} from "../../constants/routePaths";
import {dateTranslate} from "../../helper";

export default function PostItemComponent({ post }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [comments, setComments] = useState([]);
    const [category, setCategory] = useState({});
    const { socket, users } = useContext(SocketContext);

    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);

    const [activeHeart, setActiveHeart] = useState(post?.likes.includes(currentUser._id));
    const [activeSave, setActiveSave] = useState(false);
    const [activeDelete, setActiveDelete] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data);
        };
        fetchUser();

    }, [post.userId]);

    useEffect(() => {
        const getComments = async () => {
            const res = await axios.get("/comments/postallcomments/" + post._id);
            setComments(res.data);
        };
        getComments();
        const fetchcategory = async () => {
            const res = await axios.get(`/categories?categoryId=${post.categoryId}`);
            setCategory(res.data);

        };
        fetchcategory();
    }, [post._id])

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser?._id));

    }, [currentUser._id, post.likes]); //post currentuserın da olabilri

    const likeHandler = async () => {

        try {
            axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });

        } catch (err) {

        }

        setLike(isLiked ? like - 1 : like + 1);
       
        

        if ((isLiked == false) && (user._id != currentUser._id)) {
            const newNot = {
                receiverId: user._id,
                senderId: currentUser._id,
                action: "1",
                isNew: "T",
                postId:post._id,
                

            };
            console.log(newNot);
            try {
                await axios.post("/notifications/", newNot);
            } catch (err) { }


           
            var receiverId = user._id;

            if (users.includes(currentUser._id) && users.includes(receiverId)) {
                console.log("ikiside online likehandler")
                socket.emit("sendNotification", { receiverId});
            }

        }

        setIsLiked(!isLiked);

    };

    const toggleFunc = (toggled) => {
        switch (toggled) {
            case "heart":
                setActiveHeart(!activeHeart);
                likeHandler();
                break;
            case "save":
                setActiveSave(!activeSave);
                break;
            case "delete":
                setActiveDelete(!activeDelete);
                break;
            default:
                break;
        }
    }

    const copyToClipBoard = (copyTextValue) => {
        let dummy = document.createElement('input'), text = copyTextValue;
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        setCopied(true)
        setTimeout(()=>{
            setCopied(false)
        }, 2000)
    }

    return (

        <div className="post-item content-container">
            <div className="head-block">
                <div className="head-item-with-hover">
                    <Link to={ CATEGORY_PAGE + category?.name} className="head-item category">
                        <picture>
                            {
                                category?.categoryPath &&
                                <img src={`${LOCAL_ASSETS}/img/category/${category?.categoryPath}.jpg`}
                                     alt={category?.name} />
                            }
                        </picture>
                        <span>{category?.name}</span>
                    </Link>
                    {/*<CategoryHoverComponent category={category} />*/}
                </div>
                <div className="head-item-with-hover">
                    <Link to={ PROFILE_PAGE + user?.username} className="head-item user">
                        <span>@{user?.username}</span>
                    </Link>
                    {/*<ProfileHoverComponent user={user} />*/}
                </div>
                <div className="head-item-with-hover">

                    <span>
                        {dateTranslate(format(post?.createdAt))}
                    </span>

                    <div className="time-lb">

                    </div>
                </div>
            </div>
            <div className="middle-block">
                <div className="text-item">
                    <p>{post?.desc}</p>
                </div>
                {
                    post?.extraText &&
                    <div className="extraText-item">
                        <p>{post?.extraText}</p>
                    </div>
                }
                {
                    post?.img &&
                    <div className="img-item">
                        <picture>
                            <img src={post?.img
                                ? ASSETS + post.img
                                : ASSETS + "post/1.jpeg"}
                                 alt="pp" />
                        </picture>
                    </div>
                }

            </div>
            <div className="bottom-block">
                <div className={`bottom-item like ${activeHeart ? "selected" : ""}`}
                    onClick={() => toggleFunc("heart")}>
                    <i className={`icon filled`}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                            fill="#000000">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </i>

                    <i className={`icon border`} >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                            fill="#000000">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                        </svg>
                    </i>
                    <span>{like}</span>
                </div>

                <Link to={
                    {
                        pathname:  POST_PAGE + post._id,
                        myCustomProps: post
                    }
                }>
                    <div className="bottom-item comment">
                        <i className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                                fill="#000000">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path
                                    d="M20 17.17L18.83 16H4V4h16v13.17zM20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" />
                            </svg>
                        </i>
                        <span>{comments?.length}</span>
                    </div>
                </Link>

                {/*<div className={`bottom-item save ${activeSave ? "selected" : ""}`}
                     onClick={() => toggleFunc("save")}>
                    <i className={`icon filled`}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                             fill="#000000">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                        </svg>
                    </i>
                    <i className={`icon border`}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                             fill="#000000">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
                        </svg>
                    </i>
                </div>*/}

                <div className="bottom-item share" onClick={()=>{copyToClipBoard(window.location.origin + POST_PAGE + post._id)}}>
                    <i className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                            fill="#000000">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path
                                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                        </svg>
                    </i>

                    {
                        copied &&
                        <span className="copy-text-item">
                            link kopyalandı.
                        </span>
                    }
                </div>

                {/*<div className="bottom-item report">
                            <i className="icon">

                            </i>
                 </div>*/}

                {/*
                    post.userId === currentUser._id &&
                    <Fragment>
                        <div className="bottom-item delete" onClick={() => toggleFunc("delete")}>
                            <i className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000">
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                                </svg>
                            </i>
                        </div>
                        {
                            activeDelete &&
                            <div className="lb-root delete-post">
                                <div className="lb-wrapper">
                                    <div className="lb-container content-container">
                                        <div className="close-block">
                                            <div className="close-item" onClick={() => toggleFunc("delete")}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                                                     fill="#000000">
                                                    <path d="M0 0h24v24H0z" fill="none"/>
                                                    <path
                                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <button className="btn-grey" onClick={() => toggleFunc("delete")}>Gönderiyi Sil</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </Fragment>

                    */ }


            </div>
            <Link className="post-link-area" to={
                {
                    pathname:  POST_PAGE + post._id,
                    myCustomProps: post
                }
            }>

            </Link>
        </div>
    );

}


