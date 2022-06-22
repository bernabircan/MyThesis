const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "GET_CURRENT_USER":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
      case "LOGOUT":
        return {
          user: null,
          isFetching: false,
          error: false,
        };
    case "ADD_FRIEND":
      return {
        ...state,
        user: {
          ...state.user,
          followingfriends: [...state.user. followingfriends, action.payload],
        },
      };
    case "REMOVE_FRIEND":
      return {
        ...state,
        user: {
          ...state.user,
          followingfriends: state.user. followingfriends.filter(
            (friend) => friend !== action.payload
          ),
        },
      };
      case "FOLLOW_CAT":
        return {
          ...state,
          user: {
            ...state.user,
            followings: [...state.user.followings, action.payload],
          },
        };
      case "UNFOLLOW_CAT":
        return {
          ...state,
          user: {
            ...state.user,
            followings: state.user.followings.filter(
              (follow) => follow !== action.payload
            ),
          },
        };
    default:
      return state;
  }
};

export default AuthReducer;