import React, { useState, useEffect } from "react";
import {
    Card,
    Stack,
    Box,
    Button,
    Text,
    Badge,
    Flex,
    Spacer,
    ButtonGroup,
    Heading,
    useDisclosure
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";
import ApplyDrawer from "../application/ApplyDrawer.jsx";
import ShowApplicationsDrawer from "../application/ShowApplicationsDrawer.jsx";
import {deleteJobPost, getApplicationsForUser} from "../../services/client.js";
import EditJobPostForm from "./EditJobPostForm.jsx";
import EditJobPostDrawer from "./EditJobPostDrawer.jsx";

const JobPostCard = ({ jobId, title, requirements, salary, description, companyHr }) => {
    const { user } = useAuth();
    const role = localStorage.getItem("role");
    const [applicationStatuses, setApplicationStatuses] = useState({});
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { isOpen: isDeleteDialogOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const onApplyOpen = () => setIsApplyOpen(true);
    const onApplyClose = () => setIsApplyOpen(false);

    const onApplicationsOpen = () => setIsApplicationsOpen(true);
    const onApplicationsClose = () => setIsApplicationsOpen(false);

    const onEditOpen = () => setIsEditOpen(true);
    const onEditClose = () => setIsEditOpen(false);

    const onDeletePost = async () => {
        try {
            await deleteJobPost(jobId);
        } catch (error) {
            console.error("Error deleting job post:", error);
        }
    };

    useEffect(() => {
        if (user && user.userId && user.role === "CANDIDATE") {
            getApplicationsForUser(user.userId)
                .then((response) => {
                    const statuses = {};
                    response.data.forEach((application) => {
                        statuses[application.jobId] = application.status;
                    });
                    setApplicationStatuses(statuses);
                })
                .catch((error) => console.error("Error fetching applications:", error));
        }
    }, [user]);

    return (
        <Card p={6} borderRadius="lg" mb={4} boxShadow="md" width="100%">
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
                <Box flex={3} direction="column">
                    <Flex direction="column" gap={2}>
                        <Text fontWeight="bold" fontSize="lg">{title}</Text>

                        <Badge bg="purple.100" color="purple.800">Requirements: </Badge>
                        <Text fontSize="md">{requirements}</Text>

                        <Badge bg="green.100" color="green.800">Salary: </Badge>
                        <Text fontSize="md" mt={2}>{salary}</Text>

                        <Badge>Description: </Badge>
                        <Text fontSize="md" mt={2}>{description}</Text>

                        <Badge bg="red.100" color="red.800">Created by: {companyHr.firstName} {companyHr.lastName}</Badge>
                    </Flex>

                    <Flex direction="row" gap={4} mt={4}>
                        {role === "CANDIDATE" && !applicationStatuses[jobId] && (
                            <Button colorScheme="blue" onClick={onApplyOpen}>
                                Apply for the Job
                            </Button>
                        )}
                        {(role === "COMPANY_HR" && user?.userId === companyHr?.userId) || role === "ADMIN" || role === "MODERATOR" ? (
                            <ButtonGroup spacing={4}>
                                <Button colorScheme="green" onClick={onEditOpen}>
                                    Edit Post
                                </Button>
                                <Button colorScheme="red" onClick={onDeleteOpen}>
                                    Delete Post
                                </Button>
                            </ButtonGroup>
                        ) : null}
                    </Flex>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
                    {role === "CANDIDATE" && applicationStatuses[jobId] && (
                        <Badge
                            bg={applicationStatuses[jobId] === "ACCEPTED" ? "green.100"
                                : applicationStatuses[jobId] === "REJECTED" ? "red.100"
                                    : "yellow.100"}
                            color={applicationStatuses[jobId] === "ACCEPTED" ? "green.800"
                                : applicationStatuses[jobId] === "REJECTED" ? "red.800"
                                    : "yellow.800"}
                            borderRadius="full"
                            fontSize="lg"
                            p={3}
                            mt={4}
                        >
                            {applicationStatuses[jobId]}
                        </Badge>
                    )}
                    {role === "COMPANY_HR" && user?.userId === companyHr?.userId && (
                        <Button colorScheme="teal" onClick={onApplicationsOpen}>
                            Show Applications
                        </Button>
                    )}
                </Box>
            </Flex>

            <ApplyDrawer isOpen={isApplyOpen} onClose={onApplyClose} jobId={jobId} user={user} />
            <ShowApplicationsDrawer isOpen={isApplicationsOpen} onClose={onApplicationsClose} jobId={jobId} />
            <EditJobPostDrawer
                isOpen={isEditOpen}
                onClose={onEditClose}
                jobId={jobId}
            />

            {/* Delete confirmation dialog */}
            {isDeleteDialogOpen && (
                <Box p={4} bg="gray.100" borderRadius="md" boxShadow="md" mt={5}>
                    <Text>Are you sure you want to delete this job post?</Text>
                    <Button colorScheme="red" onClick={onDeletePost}>Delete</Button>
                    <Button onClick={onDeleteClose}>Cancel</Button>
                </Box>
            )}
        </Card>
    );
};

export default JobPostCard;