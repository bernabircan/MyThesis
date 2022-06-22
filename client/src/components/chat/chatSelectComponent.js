import React from "react";
import { ASSETS } from "../../constants/Paths";
import MessageComponent from "./messageComponent";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { SocketContext } from "../../context/SocketContext";
import LoaderComponent from "../common/loaderComponent";

export default function ChatSelectComponent({ conversation, isActive, ActiveChatHandle, ActiveConvMesHandle, chatNumb }) {
    const { user: currentuser } = useContext(AuthContext); //current user
    const [user, setUser] = useState({}); // coversationdaki current userın konuştuğu kişi friend
    const { socket, users: onlineUsers } = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null); //socketle gelen mesaj
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();
    const [totalMes, setTotalMes] = useState(0);
    const [convMes, setConvMes] = useState(0);
    const [newArrival, setNewArrival] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [isLoaderActive, setIsLoaderActive] = useState(false);

    /*
  useEffect(() => {
      if (chatNumb) {
          chatNumb(1)
          //console.log("abc")


      };
  }, []);*/


    useEffect(() => {
        var friendId;
        if (conversation._id) {
            if (conversation.members[0] == currentuser._id) {
                friendId = conversation.members[1]
            } else if (conversation.members[1] == currentuser._id) {
                friendId = conversation.members[0]

            }
            const getUser = async () => {
                try {
                    const res = await axios("/users?userId=" + friendId); //friendin bilgileri çektik aşağıda kullanmak için
                    setUser(res.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getUser();
        }
    }, [conversation, currentuser]);

    useEffect(() => {
        if (isActive) {
        
            const getMessages = async () => {
                try {
                    const res = await axios.get("/messages/" + conversation._id); //current chat varsa önemli
                    setMessages(res.data);
                } catch (err) {
                    console.log(err);
                }
            };
            getMessages();

            scrollRef.current.scrollIntoView({ behaviour: "smooth" })
            setTimeout(()=>{
                setIsLoaderActive(false)
                setIsScrolledToBottom(true);
            }, 500)
        }

        else {
            setIsScrolledToBottom(false);
            setIsLoaderActive(true);

        
        }

    }, [isActive]);

    const onClickFunc = () => {
        ActiveChatHandle(conversation._id);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: currentuser._id,
            conversationId: conversation._id,
            isNew: "T",
            text: newMessage,
        };

        const receiverId = conversation.members.find(
            (member) => member !== currentuser._id
        );


        if (onlineUsers.includes(currentuser._id) && onlineUsers.includes(receiverId)) {
            console.log("ikiside online followhandler")
            socket.emit("sendNotification", { receiverId, });

            socket.emit("sendMessage", { //servera mesaj göndermek için istek atiyom -mesaj göndermek 1
                senderId: currentuser._id,
                receiverId,
                conversationId: conversation._id,
                text: newMessage,
            });
        }
        setNewMessage("");
        try {
            const res = await axios.post("/messages", message); //current chat varsa önemli
            setMessages([...messages, res.data]); //messages listesine yeni mesajı ekledik ekranda gözükmesi için 
        } catch (err) {
            console.log(err);
        }

    };

    useEffect(() => {
        socket.on("getMessage", (data) => {  //serverden gelen mesajı almak için -mesaj göndermek 4
            setArrivalMessage({
                sender: data.senderId,
                conversationId: data.conversationId,
                text: data.text,
                createdAt: Date.now(),
            });

        });


    }, []);

    useEffect(() => {
        if (arrivalMessage) {
            console.log(arrivalMessage);

            if (conversation?.members.includes(arrivalMessage.sender)) {
                setMessages((prev) => [...prev, arrivalMessage]);

            }
        
       };

    }, [arrivalMessage]);

    return (
        <div className={`user-item ${isActive ? "active" : ""}  ${(false) ? "new-messages" : ""} ${onlineUsers?.includes(user._id) ? "online-user" : ""}`} onClick={onClickFunc} >

            <div className="user-img">
                <picture>
                    <img src={user?.profilePicture
                        ? ASSETS + user.profilePicture
                        : ASSETS + "person/noAvatar.png"}
                         alt="pp" />
                </picture>
            </div>

            <div className="user-name" >
                {user?.username }
            </div>

            {/*
                convMes > 0 &&
                <span>{convMes}</span>
                    */}

            {
                !currentuser.followingfriends.includes(user._id) &&
                <div className="not-following-block">
                    <div className="not-following-item">
                        <i>
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#ffae42">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                            </svg>
                        </i>
                        <span className="not-following-msj">bu kişiyi takip etmiyorsun</span>
                    </div>
                </div>
            }

            <div className="chat-box-block">
                <div className={`chat-box ${isScrolledToBottom ? "scrolled" : ""}`} >
                    <div className="message-container" ref={scrollRef} >
                        {messages.map((m, index) => (

                            <MessageComponent
                                key={index}
                                message={m}
                                isOwn={(m.sender === currentuser._id)}
                                user={user}
                            />
                        ))}
                    </div>
                </div>

                {
                    isLoaderActive &&
                    <LoaderComponent/>
                }

                <div className="chat-input-block">
                    <div className="chat-input-item">
                        <textarea placeholder="bi' şeyler yaz..."
                            onChange={(e) => { setNewMessage(e.target.value) }}
                            value={newMessage} />
                        <button onClick={handleSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#dddddd">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        
        </div>
    );

}

