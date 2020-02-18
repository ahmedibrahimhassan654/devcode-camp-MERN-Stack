import axios from 'axios';
import { setAlert } from './alert';
import { register_Success, register_Fail, user_Loaded, auth_Error } from './types';
import setAuthToken from '../utils/setAuthToken';



export const loadUser = () => async dispatch => {

    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {

        const res = await axios.get('/api/auth');

        dispatch({
            type: user_Loaded,
            payload: res.data
        });

    } catch (error) {
        dispatch({
            type: auth_Error,
            
        });
    }


};




export const register = ({ name, email, password }) => async dispatch => {

    const config = {
        headers: {
            'content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: register_Success,
            payload: res.data
        });

    } catch (err) {
        //display errors to user
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });

        }
        dispatch({
            type: register_Fail
        });
    }

};