import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
    getUsers,
    deleteUser,
    updateUser,
} from "../services/users";

import getApiErrorMessage from "../utils/getApiErrorMessage";


export default function Users() {


    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("ROLE_USER");




    async function loadUsers() {

        try {

            const response = await getUsers();

            setUsers(
                response.data
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




    useEffect(() => {

        loadUsers();

    }, []);






    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cet utilisateur ?"
        );


        if (!confirmed) {

            return;

        }



        try {

            await deleteUser(id);



            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) => user.id !== id
                )
            );


        } catch (error) {

    console.error(
        "ERREUR DELETE :",
        error.response?.data
    );

    setError(
        error.response?.data?.message
        || "Erreur lors de la suppression"
    );

}

    }






    function handleEdit(user) {

        setSelectedUser(user);

        setEmail(
            user.email
        );


        setRole(
            user.roles.includes("ROLE_ADMIN")
                ? "ROLE_ADMIN"
                : "ROLE_USER"
        );

    }







    async function handleUpdate(event) {

        event.preventDefault();


        try {


            await updateUser(
                selectedUser.id,
                {
                    email,
                    roles: [
                        role
                    ],
                }
            );



            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user.id === selectedUser.id
                        ? {
                            ...user,
                            email,
                            roles: [
                                role
                            ],
                        }
                        : user
                )
            );



            setSelectedUser(null);


        } catch (error) {

            console.error(error);

            setError(
                getApiErrorMessage(error)
            );

        }

    }






    if (loading) {

        return (

            <div>

                <Navbar />

                <p>
                    Chargement des utilisateurs...
                </p>

            </div>

        );

    }






    return (

        <div>

            <Navbar />



            <h1>
                Utilisateurs
            </h1>




            {error && (

                <p
                    style={{
                        color: "red",
                    }}
                >
                    {error}
                </p>

            )}






            {selectedUser && (

                <form
                    onSubmit={handleUpdate}
                >

                    <h2>
                        Modifier utilisateur
                    </h2>



                    <p>
                        ID :
                        {" "}
                        {selectedUser.id}
                    </p>



                    <div>

                        <label>
                            Email
                        </label>


                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>





                    <div>

                        <label>
                            Rôle
                        </label>


                        <select
                            value={role}
                            onChange={(event) =>
                                setRole(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ROLE_USER">
                                Utilisateur
                            </option>


                            <option value="ROLE_ADMIN">
                                Administrateur
                            </option>


                        </select>


                    </div>




                    <button type="submit">

                        Enregistrer

                    </button>



                    <button
                        type="button"
                        onClick={() =>
                            setSelectedUser(null)
                        }
                    >

                        Annuler

                    </button>



                </form>

            )}








            <table>

                <thead>

                    <tr>

                        <th>
                            ID
                        </th>


                        <th>
                            Email
                        </th>


                        <th>
                            Rôles
                        </th>


                        <th>
                            Actions
                        </th>


                    </tr>


                </thead>




                <tbody>

                    {users.map((user) => (

                        <tr
                            key={user.id}
                        >

                            <td>
                                {user.id}
                            </td>



                            <td>
                                {user.email}
                            </td>



                            <td>
                                {user.roles.join(", ")}
                            </td>



                            <td>


                                <button
                                    onClick={() =>
                                        handleEdit(user)
                                    }
                                >

                                    Modifier

                                </button>




                                <button
                                    onClick={() =>
                                        handleDelete(user.id)
                                    }
                                >

                                    Supprimer

                                </button>



                            </td>


                        </tr>

                    ))}


                </tbody>


            </table>



        </div>

    );

}