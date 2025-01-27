import React, { useState, useEffect } from 'react';
import { Input, Button, Stack, Box, Text } from '@chakra-ui/react';
import { useAuth } from "../context/AuthContext.jsx";
import { useDisclosure } from "@chakra-ui/react";
import SidebarWithHeader from "./SidebarWithHeader";  // Upewnij się, że masz ten komponent
import { getJobPosts } from "../services/jobPostService"; // Zaktualizuj ścieżkę do API
import CreateJobPostForm from "./CreateJobPostForm"; // Twoje formularze do tworzenia oferty pracy
import CardWithJobPost from "./CardWithJobPost"; // Komponent dla wyświetlania ofert pracy
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@chakra-ui/react";

const Home = () => {
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredJobPosts, setFilteredJobPosts] = useState(jobPosts);
    const [searchQuery, setSearchQuery] = useState("");  // Stan dla wyszukiwania
    const [role, setRole] = useState(localStorage.getItem("role")?.trim());
    const [isSidebarClick, setIsSidebarClick] = useState(false); // Nowy stan dla kliknięcia w sidebar

    // Paginacja
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Liczba ofert na stronie

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
            setSearchQuery(keyword);  // Update search query only when not from sidebar
        }
        setFilteredJobPosts(jobPosts.filter((post) => {
            return (
                post.title.toLowerCase().includes(keyword.toLowerCase()) ||
                post.requirements.toLowerCase().includes(keyword.toLowerCase())
            );
        }));
        setIsSidebarClick(false);  // Reset sidebar click state
    };

    // const handleInputChange = (e) => {
    //     setSearchQuery(e.target.value);
    //     filterJobPosts(e.target.value);
    // };

    // Funkcja uruchamiana po kliknięciu w element sidebaru
    const handleSidebarClick = (keyword) => {
        setIsSidebarClick(true);  // Oznaczamy, że kliknięto w sidebar
        setSearchQuery(keyword);  // Ustawiamy słowo kluczowe w polu wyszukiwania (opcja opcjonalna)
        filterJobPosts(keyword);  // Filtrujemy oferty pracy na podstawie sidebaru
    };

    // Paginacja - obliczanie danych do wyświetlenia
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredJobPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(filteredJobPosts.length / postsPerPage);

    // Funkcja nawigacji
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
        <SidebarWithHeader filterJobPosts={handleSidebarClick}> {/* Przekazujemy funkcję do sidebaru */}
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
