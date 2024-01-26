import {
    Wrap,
    WrapItem,
    Spinner,
    Text
} from '@chakra-ui/react';
import SidebarWithHeader from "./components/shared/SideBar.jsx";
import { useEffect, useState } from 'react';
import { getUsers } from "./services/client.js";
import CardWithImage from "./components/user/UserCard.jsx";
import CreateUserDrawer from "./components/user/CreateUserDrawer.jsx";
import {errorNotification} from "./services/notification.js";
import {useAuth} from "./components/context/AuthContext.jsx";

const User = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setError] = useState("");
    const {user} = useAuth();

    // const fetchUsers = () => {
    //     setLoading(true);
    //     getUsers().then(res => {
    //         setUsers(res.data)
    //     }).catch(err => {
    //         setError(err.response.data.message)
    //         errorNotification(
    //             err.code,
    //             err.response.data.message
    //         )
    //     }).finally(() => {
    //         setLoading(false)
    //     })
    // }

    const fetchUsers = async () => {
        setLoading(true);

        try {
            // Check if the user is logged in and has a valid role
            let response;
            if (user && (user.role === "COMPANY_HR" || user.role === "CANDIDATE")) {
                // Fetch only the currently logged user by login
                response = await getUsers(user.login);
                setUsers([response.data]); // Wrap the single user in an array
            } else {
                // Fetch all users if the role is not COMPANY_HR or CANDIDATE or if the user is not logged in
                response = await getUsers();
                setUsers(response.data);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            errorNotification(error.code, error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user])

    if (loading) {
        return (
            <SidebarWithHeader>
                <Spinner
                    thickness='4px'
                    speed='1.2s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </SidebarWithHeader>
        )
    }

    if (err) {
        return (
            <SidebarWithHeader>
                <CreateUserDrawer
                    user={user}
                    fetchUsers={fetchUsers}
                />
                <Text mt={5}>Ooops there was an error</Text>
            </SidebarWithHeader>
        )
    }

    if(users.length <= 0) {
        return (
            <SidebarWithHeader>
                <CreateUserDrawer
                    user={user}
                    fetchUsers={fetchUsers}
                />
                <Text mt={5}>No users available</Text>
            </SidebarWithHeader>
        )
    }

    // {/*{...user}*/}
    // {/*imageNumber={index}*/}
    // {/*fetchUsers={fetchUsers}*/}

    console.log(user);

    return (
        <SidebarWithHeader>
            <CreateUserDrawer user={user} fetchUsers={fetchUsers} />
            <Wrap justify="center" spacing="30px">
                {users.map((user) => (
                    <WrapItem key={user.id}>
                        {user ? (
                            <CardWithImage
                                user={user}
                                fetchUsers={fetchUsers}
                            />
                        ) : null}
                    </WrapItem>
                ))}
            </Wrap>
        </SidebarWithHeader>
    );
};

export default User;