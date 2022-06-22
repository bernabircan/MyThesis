
import PostsComponent from "../components/post/postsComponent";
import CreatePostLbComponent from "../components/common/createPostLbComponent";
import CreatePostsComponent from "../components/landing/createPostsComponent";
import FilterTabsComponent from "../components/landing/filterTabsComponent";

import SubscribeButtonComponent from "../components/common/subscribeButtonComponent";
import {ASSETS, LOCAL_ASSETS} from "../constants/Paths";
import ProfileHoverComponent from "../components/common/profileHoverComponent";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router"
import { AuthContext } from "../context/AuthContext";
import HeaderComponent from "../components/layout/header/headerComponent";
import { Link } from "react-router-dom";
import {PROFILE_PAGE} from "../constants/routePaths";
import FooterComponent from "../components/landing/footerComponent";

export default function CategoryPage() {
    const [category, setCategory] = useState({});
    const categoryname = useParams().categoryname;
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [displayFollowedButton, setDisplayFollowedButton] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`/users?username=${currentUser.username}`);
                dispatch({ type: "GET_CURRENT_USER", payload: res.data });
            } catch (err) { }
        };
        fetchCurrentUser();
        //console.log("deneme");
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await axios.get(`/categories?categoryname=${categoryname}`);
            setCategory(res.data);
        };
        fetchCategory();
    }, [categoryname]);

    useEffect(() => {
        if (category?._id) {
            setFollowed(currentUser.followings.includes(category._id));
            const fetchFollowingList= async () => {
                const res = await axios.get(`/categories/userlist/${category._id}`);
                setFollowingList(res.data);
            };
            fetchFollowingList();
            setDisplayFollowedButton(true);
        };
    }, [category, followed]);

    const handleFollowedClick = async () => {
        console.log("followed", followed)
        try {
            if (followed) {
                await axios.put(`/categories/${category._id}/unfollow`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "UNFOLLOW_CAT", payload: category._id });
            } else {
                await axios.put(`/categories/${category._id}/follow`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "FOLLOW_CAT", payload: category._id });
            }
            setFollowed(!followed);
        } catch (err) { }
    };

    const toggleCreatePost = () => {
        setIsCreatePostOpen(!isCreatePostOpen)
    }

    return (
        <div>
            <div className="profile-category-page-root category">
                <div className="head-wrapper">
                    <div className="top-container" />
                    <div className="head-container">
                        <div className="safe-area">
                            <div className="head-block">
                                <div className="img-item">
                                    <picture>
                                        {
                                            category?.categoryPath &&
                                            <img src={`${LOCAL_ASSETS}/img/category/${category?.categoryPath}.jpg`}
                                                 alt={category?.name} />
                                        }
                                    </picture>
                                </div>
                                <div className="text-item">
                                    <h1>{category?.name}</h1>
                                </div>
                                {((displayFollowedButton == true)) && (

                                    <div className="btn-item" onClick={handleFollowedClick}>
                                        <span className={`${currentUser?.followings.includes(category._id) ? "btn-white-blue" : "btn-blue"}`} >
                                            {currentUser?.followings.includes(category._id) ? "Takip Ediliyor" : "Takip Et"}
                                        </span>
                                    </div>

                                )}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-wrapper">
                    <div className="main-container safe-area">
                        <div className="left-block">

                            {
                                category.categoryPath === "bilgisayar-muhendisligi" &&
                                <div className="iframe-container">
                                    <iframe src="https://bilmuh.ege.edu.tr/" scrolling="no" target="_blank"/>
                                </div>
                            }

                            <CreatePostsComponent openCreatePost={() => toggleCreatePost()} />

                            {isCreatePostOpen && (<CreatePostLbComponent catName={categoryname} closeCreatePost={() => toggleCreatePost()} />)}

                            {/*<FilterTabsComponent tab={"popular"} forUser={false} />*/}
                            <PostsComponent categoryname={category?.name} />
                        </div>
                        <div className="right-block">
                            <div className="about-me-container content-container">
                                <div className="head-title-block">
                                    <h2>Hakkında</h2>
                                </div>
                                <div className="about-me-block">
                                    <div className="text-item">
                                        <p>{category?.desc}</p>
                                    </div>
                                    <div className="subs-item">
                                        <span className="sub-num">
                                        {(displayFollowedButton===true) &&
                                        (<span className="sub-num">
                                            {followingList?.length}
                                        </span>) }
                                        </span>
                                        <span className="text">
                                            Takipçi
                                        </span>
                                    </div>
                                </div>

                            </div>
                            <div className="users-container content-container">
                                <div className="head-title-block">
                                    <h2>Takipçiler</h2>
                                </div>
                                <div className="users-block">
                                    {
                                        (followingList.length>0) && followingList.map((user) => (
                                            <div className="user-item" key={user._id}>
                                                <div className="user">
                                                    <div className="user-img">
                                                        <picture>
                                                            <img src={user?.profilePicture
                                                                ? ASSETS + user.profilePicture
                                                                : ASSETS + "person/noAvatar.png"}
                                                                 alt="pp" />
                                                        </picture>
                                                    </div>
                                                    <Link to={PROFILE_PAGE + user.username} className="user-name">
                                                        {user.username}
                                                    </Link>
                                                    {/*<ProfileHoverComponent user={user}/>*/}
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>

                            </div>
                            <FooterComponent />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );

}


