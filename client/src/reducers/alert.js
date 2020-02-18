

import{set_Alert,romove_Alert}from '../actions/types'
const initialState = []
 
export default function ( state = initialState, action ) {
  const {type,payload}=action
    switch ( type ) {
        case set_Alert:
            return [...state, payload]
        case romove_Alert:
            return state.filter( alert => alert.id !==payload )
        default:
            return state
    }
}