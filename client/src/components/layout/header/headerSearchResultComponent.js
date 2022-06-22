import {SearchContext} from "../../../context/SearchContext";
import {useEffect, useState, useContext, useRef,} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {ASSETS} from "../../../constants/Paths";
import {CATEGORY_PAGE, LOGIN_PAGE} from "../../../constants/routePaths";
import {PROFILE_PAGE} from "../../../constants/routePaths";
import {POST_PAGE} from "../../../constants/routePaths";
import {SEARCH_PAGE} from "../../../constants/routePaths";
import HeaderSearchResultContainerComponent from "./headerSearchResultContainerComponent";

export default function HeaderSearchResultComponent({query, setQuery}) {
    const searchBox = useRef();
    const searchContext = useContext(SearchContext);

    const searchQueryHandler = () => {
        searchContext.searchHandler(query);
        setQuery("");
    };

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);


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
        window.addEventListener('click', windowClicked);

        return () => {
            window.removeEventListener('click', windowClicked);
        }
    });

    const windowClicked = (e) => {
        if (searchBox.current && !searchBox.current.contains(e.target)) {
            setQuery("");
        }
    }

    return (
        <div className="search-result-root" ref={searchBox}>
            <div className="search-category-wrapper">

                <div className="title-item">
                    <p>Kullanıcılar</p>
                </div>
                {
                    users?.slice(0, 2).map((user) => (
                        <HeaderSearchResultContainerComponent
                            key={user._id} user={user} type={"user"} setQuery={setQuery}
                        />
                    ))}
            </div>
            <div className="search-category-wrapper">
                <div className="title-item">
                    <p>Kategoriler</p>
                </div>
                {
                    categories?.slice(0, 2).map((category) => (
                        <HeaderSearchResultContainerComponent
                            key={category._id} category={category} type={"category"} setQuery={setQuery}
                        />
                    ))}
            </div>
            <div className="search-category-wrapper">
                <div className="title-item">
                    <p>Gönderiler</p>
                </div>
                {
                    posts?.slice(0, 2).map((post) => (
                        <HeaderSearchResultContainerComponent
                            key={post._id} post={post} type={"post"} setQuery={setQuery}
                        />
                    ))}
            </div>

            {
                query !== "" &&
                <Link to={SEARCH_PAGE} className={"click-for-more-btn"} onClick={searchQueryHandler}>
                    <div className="btn-grey">
                        daha fazlası
                    </div>
                </Link>
            }
        </div>
    );

};
