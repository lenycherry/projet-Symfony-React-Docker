import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function Navbar() {

    const navigate = useNavigate();


    const {
        user,
        logout,
    } = useAuth();



    function handleLogout() {

        logout();

        navigate("/");

    }



    return (

        <nav>


            {user && (

                <>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>


                    {" | "}


                    <Link to="/profile">
                        Profil
                    </Link>



                    {user.roles.includes("ROLE_ADMIN") && (

                        <>

                            {" | "}


                            <Link to="/users">
                                Utilisateurs
                            </Link>

                        </>

                    )}



                    {" | "}


                    <span>
                        {user.email}
                    </span>



                    {" "}



                    <button
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </button>


                </>

            )}


        </nav>

    );

}