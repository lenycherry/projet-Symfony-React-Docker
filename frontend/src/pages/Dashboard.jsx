import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";


export default function Dashboard() {

    const { user, loading } = useAuth();

    console.log("USER :", user);



    if (loading) {

        return (
            <div>

                <Navbar />

                <p>
                    Chargement...
                </p>

            </div>
        );

    }



    return (

        <div>

            <Navbar />


            <h1>
                Dashboard
            </h1>



            {user ? (

                <div>

                    <p>
                        Bonjour {user.email}
                    </p>


                    <p>
                        ID :
                        {" "}
                        {user.id}
                    </p>


                    <p>
                        Rôles :
                        {" "}
                        {user.roles?.join(", ")}
                    </p>


                </div>


            ) : (

                <div>

                    <p>
                        Aucun utilisateur chargé.
                    </p>


                    <p>
                        Le token existe peut-être mais le profil n'a pas été récupéré.
                    </p>

                </div>

            )}


        </div>

    );

}