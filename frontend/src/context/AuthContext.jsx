import { createContext, useContext, useEffect, useState } from "react";

import {
    login as loginRequest,
    logout as logoutRequest,
    getProfile,
    isAuthenticated,
} from "../services/auth";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function loadUser() {

            if (isAuthenticated()) {

                try {
                    const response = await getProfile();

                    setUser(response.data);

                } catch (error) {

                    logoutRequest();
                    setUser(null);

                }

            }

            setLoading(false);
        }


        loadUser();

    }, []);



    async function login(email, password) {

        await loginRequest(email, password);

        const response = await getProfile();

        setUser(response.data);

    }



    function logout() {

        logoutRequest();

        setUser(null);

    }



    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: Boolean(user),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}



export function useAuth() {

    return useContext(AuthContext);

}