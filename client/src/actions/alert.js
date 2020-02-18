import uuid from 'uuid'
import { set_Alert, romove_Alert } from './types';



export const setAlert = ( msg, alertType,timeOut=5000 ) => dispatch => {

    const id = uuid.v4();
    dispatch ( {
            type: set_Alert,
            payload:{msg,alertType,id}
    } )
    setTimeout(()=>dispatch( {
        type: romove_Alert,
        payload:id
} ),timeOut)
}