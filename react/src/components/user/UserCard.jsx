import {
    AlertDialog,
    AlertDialogBody, AlertDialogContent,
    AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Avatar, Badge,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Stack,
    Tag,
    Text,
    useColorModeValue, useDisclosure,
} from '@chakra-ui/react';

import {useRef} from 'react'
import {deleteUser} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import UpdateUserDrawer from "./UpdateUserDrawer.jsx";
import anonymous from "../../assets/anonymous.jpg";
import {useAuth} from "../context/AuthContext.jsx";

export default function CardWithImage({user, fetchUsers}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const { id, role, login, email, firstName, lastName } = user;
    const {logOut} = useAuth();
    console.log("Props received:", { id, role, login, email, firstName, lastName });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'CANDIDATE':
                return 'green';
            case 'COMPANY_HR':
                return 'blue';
            case 'MODERATOR':
                return 'yellow';
            case 'ADMIN':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Center py={6}>
            <Box
                maxW={'300px'}
                minW={'300px'}
                w={'full'}
                m={2}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'lg'}
                rounded={'md'}
                overflow={'hidden'}>
                <Image
                    h={'120px'}
                    w={'full'}
                    src={
                        'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                    }
                    objectFit={'cover'}
                />
                <Flex justify={'center'} mt={-12}>
                    <Avatar
                        size={'xl'}
                        src={anonymous}
                        alt={'Author'}
                        css={{
                            border: '2px solid white',
                        }}
                    />
                </Flex>

                <Box p={6}>
                    <Stack spacing={2} align={'center'} mb={5}>
                        <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                            {user.firstName} {user.lastName}
                        </Heading>
                        {/*<Text color={'gray.500'}>{user.firstName}</Text>*/}
                        <Text color={'gray.500'}>
                                {user.login}
                        </Text>

                        <Text color={'gray.500'}>{user.email}</Text>
                        <Text color={'gray.500'}>
                            <Badge colorScheme={getRoleBadgeColor(user.role)} borderRadius="full" mt={5} px={4} py={2}>
                                {user.role}
                            </Badge>
                        </Text>
                    </Stack>
                </Box>
                <Stack direction={'row'} justify={'center'} spacing={6} p={4}>
                    <Stack>
                        <UpdateUserDrawer
                            login={user.login}
                            fetchUsers={fetchUsers}
                        />
                    </Stack>
                    <Stack>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            rounded={'full'}
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg'
                            }}
                            _focus={{
                                bg: 'green.500'
                            }}
                            onClick={onOpen}
                        >
                            Delete
                        </Button>
                        <AlertDialog
                            isOpen={isOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}
                        >
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                        Delete User
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                        Are you sure you want to delete {user.login}? You can't undo this action afterwards.
                                    </AlertDialogBody>

                                    <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onClose}>
                                            Cancel
                                        </Button>
                                        <Button colorScheme='red' onClick={() => {
                                            deleteUser(user.login).then(res => {
                                                console.log(res)
                                                successNotification(
                                                    'User deleted',
                                                    `${user.login} was successfully deleted`
                                                )
                                                //fetchUsers();

                                            }).catch(err => {
                                                console.log(err);
                                                errorNotification(
                                                    err.code,
                                                    err.response.data.message
                                                )
                                            }).finally(() => {
                                                onClose()
                                                logOut();
                                            })
                                        }} ml={3}>
                                            Delete
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                    </Stack>

                </Stack>
            </Box>
        </Center>
    );
}