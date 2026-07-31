export default function getApiErrorMessage(error) {

    const response = error.response?.data;


    if (response?.errors) {

        return Object.values(response.errors)[0];

    }


    if (response?.message) {

        return response.message;

    }


    if (response?.detail) {

        return response.detail;

    }


    return "Une erreur est survenue.";

}