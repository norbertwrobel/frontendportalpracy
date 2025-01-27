import React, { useState, useEffect } from "react";
import { Card, Stack, Box, Button, Text, Badge, Flex, Spacer } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";
import ApplyDrawer from "../application/ApplyDrawer.jsx";
import ShowApplicationsDrawer from "../application/ShowApplicationsDrawer.jsx";
import { getApplicationsForUser } from "../../services/client.js";

const JobPostCard = ({ jobId, title, requirements, salary, description, companyHr }) => {
    const { user } = useAuth();
    const role = localStorage.getItem("role");
    const [applicationStatuses, setApplicationStatuses] = useState({});
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);

    // Funkcja otwierająca okno dialogowe dla aplikacji
    const onApplyOpen = () => setIsApplyOpen(true);
    const onApplyClose = () => setIsApplyOpen(false);

    // Funkcja otwierająca okno dialogowe dla aplikacji kandydata
    const onApplicationsOpen = () => setIsApplicationsOpen(true);
    const onApplicationsClose = () => setIsApplicationsOpen(false);

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
        <Card>
            {/* Treść oferty pracy */}
            <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Box flex={1}>
                    <Text fontWeight="bold" fontSize="lg">{title}</Text>
                    <Text fontSize="sm" color="gray.500">{requirements}</Text>
                    <Text fontSize="md" mt={2}>{description}</Text>
                    <Text fontSize="md" mt={2}><strong>Salary:</strong> {salary}</Text>
                </Box>
                <Spacer />
                <Box>
                    {/* Przyciski zależne od roli użytkownika */}
                    {role === "CANDIDATE" && !applicationStatuses[jobId] && (
                        <Button colorScheme="blue" onClick={onApplyOpen}>
                            Apply for the Job
                        </Button>
                    )}
                    {role === "CANDIDATE" && applicationStatuses[jobId] && (
                        <Badge colorScheme="yellow" mt={2}>
                            Application {applicationStatuses[jobId]}
                        </Badge>
                    )}
                    {role === "COMPANY_HR" && (
                        <Button colorScheme="teal" onClick={onApplicationsOpen} mt={4}>
                            Show Applications
                        </Button>
                    )}
                </Box>
            </Stack>

            {/* Drawer do aplikacji */}
            <ApplyDrawer isOpen={isApplyOpen} onClose={onApplyClose} jobId={jobId} user={user} />

            {/* Drawer do przeglądania aplikacji */}
            <ShowApplicationsDrawer isOpen={isApplicationsOpen} onClose={onApplicationsClose} jobId={jobId} />
        </Card>
    );
};

export default JobPostCard;