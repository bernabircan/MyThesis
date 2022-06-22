import CreatePostsComponent from "../components/landing/createPostsComponent";
import FilterTabsComponent from "../components/landing/filterTabsComponent";
import PostsComponent from "../components/post/postsComponent";
import PopularCategoriesComponent from "../components/landing/popularCategoriesComponent";
import CreatePostLbComponent from "../components/common/createPostLbComponent";
import {useEffect, useState, useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import axios from "axios";
import FooterComponent from "../components/landing/footerComponent";
import FilteredPostsComponent from "../components/post/filteredPostsComponent";

export default function LandingPage() {
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const {user: currentUser, dispatch} = useContext(AuthContext);
    const [activeFilterTab, setActiveFilterTab] = useState("user");

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

    const toggleCreatePost = () => {
        setIsCreatePostOpen(!isCreatePostOpen)
    }

    return (
        <div>
            <div className="main-wrapper">
                <div className="main-container safe-area">
                    <div className="left-block">
                        <CreatePostsComponent openCreatePost={() => toggleCreatePost()}/> {/*post olusturma*/}

                        {
                            isCreatePostOpen &&
                            <CreatePostLbComponent closeCreatePost={() => toggleCreatePost()}/>
                        }

                        <FilterTabsComponent activeTab={activeFilterTab} setActiveTab={setActiveFilterTab}/>

                        {/*<PostsComponent timeline={"timeline"}/>*/}

                        <FilteredPostsComponent activeFilterTab={activeFilterTab}/>
                    </div>
                    <div className="right-block">
                        <PopularCategoriesComponent/>
                        <FooterComponent/>
                    </div>
                </div>
            </div>

        </div>
    );

}


