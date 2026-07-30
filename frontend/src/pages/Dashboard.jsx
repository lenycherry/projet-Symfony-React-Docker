import { useAuth } from "../context/AuthContext";


export default function Dashboard() {

    const { user, logout } = useAuth();


    return (
        <div>

            <h1>
                Dashboard
            </h1>


            {user && (
                <div>

                    <p>
                        Bonjour {user.email}
                    </p>


                    <p>
                        ID : {user.id}
                    </p>


                    <p>
                        Rôles :
                        {" "}
                        {user.roles.join(", ")}
                    </p>

                </div>
            )}


            <button onClick={logout}>
                Se déconnecter
            </button>


        </div>
    );
}