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

            <div>
                <Link to="/dashboard">
                    Dashboard
                </Link>
            </div>


           <div>

    {user && (
        <span>
            {user.email}
        </span>
    )}


    {" "}


    <Link to="/profile">
        Profil
    </Link>


    {" "}


    <button onClick={handleLogout}>
        Déconnexion
    </button>

</div>

        </nav>
    );
}