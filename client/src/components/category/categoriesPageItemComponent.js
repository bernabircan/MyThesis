
import { LOCAL_ASSETS } from "../../constants/Paths";
import { CATEGORY_PAGE } from "../../constants/routePaths";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";

export default function CategoriesPageItemComponent({ cat }) {
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(currentUser.followings.includes(cat._id));

   

    const handleFollowedClick = async () => {
        try {
            
            if (followed) {
                await axios.put(`/categories/${cat._id}/unfollow`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "UNFOLLOW_CAT", payload: cat._id });
            } else {
                await axios.put(`/categories/${cat._id}/follow`, {
                    userId: currentUser._id,
                });
                dispatch({ type: "FOLLOW_CAT", payload: cat._id });
            }

            setFollowed(!followed);
        } catch (err) { }
    };

    return (
        <div className="category-item"  >
            <div className="category" >
                <div className="category-img">
                    <picture>
                        {
                            cat?.categoryPath &&
                            <img src={`${LOCAL_ASSETS}/img/category/${cat?.categoryPath}.jpg`}
                                 alt={cat?.name} />
                        }
                    </picture>
                </div>
                <Link to={CATEGORY_PAGE + cat.name} className="category-name" >
                    {cat.name}
                </Link>
            </div>
            <div className="btn-item" onClick={handleFollowedClick}>
                <span className={`${followed ? "btn-white-blue" : "btn-blue"}`} >
                    {followed ? "Takip Ediliyor" : "Takip Et"}
                </span>
            </div>
            {/*<CategoryHoverComponent category={cat} />*/}
        </div>
    );
}


