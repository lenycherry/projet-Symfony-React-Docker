import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);



    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);


        try {

            await login(email, password);

            navigate("/dashboard");


        } catch (error) {

            setError(
                "Email ou mot de passe incorrect"
            );

        } finally {

            setLoading(false);

        }
    }



    return (
        <div>

            <h1>Connexion</h1>


            <form onSubmit={handleSubmit}>


                <div>
                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
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
                            setPassword(e.target.value)
                        }
                        required
                    />

                </div>



                {error && (
                    <p>
                        {error}
                    </p>
                )}



                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Connexion..."
                        : "Se connecter"
                    }

                </button>


            </form>


        </div>
    );
}