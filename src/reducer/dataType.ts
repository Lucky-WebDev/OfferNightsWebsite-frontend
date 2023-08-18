export interface StateType {
    auth: {
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
    }
    error: {
        errors: null
    }
};

export interface UserType {
    _id: string,
    type: string,
    firstName: string,
    middleName: string,
    lastName: string,
    avatar: string,
    cell: string,
    email: string,
    tradeName: string,
    brokerageName: string,
    brokerageAddress: string,
    brokerageCity: string,
    brokeragePostalCode: string,
    brokeragePhone: string,
    pictures: []
};

