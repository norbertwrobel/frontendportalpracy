import SidebarWithHeader from "./components/shared/SideBar.jsx";
import {
    Text,
    Wrap,
    WrapItem,
    Spinner,
    VStack,
    Button,
    Input,
    useDisclosure,
    DrawerOverlay,
    DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Drawer, Box,
    Stack
} from "@chakra-ui/react";
import {getJobPosts} from "./services/client.js";
import {errorNotification} from "./services/notification.js";
import {useEffect, useState} from "react";
import CardWithJobPost from "./components/jobpost/JobPostCard.jsx";
import {useAuth} from "./components/context/AuthContext.jsx";
import CreateJobPostForm from "./components/jobpost/CreateJobPostForm.jsx";

const Home = () => {
    const {user} = useAuth();
    const CloseIcon = () => "x";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredJobPosts, setFilteredJobPosts] = useState(jobPosts);
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    const [role, setRole] = useState(localStorage.getItem("role")?.trim());

    // Paginacja
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Liczba ofert na stronie

    const fetchJobPosts = () => {
        setLoading(true);
        getJobPosts().then(res => {
            setJobPosts(res.data);
            setFilteredJobPosts(res.data);
        }).catch(err => {
            errorNotification(err.code, err.response.data.message);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchJobPosts();
        const storedRole = localStorage.getItem("role")?.trim();
        setRole(storedRole);
    }, []);

    const filterJobPosts = (keyword) => {
        if (!keyword || keyword.trim() === '') {
            setFilteredJobPosts(jobPosts);
            setSelectedKeyword(null);
        } else {
            const lowerCaseKeyword = keyword.toLowerCase();
            const filteredPosts = jobPosts.filter((post) => {
                return (
                    post.title.toLowerCase().includes(lowerCaseKeyword) ||
                    post.requirements.toLowerCase().includes(lowerCaseKeyword)
                );
            });
            setFilteredJobPosts(filteredPosts);
            setSelectedKeyword(keyword);
        }
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
        <SidebarWithHeader filterJobPosts={filterJobPosts}>
            {/* Wyszukiwanie */}
            <Box mb={4}>
                <Input
                    placeholder="Search job posts..."
                    onChange={(e) => filterJobPosts(e.target.value)}
                    size="lg"
                    value={selectedKeyword || ''}
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
                            leftIcon={<CloseIcon />}
                            colorScheme={"teal"}
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