import { Types } from '../actions/types';

const initialState = {
    error: null
};

type ActionType = {
    type: string;
    payload: string;
};

type StateType = {
    error: string | null;
};

const errorReducer = (state: StateType = initialState, action: ActionType = { type: '', payload: '' }) => {
    switch (action.type) {
        case Types.GET_ERROR:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        default:
            return state;
    }
}

export default errorReducer;
