/**
 * User Reducer
 */

// Set initial state
const initialState = {}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD': {
            return {
                ...state,
                data: action.data
            };
        }

        case 'EDIT': {
            return {
                ...state,
                editData: action.data
            }
        }

        default:
            return state;
    }
}