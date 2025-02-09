import React, { useState, useEffect } from 'react';
import {Input, Button, Stack, Box, Text, DrawerCloseButton, VStack} from '@chakra-ui/react';
import { useAuth } from "./components/context/AuthContext.jsx";
import { useDisclosure } from "@chakra-ui/react";
import SidebarWithHeader from "./components/shared/SideBar.jsx";
import { getJobPosts } from "./services/client.js";
import CreateJobPostForm from "./components/jobpost/CreateJobPostForm.jsx";
import CardWithJobPost from "./components/jobpost/JobPostCard.jsx";
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@chakra-ui/react";

const Home = () => {
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredJobPosts, setFilteredJobPosts] = useState(jobPosts);
    const [searchQuery, setSearchQuery] = useState("");
    const [role, setRole] = useState(localStorage.getItem("role")?.trim());
    const [isSidebarClick, setIsSidebarClick] = useState(false);

    // Paginacja
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

    // Pobieranie ofert pracy
    const fetchJobPosts = () => {
        setLoading(true);
        getJobPosts().then((res) => {
            setJobPosts(res.data);
            setFilteredJobPosts(res.data);
        }).catch((err) => {
            console.error(err.code, err.response.data.message);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchJobPosts();
        const storedRole = localStorage.getItem("role")?.trim();
        setRole(storedRole);
    }, []);

    // Funkcja filtrująca oferty pracy
    const filterJobPosts = (keyword) => {
        if (!isSidebarClick) {
            setSearchQuery(keyword);
        }
        setFilteredJobPosts(jobPosts.filter((post) => {
            return (
                post.title.toLowerCase().includes(keyword.toLowerCase()) ||
                post.requirements.toLowerCase().includes(keyword.toLowerCase())
            );
        }));
        setIsSidebarClick(false);
    };


    const handleSidebarClick = (keyword) => {
        setIsSidebarClick(true);
        setSearchQuery(keyword);
        filterJobPosts(keyword);
    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
        filterJobPosts(event.target.value);
    };

    // Paginacja - obliczanie danych do wyświetlenia
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredJobPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(filteredJobPosts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    let createJobPostButton = null;
    if (role && role === "COMPANY_HR") {
        createJobPostButton = (
            <Button
                colorScheme="teal"
                mb={3}
                onClick={onOpen}
                width="100%"
            >
                Create a job post
            </Button>
        );
    }

    return (
        <SidebarWithHeader filterJobPosts={handleSidebarClick}>
            {/* Wyszukiwanie */}
            <Box mb={4}>
                <Input
                    placeholder="Search job posts..."
                    onChange={handleInputChange}
                    size="lg"
                    value={searchQuery}
                />
            </Box>

            {createJobPostButton}

            <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create Job Post</DrawerHeader>

                    <DrawerBody>
                        <CreateJobPostForm />
                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            colorScheme="teal"
                            onClick={onClose}>
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <VStack align="center" spacing={"20px"}>
                {currentPosts.map((jobPost) => (
                    <CardWithJobPost key={jobPost.jobId} {...jobPost} />
                ))}
            </VStack>

            {/* Paginacja */}
            <Stack direction="row" spacing={4} justify="center" mt={6}>
                <Button
                    onClick={() => paginate(currentPage - 1)}
                    isDisabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Text>
                    Page {currentPage} of {totalPages}
                </Text>
                <Button
                    onClick={() => paginate(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </Stack>
        </SidebarWithHeader>
    );
};

export default Home;
