import axios from 'axios';

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },

})

export const getCustomers = async () => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users`,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const getJobPosts = async () => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobposts`,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}
export const saveCustomer = async (customer) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/customers`,
            customer
        )
    } catch (e) {
        throw e;
    }
}

export const updateCustomer = async (id, update) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${id}`,
            update,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const deleteCustomer = async (id) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${id}`,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const login = async (usernameAndPassword) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/authenticate`,
            usernameAndPassword,
            {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXJpIiwiaWF0IjoxNzA0OTk0ODE2LCJleHAiOjE3MDQ5OTYyNTZ9.AfRLPwqtzF-drnZeXDsCpiHqT4mbRvSCjD70dOJIrsw`
                }
            }
        );
    } catch (e) {
        throw e;
    }
}

export const uploadCustomerProfilePicture = async (id, formData) => {
    try {
        return axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${id}/profile-image`,
            formData,
            {
                ...getAuthConfig(),
                'Content-Type': 'multipart/form-data'
            }
        );
    } catch (e) {
        throw e;
    }
}


export const customerProfilePictureUrl = (id) =>
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/customers/${id}/profile-image`;
