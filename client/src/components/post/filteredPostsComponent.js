import React from "react";
import PostItemComponent from "./postItemComponent";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {logDOM} from "@testing-library/react";
import CategoriesPageItemComponent from "../category/categoriesPageItemComponent";
import LoaderComponent from "../common/loaderComponent";

export default function FilteredPostsComponent({activeFilterTab}) {
    const [posts, setPosts] = useState([]);
    const {user: currentUser, dispatch} = useContext(AuthContext);
    const [scrollingPosts, setScrollingPosts] = useState([]);
    const [scrollCount, setScrollCount] = useState(2);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`/users?username=${currentUser.username}`);
                dispatch({type: "GET_CURRENT_USER", payload: res.data});
            } catch (err) {
            }
        };
        fetchCurrentUser();

    }, []);

    useEffect(() => {
        //console.log("username",username);
        setPosts([]);

        const fetchPosts = async () => {
            try {
                let res;

                switch (activeFilterTab) {
                    case "user":
                        res = await axios.get("/posts/all");

                        await setPosts(
                            res.data.filter(post =>
                                currentUser._id === post.userId ||
                                currentUser.followings.includes(post.categoryId) ||
                                currentUser.followingfriends.includes(post.userId)
                            ).reverse()
                        );
                        break;
                    case "popular":
                        res = await axios.get("/posts/all");
                        await setPosts(
                            res.data.reverse().sort((postA, postB) =>
                                postB.likes.length - postA.likes.length
                            )
                        );
                        break;
                    case "new":
                        res = await axios.get("/posts/all");
                        await setPosts(res.data.reverse());
                        break;
                }

            } catch (err) {
                console.log(err)
            }

        };

        fetchPosts();

        scrollCount !== 2 && setScrollCount(2)
        scrollingPosts === [] && setScrollingPosts([])
        isScrolled && setIsScrolled(false);

    }, [activeFilterTab]);

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
        <div className="posts-container">

            {
                posts.length === 0 &&
                <div className="loader-landing-page">
                    <LoaderComponent/>
                </div>
            }

            {
                posts &&
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
    );

}

