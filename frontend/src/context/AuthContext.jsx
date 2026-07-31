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



    /**
     * Recharge les informations de l'utilisateur connecté
     */
    async function refreshUser() {

    const response = await getProfile();

    setUser(response.data);

    return response.data;

}



    /**
     * Chargement automatique au démarrage
     */
    useEffect(() => {


        async function loadUser() {


            if (isAuthenticated()) {


                try {

                    await refreshUser();


                } catch (error) {


                    console.error(
                        "Impossible de charger l'utilisateur :",
                        error
                    );


                    logoutRequest();

                    setUser(null);


                }


            }


            setLoading(false);


        }



        loadUser();


    }, []);





    /**
     * Connexion
     */
    async function login(email, password) {


        await loginRequest(
            email,
            password
        );


        await refreshUser();


    }





    /**
     * Déconnexion
     */
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

                refreshUser,

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