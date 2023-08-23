import { Types } from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  activeArea: [],
  user: null,
  signUpInfo: null,
  typeUsers: [],
  allAgents: [],
  allActiveShowing: [],
  myActiveShowing: [],
  mySellerInfo: [],
  allSellerInfo: [],
  myBuyerInfo: [],
  allBuyerInfo: [],
  error: null,
  phoneStatus: false
};

type ActionType = {
  type: string;
  payload: any;
};

type StateType = {
  token: string | null;
  isAuthenticated: boolean;
  activeArea: Array<any>;
  user: null;
  signUpInfo: null;
  typeUsers: Array<any>;
  allAgents: Array<any>;
  allActiveShowing: Array<any>;
  myActiveShowing: Array<any>;
  mySellerInfo: Array<any>;
  allSellerInfo: Array<any>;
  myBuyerInfo: Array<any>;
  allBuyerInfo: Array<any>;
  error: null;
  phoneStatus: boolean;
};

const authReducer = (
  state: StateType = initialState,
  action: ActionType = { type: '', payload: null }
) => {
  switch (action.type) {
    case Types.GET_ACTIVE_SHOWING:
      return {
        ...state,
        myActiveShowing: action.payload
      };
    case Types.GET_ALL_ACTIVE_SHOWING:
      return {
        ...state,
        allActiveShowing: action.payload
      };
    case Types.GET_ALL_AGENT:
      return {
        ...state,
        allAgents: action.payload
      };
    case Types.GET_FARMING_AREA:
      return {
        ...state,
        activeArea: action.payload
      };
    case Types.SET_FARMING_AREA:
      return {
        ...state,
        activeArea: action.payload
      };
    case Types.GET_USER_TYPE:
      return {
        ...state,
        typeUsers: action.payload
      };
    case Types.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        signUpInfo: null
      };
    case Types.LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        signUpInfo: null
      };
    case Types.SET_SIGNUP_INFO:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        signUpInfo: action.payload
      };
    case Types.GET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case Types.SET_PHONE_STATUS:
      return {
        ...state,
        phoneStatus: action.payload
      };
    case Types.UPDATE_PHONE:
      return {
        ...state,
        user: action.payload
      };
    case Types.GET_MY_SELLER_INFO:
      return {
        ...state,
        mySellerInfo: action.payload
      };
    case Types.GET_ALL_SELLER_INFO:
      return {
        ...state,
        allSellerInfo: action.payload
      };
    case Types.GET_MY_BUYER_INFO:
      return {
        ...state,
        myBuyerInfo: action.payload
      };
    case Types.GET_ALL_BUYER_INFO:
      return {
        ...state,
        allBuyerInfo: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
