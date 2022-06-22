import React, { Component } from 'react';
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { POST_PAGE } from "../../../constants/routePaths";
import {PROFILE_PAGE} from "../../../constants/routePaths";
import { Link } from "react-router-dom";

export default function NotifyItemComponent({ notifyData, isOpened }) {
    const [user, setUser] = useState({});

    const notificationSeen = () => {

    }

    useEffect(() => {
        if (notifyData._id) {
            const fetchUser = async () => {
                const res = await axios.get(`/users?userId=${notifyData.senderId}`);
                setUser(res.data);
            };
            fetchUser();

        }

    }, [notifyData]);

    useEffect(() => {
        if (notifyData.isNew == "T" && isOpened) {


            const updateNotify = async () => {

                try {
                    const res = await axios.put("/notifications/" + notifyData._id, { isNew: "F" });


                } catch (err) {
                    console.log("eror", err);
                }
            }
            updateNotify();

        }



    }, [notifyData]);





    return (
        <div className={`notify-item ${notifyData?.isNew == "T" ? "new" : ""}`} onClick={notificationSeen}>


            {

                notifyData.action === "3" &&
                <Link to={PROFILE_PAGE + user?.username} className="logo-item">
                    <div>{user?.username} seni takip etti.</div>
                </Link>

            }

            {
                notifyData.action === "1" &&
                <Link to={POST_PAGE + notifyData.postId} className="logo-item">
                    <div>{user?.username} gönderini beğendi</div>
                </Link>
            }


            {
                notifyData.action === "2" &&
                <Link to={POST_PAGE + notifyData.postId} className="logo-item">
                    <div> {user?.username} gönderine yorum yaptı.</div>
                </Link>


            }
        </div>
    );

}
