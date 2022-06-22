import {ASSETS, LOCAL_ASSETS} from "../../constants/Paths";
import { format } from "timeago.js";
import { useRef,useEffect,useContext} from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import {Link} from "react-router-dom";
import {PROFILE_PAGE} from "../../constants/routePaths";
import {dateTranslate} from "../../helper";


export default function  MessageComponent({isOwn, message,isActiveMes,user}) {
    const scroll= useRef();
    const { user: currentUser } = useContext(AuthContext); //current user

    useEffect(() => {
        scroll.current.scrollIntoView({ behaviour: "smooth" })
      
     },[message]);

     useEffect(() => {
        if (message.isNew === "T" && ( message.sender !== currentUser._id) ) {
            console.log("abc");

            const updateMessage = async () => {

                try {
                    const res = await axios.put("/messages/new/" + message._id, { isNew: "F" });


                } catch (err) {
                    console.log("eror", err);
                }
            }
            updateMessage(); 

        }



    }, [message]);

   
    

    return (
            <div className={`message-block ${isOwn ? "right" : ""}`} ref={scroll}  >
                <div className="message-item">
                    <Link className="user-img" to={ PROFILE_PAGE + user?.username}>
                        <picture>
                            <img src={user?.profilePicture
                                ? ASSETS + user.profilePicture
                                : ASSETS + "person/noAvatar.png"}
                                 alt="pp" />
                        </picture>
                    </Link>
                    <span className="message">
                        {message.text}
                    </span>
                </div>
                <p className="time-text">
                    {dateTranslate(format(message?.createdAt))}
                </p>
            </div>
        );
    
}

