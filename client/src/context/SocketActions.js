
  export const GetOnlineUsers = (users) => ({
    type: "GET_ONLINE_USERS",
    payload: users,
  });
  
   export const AddUser = (userId) => ({
    type: "ADD_USER",
    payload: userId,
  });
  
  export const RemoveUser = (userId) => ({
    type: "REMOVE_USER",
    payload: userId,
  });
  export const NoConnect= () => ({
    type: "NO_CONNECT",
  });