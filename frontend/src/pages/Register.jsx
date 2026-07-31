import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    register,
} from "../services/auth";

import getApiErrorMessage from "../utils/getApiErrorMessage";


export default function Register() {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);



    async function handleSubmit(event) {

        event.preventDefault();


        setMessage("");

        setError("");

        setLoading(true);



        try {

            await register(
                email,
                password
            );


            setEmail("");

            setPassword("");


            setMessage(
                "Compte créé avec succès"
            );


            setTimeout(() => {

                navigate("/");

            }, 1500);



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
                Inscription
            </h1>



            <form
                onSubmit={handleSubmit}
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



                <div>

                    <label>
                        Mot de passe
                    </label>


                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
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
                        ? "Création..."
                        : "Créer un compte"
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

    );

}