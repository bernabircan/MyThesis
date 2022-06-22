import React, { useState } from "react";
import { io } from "socket.io-client"
import { createContext, useEffect, useReducer } from "react";
import SocketReducer from "./SocketReducer";




export const sockett = io.connect("http://localhost:8900/")

const INITIAL_STATE = {
  users:JSON.parse(localStorage.getItem("users")) || [],
  socket:{},
};

export const SocketContext= React.createContext(INITIAL_STATE);



// Defining a simple HOC component
export const SocketContextProvider = (props) => {
  const [state, dispatch] = useReducer(SocketReducer, INITIAL_STATE);
  
  useEffect(()=>{
    localStorage.setItem("users", JSON.stringify(state.users))
  },[state.users])
    
 
    return (
    <SocketContext.Provider
     value={{
        users: state.users,
        socket:sockett,
        dispatch,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

