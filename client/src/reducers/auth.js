import { register_Success, register_Fail, user_Loaded, auth_Error } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthonticate: null,
    loading: true,
    user: null
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {

        case user_Loaded:
            return {
                ...state,
                isAuthonticate: true,
                loading: false,
                user: payload
            };

        case register_Success:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthonticate: true,
                loading: false,

            };
        case register_Fail:
        case  auth_Error:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthonticate: false,
                loading: false,

            };


        default:
            return state;
    }

}