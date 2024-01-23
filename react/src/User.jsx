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

const User = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setError] = useState("");

    const fetchUsers = () => {
        setLoading(true);
        getUsers().then(res => {
            setUsers(res.data)
        }).catch(err => {
            setError(err.response.data.message)
            errorNotification(
                err.code,
                err.response.data.message
            )
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    if (loading) {
        return (
            <SidebarWithHeader>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
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
                    fetchUsers={fetchUsers}
                />
                <Text mt={5}>No users available</Text>
            </SidebarWithHeader>
        )
    }

    return (
        <SidebarWithHeader>
            <CreateUserDrawer
                fetchUsers={fetchUsers}
            />
            <Wrap justify={"center"} spacing={"30px"}>
                {users.map((user, index) => (
                    <WrapItem key={index}>
                        <CardWithImage
                            {...user}
                            imageNumber={index}
                            fetchUsers={fetchUsers}
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </SidebarWithHeader>
    )
}

export default User;