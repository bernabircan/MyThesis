import axios from "axios";
import {toast} from 'react-toastify';


export const loginCall = async (userCredential, dispatch) => {

    dispatch({type: "LOGIN_START"});
    try {
        const res = await axios.post("auth/login", userCredential);
        dispatch({type: "LOGIN_SUCCESS", payload: res.data});
        return true;
    } catch (err) {
        toast.error("şifre ya da email hatalı");
        dispatch({type: "LOGIN_FAILURE", payload: err});
        return false;
    }
};
