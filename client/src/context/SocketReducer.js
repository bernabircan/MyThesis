const SocketReducer = (state, action) => {
    switch (action.type) {
        /*
        case "ADD_USER":
            return {
                ...state,
                users:
                    [...state.users, action.payload],

            };
        case "REMOVE_USER":
            return {
                ...state,
                users: [
                    ...state.users,
                    state.users.filter(
                        (userId) => userId !== action.payload
                    ),

                ],
            };
             */
        case "GET_ONLINE_USERS":
            return {
                users: action.payload,

            };
           
        case "No_CONNECT":
            return {
                users: [],

            };

        default:
            return state;
    }
};

export default SocketReducer;