import { SearchContext } from "../../../context/SearchContext";
import React, {useEffect, useState, useContext, useRef,} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {ASSETS, LOCAL_ASSETS} from "../../../constants/Paths";
import {CATEGORY_PAGE} from "../../../constants/routePaths";
import {PROFILE_PAGE } from "../../../constants/routePaths";
import { POST_PAGE } from "../../../constants/routePaths";
import {SEARCH_PAGE} from "../../../constants/routePaths";

export default function HeaderSearchResultContainerComponent({type, user, category, post, setQuery}) {

    return (
        <>
            {
                type === "user" &&
                <div className="result-container" onClick={()=>{setQuery("")}}>
                    <Link to={PROFILE_PAGE + user.username} className="result-block">
                        <div className="img-item">
                            <picture>
                                <img src={user?.profilePicture
                                    ? ASSETS + user.profilePicture
                                    : ASSETS + "person/noAvatar.png"}
                                     alt="pp" />
                            </picture>
                        </div>
                        <div className="text-item">
                            <p>{user.username}</p>
                        </div>
                    </Link>
                </div>
            }
            {
                type === "category" &&
                <div className="result-container" onClick={()=>{setQuery("")}}>

                    <Link to={CATEGORY_PAGE + category.name} className="result-block">
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
                            <p>{category.name}</p>
                        </div>
                    </Link>

                </div>
            }
            {
                type === "post" &&
                <div className="result-container" onClick={()=>{setQuery("")}}>
                    <Link to={POST_PAGE + post._id} className="result-block">
                        <div className="text-item">
                            <p>{post.desc}</p>
                        </div>
                    </Link>

                </div>
            }
        </>
    );

};
