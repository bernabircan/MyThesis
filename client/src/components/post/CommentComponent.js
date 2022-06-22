import {ASSETS} from "../../constants/Paths";
import { format } from "timeago.js";
import axios from "axios";
import { useEffect, useState, useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {PROFILE_PAGE} from "../../constants/routePaths";
import {dateTranslate} from "../../helper";

export default function CommentComponent({comment}) {
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [activeDelete, setActiveDelete] = useState(false);
    const [user, setUser] = useState({});
  

    useEffect(() => {
        if(comment._id){
            setUser({});
        const getUser = async () => {
            const res = await axios.get(`/users?userId=${comment.userId}`);
            setUser(res.data);
         
        };
        getUser();
        }

    
    }, [comment]);
    const handleDelete = async () => {
        setActiveDelete(!activeDelete);
        try {
          await axios.delete("/comments/" + comment._id, {
            data: { userId: currentUser._id }
          });
    
          window.location.reload()
        } catch (err) {
    
        }
      };
    

   



    const toggleDeleteComment = () => {
        setActiveDelete(!activeDelete);

    }

    
       

        return (
            <div className="comment-item">
                <div className="head-block">
                <Link to={PROFILE_PAGE + user?.username} className="user-item">

                        <picture>
                            <img src={user?.profilePicture
                                ? ASSETS + user.profilePicture
                                : ASSETS + "person/noAvatar.png"}/>
                        </picture>
                        <span>{user?.username}</span>
                    </Link>
                    <div className="time-item">
                        <span>
                            {dateTranslate(format(comment?.createdAt))}
                        </span>
                    </div>
                    {
                        (currentUser._id == user?._id) &&
                        <>
                            <div className="delete-item" onClick={toggleDeleteComment}>
                                <i className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" width="12px" fill="#000000">
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                                    </svg>
                                </i>
                            </div>
                            {
                                activeDelete &&
                                <div className="lb-root delete-post">
                                    <div className="lb-wrapper">
                                        <div className="lb-container content-container">
                                            <div className="close-block">
                                                <div className="close-item" onClick={toggleDeleteComment}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                                                         fill="#000000">
                                                        <path d="M0 0h24v24H0z" fill="none"/>
                                                        <path
                                                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <button className="btn-grey" onClick={handleDelete}>Yorumu Sil</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>
                <div className="text-block">
                    <p>{comment.desc}</p>
                </div>
            </div>
        );
    
}


