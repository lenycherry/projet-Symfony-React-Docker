import { useState } from "react";

import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

import {
    updateProfile,
    updatePassword,
} from "../services/auth";

import getApiErrorMessage from "../utils/getApiErrorMessage";


export default function Profile() {

    const {
        user,
        refreshUser,
    } = useAuth();


    const [email, setEmail] = useState(
        user?.email || ""
    );


    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");


    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);



    async function handleProfileSubmit(event) {

        event.preventDefault();

        setMessage("");
        setError("");


        try {

            await updateProfile({
                email,
            });


            await refreshUser();


            setMessage(
                "Profil mis à jour avec succès"
            );


        } catch (error) {

            console.error(error);


            setError(
                getApiErrorMessage(error)
            );

        }

    }



    async function handlePasswordSubmit(event) {

        event.preventDefault();


        setMessage("");
        setError("");

        setLoading(true);



        try {

            await updatePassword(
                oldPassword,
                newPassword
            );


            setOldPassword("");

            setNewPassword("");


            setMessage(
                "Mot de passe modifié avec succès"
            );


        } catch (error) {

            console.error(error);


            setError(
                getApiErrorMessage(error)
            );


        } finally {

            setLoading(false);

        }

    }



    return (

        <div>

            <Navbar />


            <h1>
                Profil
            </h1>



            {user && (

                <div>


                    <p>
                        ID : {user.id}
                    </p>


                    <p>
                        Rôles :
                        {" "}
                        {user.roles.join(", ")}
                    </p>



                    <hr />



                    <h2>
                        Modifier mon profil
                    </h2>



                    <form
                        onSubmit={handleProfileSubmit}
                    >

                        <div>

                            <label>
                                Email
                            </label>


                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>



                        <button
                            type="submit"
                        >
                            Modifier le profil
                        </button>


                    </form>




                    <hr />



                    <h2>
                        Changer le mot de passe
                    </h2>



                    <form
                        onSubmit={handlePasswordSubmit}
                    >


                        <div>

                            <label>
                                Ancien mot de passe
                            </label>


                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) =>
                                    setOldPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>



                        <div>

                            <label>
                                Nouveau mot de passe
                            </label>


                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>



                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Modification..."
                                : "Changer le mot de passe"
                            }

                        </button>


                    </form>




                    {message && (

                        <p
                            style={{
                                color: "green",
                            }}
                        >
                            {message}
                        </p>

                    )}



                    {error && (

                        <p
                            style={{
                                color: "red",
                            }}
                        >
                            {error}
                        </p>

                    )}



                </div>

            )}


        </div>

    );

}