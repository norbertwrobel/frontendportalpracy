import React, { useState } from 'react';
import {
    Avatar,
    Box,
    CloseButton,
    Drawer,
    DrawerContent,
    Flex,
    HStack,
    Icon,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
    Image
} from '@chakra-ui/react';

import {
    FiBell,
    FiChevronDown,
    FiHome,
    FiMenu,
    FiChevronRight,
    FiSettings,
    FiUsers
} from 'react-icons/fi';
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import avatar from '../../assets/avatar.jpg';
import { useLocation } from 'react-router-dom';

const LinkItems = [
    { name: 'Home', route: '/dashboard', icon: FiHome }
];

const LinkItems2 = [
    { name: 'Java', route: '', icon: FiChevronRight },
    { name: 'C#', route: '', icon: FiChevronRight },
    { name: 'C++', route: '', icon: FiChevronRight },
    { name: 'Python', route: '', icon: FiChevronRight },
    { name: 'JavaScript', route: '', icon: FiChevronRight },
    { name: 'PHP', route: '', icon: FiChevronRight }
];

export default function SidebarWithHeader({ children, filterJobPosts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={onClose}
                display={{ base: 'none', md: 'block' }}
                filterJobPosts={filterJobPosts}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent
                        onClose={onClose}
                        display={{ base: 'none', md: 'block' }}
                        filterJobPosts={filterJobPosts}
                    />
                </DrawerContent>
            </Drawer>
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

const SidebarContent = ({ onClose, filterJobPosts, ...rest }) => {
    const location = useLocation();

    const handleFilterClick = (keyword) => {
        filterJobPosts(keyword);
    };

    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" flexDirection="column" alignItems="center" mx="8" mb={150} mt={2} justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" mb={5} mt={5}>
                    Dashboard
                </Text>
                <Image
                    borderRadius='full'
                    boxSize='100px'
                    src={logo}
                    alt='NoPikejobs'
                />
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>

            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} route={link.route}>
                    {link.name}
                </NavItem>
            ))}

            {location.pathname !== '/dashboard/users' && (
                LinkItems2.map((link) => (
                    <NavItem key={link.name} icon={link.icon} route={link.route} onClick={() => handleFilterClick(link.name)}>
                        {link.name}
                    </NavItem>
                ))
            )}
        </Box>
    );
};

const NavItem = ({ icon, onClick, route, children, ...rest }) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(route);
    };

    return (
        <Link href={route} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} onClick={handleClick}>
            <Flex
                onClick={onClick}
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'blue.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({onOpen, ...rest}) => {
    const { logOut, user } = useAuth();
    const navigate= useNavigate();
    const navigateToUser = () => navigate("/dashboard/users");
    return (
        <Flex
            ml={{base: 0, md: 60}}
            px={{base: 4, md: 4}}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{base: 'space-between', md: 'flex-end'}}
            {...rest}>
            <IconButton
                display={{base: 'flex', md: 'none'}}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu/>}
            />

            <Text
                display={{base: 'flex', md: 'none'}}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <HStack spacing={{base: '0', md: '6'}}>

                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{boxShadow: 'none'}}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        avatar
                                    }
                                />
                                <VStack
                                    display={{base: 'none', md: 'flex'}}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{user?.username}</Text>
                                </VStack>
                                <Box display={{base: 'none', md: 'flex'}}>
                                    <FiChevronDown/>
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem onClick={navigateToUser}>Profile</MenuItem>
                            <MenuDivider/>
                            <MenuItem onClick={() => { logOut(); }}>
                                Sign out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};