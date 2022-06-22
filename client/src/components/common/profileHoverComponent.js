import React, { Component } from "react";
import { ASSETS } from "../../constants/Paths";
import SubscribeButtonComponent from "./subscribeButtonComponent";

export default function profileHoverComponent({ user }) {


    return (
        <div className="hover-lb user-lb">
            <div className="head-block">
                <div className="name-item">
                    <div className="img-item">
                        <picture>
                            <img src={user?.profilePicture
                                ? ASSETS + user.profilePicture
                                : ASSETS + "person/noAvatar.png"}
                                 alt="pp" />
                        </picture>
                    </div>
                    <a href="#" className="name">
                        <span>{user?.userName}</span>
                    </a>
                </div>
                <div className="subs-item">
                    <span className="sub-num">
                        {user?.subs.length}
                    </span>
                    <span className="text">
                        Takipçi
                    </span>
                </div>
            </div>
            <div className="btn-item">
                <span className="btn-white-blue">Mesaj At</span>
                <SubscribeButtonComponent isSubscriber={false} />
            </div>
        </div>
    );

}

