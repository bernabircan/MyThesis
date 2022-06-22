
import ChatSelectComponent from "./chatSelectComponent";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";


export default function ChatLbComponent ({closeLbFunc,chatNumb,activeConv}) {
    const { user:currentuser} = useContext(AuthContext); //current user
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState("");
    const [activeConvMes, setActiveConvMes] = useState("");


    const ActiveConvMesHandle = (index) => {
        if (activeConvMes !== index) {
            setActiveConvMes(index);}
    }
           

    const ActiveChatHandle = (index) => {
        if (activeChat !== index) {
            setActiveChat(index);}
           

       
    }
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`/conversations/${currentuser._id}`);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
       if(activeConv!="" && activeConv!=undefined){
        console.log("conv",activeConv);
        ActiveChatHandle(activeConv);

       }
        
        
    }, [activeConv]);


    /*
     useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`/conversations/${currentuser._id}`);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
        console.log("abc");
        
    }, [currentuser]); */
   
    return (
            <div className="chat-root">
                <div className="chat-wrapper">
                    {
                        conversations.length > 0 &&
                        <div className="select-chat-container">
                            {conversations.map((c, index) => (
                              
                               <ChatSelectComponent key={index} conversation={c} isActive={activeChat === c._id}
                                ActiveChatHandle={ActiveChatHandle} ActiveConvMesHandle={ActiveConvMesHandle} 
                               chatNumb={chatNumb}/>
                              
                            ))}
                        </div>
                    }

                    <div className="chat-box-container">
                        <div className="close-block">
                            <div className="close-item" onClick={closeLbFunc} >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                                     fill="#000000">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path
                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </div>
                        </div>
                        {/*
                            conversations.length < 1 &&
                            <div className="text-item">
                                <p>Aktif bir chat bulunmamaktadır.</p>
                            </div>
                */}
                    </div>
                </div>
            </div>
        );
    
}


