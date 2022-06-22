import React, { Component } from "react";
import {ASSETS, LOCAL_ASSETS} from "../../constants/Paths";
import SubscribeButtonComponent from "./subscribeButtonComponent";

export default function CategoryHoverComponent({ category }) {

    return (
        <div className="hover-lb category-lb">
            <div className="head-block">
                <div className="name-item">
                    <div className="img-item">
                        <picture>
                            {
                                category?.categoryPath &&
                                <img src={`${LOCAL_ASSETS}/img/category/${category?.categoryPath}.jpg`}
                                     alt={category?.name} />
                            }
                        </picture>
                    </div>
                    <a href="#" className="name">{category?.name}</a>
                </div>
                <div className="subs-item">
                    <span className="sub-num">
                        {category?.followers.length}
                    </span>
                    <span className="text">
                        Takipçi
                    </span>
                </div>
            </div>
            <div className="desc-item">
                <p>{category?.desc}</p>
            </div>
            <div className="btn-item">
                <SubscribeButtonComponent isSubscriber={false} />
            </div>
        </div>
    );

}

