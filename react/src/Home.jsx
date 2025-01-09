import SidebarWithHeader from "./components/shared/SideBar.jsx";
import {
    Text,
    Wrap,
    WrapItem,
    Spinner,
    VStack,
    Button,
    useDisclosure,
    DrawerOverlay,
    DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Drawer
} from "@chakra-ui/react";
import {getJobPosts} from "./services/client.js";
import {errorNotification} from "./services/notification.js";
import {useEffect, useState} from "react";
import CardWithImage from "./components/user/UserCard.jsx";
import CardWithJobPost from "./components/jobpost/JobPostCard.jsx";
import {useAuth} from "./components/context/AuthContext.jsx";
import CreateJobPostForm from "./components/jobpost/CreateJobPostForm.jsx";
import {useNavigate} from "react-router-dom";
import EditJobPostForm from "./components/jobpost/EditJobPostForm.jsx";



const Home = () => {
    const {user} = useAuth();
    const CloseIcon = () => "x";
    //console.log(user,"szmatka")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredJobPosts, setFilteredJobPosts] = useState(jobPosts);
    console.log(filteredJobPosts,"siemaaanooo")
    const [selectedKeyword, setSelectedKeyword] = useState(null);

    // const role = localStorage.getItem("role");
    const [role, setRole] = useState(localStorage.getItem("role")?.trim());
    console.log(role, "dupa1")


    const fetchJobPosts = () => {
        setLoading(true);
        getJobPosts().then(res => {
            setJobPosts(res.data)
            setFilteredJobPosts(res.data)
        }).catch(err => {
            // setError(err.response.data.message)
            errorNotification(
                err.code,
                err.response.data.message
            )
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        fetchJobPosts();
        const storedRole = localStorage.getItem("role")?.trim();
        setRole(storedRole);
    }, [])



    const filterJobPosts = (keyword) => {
        if (!keyword || keyword === 'Home') {
            // Resetowanie filtrów, jeśli brak keyword lub wybrano "Home"
            setFilteredJobPosts(jobPosts);
            setSelectedKeyword(null);
        } else {
            const filteredPosts = jobPosts.filter((post) => {
                const lowerCaseKeyword = keyword.toLowerCase();
                return (
                    post.title.toLowerCase().includes(lowerCaseKeyword) ||
                    post.requirements.toLowerCase().includes(lowerCaseKeyword)
                );
            });
            setFilteredJobPosts(filteredPosts);
            setSelectedKeyword(keyword);
        }
    };


    if (loading) {
        return (
            <SidebarWithHeader filterJobPosts={filterJobPosts}>
                <Spinner
                    thickness='4px'
                    speed='1.2s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </SidebarWithHeader>
        );
    }

    // if (jobPosts.length <= 0 || filteredJobPosts.length <= 0) {
    //     return (
    //         <SidebarWithHeader filterJobPosts={filterJobPosts}>
    //             <Text>No Job Posts</Text>
    //         </SidebarWithHeader>
    //     );
    // }

    // Warunkowe renderowanie przycisku z użyciem if
    let createJobPostButton = null;
    if (role && role === "COMPANY_HR") {
        console.log("cipacipa")
        createJobPostButton = (
            <Button colorScheme={"teal"} mb={3} onClick={onOpen}>Create a job post</Button>
        );
    }

    return (
        <SidebarWithHeader filterJobPosts={filterJobPosts}>
            {/* Renderowanie przycisku, jeśli rola to "COMPANY_HR" */}
            {createJobPostButton}

            <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create Job Post</DrawerHeader>

                    <DrawerBody>
                        <CreateJobPostForm/>
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
                {selectedKeyword
                    ? filteredJobPosts.map((jobPost) => (
                        <CardWithJobPost key={jobPost.jobId} {...jobPost}/>
                    ))
                    : jobPosts.map((jobPost) => (
                        <CardWithJobPost key={jobPost.jobId} {...jobPost}/>
                    ))}
            </VStack>
        </SidebarWithHeader>
    );
}

export default Home;