import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import {
    getUsers,
} from "../services/users";

import getApiErrorMessage from "../utils/getApiErrorMessage";


export default function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    useEffect(() => {

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


        loadUsers();


    }, []);




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



            {!error && (

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


                            </tr>

                        ))}

                    </tbody>


                </table>

            )}


        </div>

    );

}