import React, {Component} from "react";
import PostItemComponent from "./postItemComponent";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";

export default function PostsComponent({username, categoryname, timeline, activeFilterTab}) {
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
                var res;

                //setPosts([]);

                if (categoryname) {

                    res = await axios.get("/categories/posts/" + categoryname)
                    setPosts(
                        res.data.sort((p1, p2) => {
                            return new Date(p2.createdAt) - new Date(p1.createdAt);
                        }));

                } else if (username) {

                    res = await axios.get("/posts/profile/" + username)
                    setPosts(
                        res.data.sort((p1, p2) => {
                            return new Date(p2.createdAt) - new Date(p1.createdAt);
                        }));

                } else if (timeline) {

                    res = await axios.get("/posts/timeline/" + currentUser._id);
                    setPosts(
                        res.data.sort((p1, p2) => {
                            return new Date(p2.createdAt) - new Date(p1.createdAt);
                        }));

                }

            } catch (err) {
                console.log(err)
            }

        };

        fetchPosts();

    }, [username, categoryname]);

    useEffect(() => {
        window.addEventListener('scroll', loadMore);

        return () => {
            window.removeEventListener('scroll', loadMore);
        }
    });

    const loadMore = () => {

        if (document.scrollingElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) < 20) {
            console.log("scrolled")
            setScrollingPosts(posts.slice(8, 8 + scrollCount))
            setScrollCount(scrollCount + 2)
            setIsScrolled(true);
        }
    }

    return (
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
    );

}

