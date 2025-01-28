import axios from 'axios';

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
    },
})

// export const getUsers = async () => {
//     try {
//         return await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/api/v1/users`,
//             getAuthConfig()
//         )
//     } catch (e) {
//         throw e;
//     }
// }

export const getUsers = async (login) => {
    try {
        const url = login ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${login}` : `${import.meta.env.VITE_API_BASE_URL}/api/v1/users`;
        return await axios.get(url, getAuthConfig());
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
export const saveUser = async (user) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users`,
            user,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const register = async (user) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/register`,
            user
        )
    } catch (e) {
        throw e;
    }
}

export const updateUser = async (login, update) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${login}`,
            update,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const deleteUser = async (login) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${login}`,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const login = async (usernameAndPassword, token) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/authenticate`,
            usernameAndPassword,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (e) {
        throw e;
    }
};

export const findUser = async (login) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${login}`,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
};

export const getUser = async (userId) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/user/${userId}`,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
};

// export const getUser = async (userId) => {
//     try {
//         const response = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${userId}`,
//             getAuthConfig()
//         );
//         return response.data;
//     } catch (error) {
//         console.error(`Błąd podczas pobierania danych użytkownika o ID ${userId}:`, error);
//         throw error;
//     }
// };

export const createJobPost = async (jobPost) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobposts`,
            jobPost, getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const editJobPost = async (id, values) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobposts/${id}`,
            values, getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const deleteJobPost = async (id) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobposts/${id}`, getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const addUserToJobPost = async (id, companyHrId) => {
    try {
        return await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/jobposts/${id}/companyHr/${companyHrId}`,
            null,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const applyForTheJob = async (file, userId, jobPostId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("jobPostId", jobPostId);

    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/applications`,
            formData,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const changeApplicationStatus = async (applicationId, status) => {
    try {
        // Wykonujemy żądanie PATCH, przekazując status jako parametr zapytania
        return await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/applications/${applicationId}/status?status=${status}`, // parametr status
            null,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const getApplication = async (applicationId) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/applications/${applicationId}`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const getApplications = async () => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/applications`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const getApplicationsForUser = async (userId) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/applications/user/${userId}`,
            getAuthConfig()
        );
    } catch (e) {
        throw e;
    }
};

export const generateJobDescription = async (title, requirements) => {
    try {
        const prompt = `Wygeneruj opis pracy ${title}\n z wymaganiami ${requirements} w 5 zdaniach max 254 znaków`;
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/bot/chat`,
            {
                params: { prompt },
                ...getAuthConfig(),
            }
        );
        return response.data;
    } catch (e) {
        throw e;
    }
};


