import React, {Component} from "react";
import {ASSETS} from "../../constants/Paths";
import { AuthContext } from "../../context/AuthContext";
import { useEffect, useState, useContext } from "react";
import {PROFILE_PAGE} from "../../constants/routePaths";
import {Link} from "react-router-dom";


export default function CreatePostsComponent({openCreatePost}){
    const { user, dispatch } = useContext(AuthContext);
    
    return (
            <div className="content-container create-post-container">
                <Link to={ PROFILE_PAGE + user?.username} className="img-item">
                    <picture>
                        <img src={user?.profilePicture
                            ? ASSETS + user.profilePicture
                            : ASSETS + "person/noAvatar.png"}
                             alt="pp" />
                    </picture>
                </Link>
                <div className="input-block">
                    <div className="input-item" onClick={openCreatePost}>
                        <input type="text" placeholder="Gönderi Oluştur"/>
                    </div>
                </div>
            </div>
        );
    
}


