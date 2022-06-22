import {ASSETS, LOCAL_ASSETS} from "../constants/Paths";
import PostItemComponent from "../components/post/postItemComponent";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {CATEGORY_PAGE} from "../constants/routePaths";
import {PROFILE_PAGE} from "../constants/routePaths";

export default function SearchPage({ query }) {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [scrollingPosts, setScrollingPosts] = useState([]);
    const [scrollCount, setScrollCount] = useState(2);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {

        if (query) {

            const fetchPosts = async () => {
                const res = await axios.get("/posts/search/" + query);
                setPosts(res.data);
            };

            fetchPosts();
            const fetchCategories = async () => {
                const res = await axios.get("/categories/search/" + query);
                setCategories(res.data);
            };

            fetchCategories();
            const fetchUsers = async () => {
                const res = await axios.get("/users/search/" + query);
                setUsers(res.data);
            };

            fetchUsers();
        }

    }, [query]);

    useEffect(() => {
        window.addEventListener('scroll', loadMore);

        return () => {
            window.removeEventListener('scroll', loadMore);
        }
    });

    const loadMore = () => {
        if (document.scrollingElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) < 20) {
            setScrollingPosts(posts.slice(8, 8 + scrollCount))
            setScrollCount(scrollCount + 2)
            !isScrolled && setIsScrolled(true);
        }
    }

    return (
        <div>
            <div className="main-wrapper">
                <div className="main-container safe-area">
                    <div className="search-page-root">
                        <div className="search-page-wrapper">
                            <div className="head-container content-container">
                                <h1>
                                    "{query}" için arama sonuçları:
                                </h1>
                            </div>
                            <div className="search-container content-container user">
                                <div className="head-title-block">
                                    <h2>Kullanıcılar</h2>
                                </div>
                                <div className="users-container">
                                    <div className="users-block">
                                        {
                                            users.map((user, index) => (
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
                                                        <Link to={PROFILE_PAGE + user?.username} className="user-name">{user.username}</Link>
                                                        {/*<ProfileHoverComponent user={user}/>*/}
                                                    </div>
                                                 
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="search-container content-container categories">
                                <div className="head-title-block">
                                    <h2>Kategoriler</h2>
                                </div>
                                <div className="categories-block">
                                    {
                                        categories.map((category) => (
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
                                                     <Link to={ CATEGORY_PAGE + category?.name} className="category-name">{category.name}</Link>
                                                </div>
                                              
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="search-container posts">
                                <div className="head-title-block">
                                    <h2>Postlar</h2>
                                </div>
                                <div className="posts-container">
                                    {
                                        posts.slice(0, 8).map((post) =>
                                            <PostItemComponent key={post._id} post={post}/>
                                        )
                                    }

                                    {
                                        isScrolled &&
                                        scrollingPosts.map((post) =>
                                            <PostItemComponent key={post._id} post={post}/>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}

