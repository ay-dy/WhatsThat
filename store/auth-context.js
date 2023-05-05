import { createContext, useState } from "react";

export const AuthContext = createContext({
    id: null,
    token: null,
    isAuthenticated: false,
    isFetching: false,
    authenticate: (id, token) => { },
    setFetchingState: (bool) => { },
    logout: () => { }
});

export default function AuthContextProvider({ children }) {
    const [authToken, setAuthToken] = useState();
    const [userId, setUserId] = useState();
    const [isFetching, setIsFetching] = useState();

    function authenticate(id, token) {
        setUserId(id);
        setAuthToken(token);
    }

    function setFetchingState(bool) {
        setIsFetching(bool);
    }

    function logout() {
        setUserId(null);
        setAuthToken(null);
    }

    const value = {
        id: userId,
        token: authToken,
        isAuthenticated: !!authToken,
        isFetching: isFetching,
        authenticate: authenticate,
        setFetchingState: setFetchingState,
        logout: logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}