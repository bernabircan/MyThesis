import {ASSETS, LOCAL_ASSETS} from "../constants/Paths";
import CategoryHoverComponent from "../components/common/categoryHoverComponent";
import ProfileHoverComponent from "../components/common/profileHoverComponent";

import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import { format } from "timeago.js";
import { useLocation } from "react-router-dom";
import CommentComponent from "../components/post/CommentComponent";
import { Link } from "react-router-dom";

import {CATEGORY_PAGE, POST_PAGE} from "../constants/routePaths";
import { PROFILE_PAGE } from "../constants/routePaths";
import {dateTranslate} from "../helper";
import FooterComponent from "../components/landing/footerComponent";
export default function PostPage() {
    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const content = useRef();
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState({});
    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);
    const { socket, users } = useContext(SocketContext);
    const [activeHeart, setActiveHeart] = useState(false);
    const [activeSave, setActiveSave] = useState(false);
    const [activeDelete, setActiveDelete] = useState(false);
    const [category, setCategory] = useState({});
    const [like, setLike] = useState(0);
    const [firstLike, setFirstLike] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {

        const getPost = async () => {
            const res = await axios.get("/posts/" + path);
            setPost(res.data);
        };

        getPost();

    }, [path])

    const likeHandler =async () => {

        //console.log("likehandler", isLiked);


        try {
            axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });

        } catch (err) {

        }
        setIsLiked(!isLiked);
        setLike(isLiked ? like - 1 : like + 1);

        if ((isLiked == false) && (user._id != currentUser._id)) {
            const newNot = {
                receiverId: user._id,
                senderId: currentUser._id,
                action: "1",
                isNew: "T",
                postId: post._id,
            };

            //console.log(newNot);
            try {
                await axios.post("/notifications/", newNot);
            } catch (err) { }

            var receiverId = user._id;

            if (users.includes(currentUser._id) && users.includes(receiverId)) {
                console.log("ikiside online likehandler")
                socket.emit("sendNotification", { receiverId});
            }
        }
    };

    useEffect(() => { //buraya sadece 1 kere giriyor.
        if (post.likes !== undefined && firstLike == false) {
            setLike(post.likes.length);
            setIsLiked(post.likes.includes(currentUser?._id));
            setActiveHeart(post.likes.includes(currentUser?._id));
            setFirstLike(true);

        }

    }, [currentUser._id, post]); //post currentuserın da olabilri



    useEffect(() => {
        if (post._id) {
            const fetchcategory = async () => {
                const res = await axios.get(`/categories?categoryId=${post.categoryId}`);
                setCategory(res.data);

            };
            fetchcategory();
            const getComments = async () => {
                const res = await axios.get("/comments/postallcomments/" + post._id);
                setComments(res.data);
            };
            getComments();
        }
    }, [post._id])

    useEffect(() => { //useefecti async yapamıyon use efect içine async function koyabiliyon
        if (post.userId) {
            const fetchUser = async () => {
                const res = await axios.get(`/users?userId=${post.userId}`);
                setUser(res.data);

            };
            fetchUser();
        }
    }, [post.userId]);//post başka bir kullanıcının da olabilir.

    const handleDelete = async () => {

        try {
            await axios.delete("/posts/" + post._id, {
                data: { userId: currentUser._id }
            });
            window.location.replace("http://localhost:3000/");


        } catch (err) {

        }

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

    const submitCommentHandler = async (e) => {


        if (content.current.value != "") {

            const newComment = {
                userId: currentUser._id,
                desc: content.current.value,
                postId: path,
            };
            content.current.value = "";


            try {
                await axios.post("/comments", newComment);

            } catch (err) { }

            try {
                const res = await axios.get("/comments/postallcomments/" + path);
                setComments(res.data);

            } catch (err) { }

            if ((user._id != currentUser._id)) {
                const newNot = {
                    receiverId: user._id,
                    senderId: currentUser._id,
                    action: "2",
                    isNew: "T",
                    postId: post._id,
                };
                console.log(newNot);
                try {
                    await axios.post("/notifications/", newNot);
                } catch (err) { }



                var receiverId = user._id;

                if (users.includes(currentUser._id) && users.includes(receiverId)) {
                    console.log("ikiside online yorumhandler")
                    socket.emit("sendNotification", { receiverId, });
                }

            }



        }



    };

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
        <div className="main-wrapper">
            <div className="main-container safe-area">
                <div className="post-page-root">
                    <div className="left-block content-container">
                        <div className="post-item">
                            <div className="head-block">
                                <div className="head-item-with-hover">
                                    <Link to={CATEGORY_PAGE + category?.name} className="head-item category">
                                        <picture>
                                            {
                                                category?.categoryPath &&
                                                <img src={`${LOCAL_ASSETS}/img/category/${category?.categoryPath}.jpg`}
                                                     alt={category?.name} />
                                            }
                                        </picture>
                                        <span>{category?.name}</span>
                                    </Link>


                                    {/*<CategoryHoverComponent category={category} /> */}
                                </div>
                                <div className="head-item-with-hover">
                                    <Link to={PROFILE_PAGE + user?.username} className="head-item user">
                                        <span>@{user?.username}</span>
                                    </Link>
                                    { /* <ProfileHoverComponent user={user} /> */}
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
                                    post?.img && (
                                        <div className="img-item">
                                            <picture>
                                                <img src={ASSETS + post.img} />
                                            </picture>
                                        </div>)
                                }

                            </div>
                            <div className="bottom-block">
                                <div className={`bottom-item like ${activeHeart ? "selected" : ""}`}
                                    onClick={() => toggleFunc("heart")}>
                                    <i className={`icon filled`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"
                                            fill="#000000">
                                            <path d="M0 0h24v24H0z" fill="none" />
                                            <path
                                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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

                                <div className="bottom-item share" onClick={()=>{copyToClipBoard(window.location.href)}}>
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

                                {
                                    post.userId === currentUser._id &&
                                    <>
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
                                                                    <path d="M0 0h24v24H0z" fill="none" />
                                                                    <path
                                                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <button className="btn-grey" onClick={handleDelete}>Gönderiyi Sil</button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </>

                                }
                            </div>
                        </div>

                        <div className="comment-input-item">

                            <textarea name="comment" id="comment" placeholder="yorum ekle..." ref={content} />

                            <button onClick={submitCommentHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#dddddd">
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
                                </svg>
                            </button>

                        </div>
                        <div className="comments-block">
                            {comments.map((c, index) => (
                                <CommentComponent key={index} comment={c} />
                            ))}
                        </div>

                    </div>
                    <div className="right-block">
                        <div className="about-container content-container">
                            <div className="category-item">
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
                                    <Link to={CATEGORY_PAGE + category?.name} className="category-name">{category?.name}</Link>

                                    {/*<CategoryHoverComponent category={this.category}/> */}
                                </div>
                            </div>
                        </div>
                        <FooterComponent />
                    </div>
                </div>
            </div>
        </div>
    );

}

