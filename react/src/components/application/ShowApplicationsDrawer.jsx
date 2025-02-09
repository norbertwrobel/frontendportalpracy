import React, { useEffect, useState } from "react";
import {
    Drawer, DrawerBody, DrawerCloseButton, DrawerContent,
    DrawerFooter, DrawerHeader, Button, Text, Box, Badge, Flex, Spacer, ButtonGroup, DrawerOverlay
} from "@chakra-ui/react";
import { getApplications, getUser, changeApplicationStatus } from "../../services/client.js";

const ShowApplicationsDrawer = ({ isOpen, onClose, jobId }) => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplications();
                const filteredApplications = response.data.filter(app => app.jobId === jobId);

                const applicationsWithUserData = await Promise.all(
                    filteredApplications.map(async (application) => {
                        try {
                            const userResponse = await getUser(application.userId);
                            return {
                                ...application,
                                firstName: userResponse.data.firstName,
                                lastName: userResponse.data.lastName,
                            };
                        } catch (error) {
                            console.error(`Błąd przy pobieraniu danych użytkownika o ID ${application.userId}:`, error);
                            return application;
                        }
                    })
                );
                setApplications(applicationsWithUserData);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        if (isOpen) {
            fetchApplications();
        }
    }, [isOpen, jobId]);

    const handleAccept = (applicationId) => {
        changeApplicationStatus(applicationId, "ACCEPTED")
            .then(() => {
                alert("Application accepted!");
                // ponownie zaladuj aplikacje
                setApplications((prevApps) =>
                    prevApps.map((app) =>
                        app.applicationId === applicationId ? { ...app, status: "ACCEPTED" } : app
                    )
                );
            })
            .catch((error) => console.error("Error accepting application:", error));
    };

    const handleReject = (applicationId) => {
        changeApplicationStatus(applicationId, "REJECTED")
            .then(() => {
                alert("Application rejected!");
                setApplications((prevApps) =>
                    prevApps.map((app) =>
                        app.applicationId === applicationId ? { ...app, status: "REJECTED" } : app
                    )
                );
            })
            .catch((error) => console.error("Error rejecting application:", error));
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Applications for this Job</DrawerHeader>

                <DrawerBody>
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <Box key={application.applicationId} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                                <Flex direction="row" align="center" mb={2}>
                                    <Text><strong>Candidate:</strong> {application.firstName} {application.lastName}</Text>
                                    <Spacer />
                                    <Text><strong>CV:</strong> {application.fileName}</Text>
                                </Flex>

                                <Flex direction="row" align="center" justify="space-between">
                                    <Box>
                                        <Text><strong>Status:</strong></Text>
                                        <Badge
                                            colorScheme={
                                                application.status === "ACCEPTED"
                                                    ? "green"
                                                    : application.status === "REJECTED"
                                                        ? "red"
                                                        : "yellow"
                                            }
                                            fontSize="md"
                                            px={2}
                                            py={1}
                                            borderRadius="md"
                                            mt={2}
                                        >
                                            {application.status}
                                        </Badge>
                                    </Box>

                                    {application.status !== "ACCEPTED" && application.status !== "REJECTED" && (
                                        <ButtonGroup spacing={2} mt={1}>
                                            <Button colorScheme="green" onClick={() => handleAccept(application.applicationId)}>
                                                Accept
                                            </Button>
                                            <Button colorScheme="red" onClick={() => handleReject(application.applicationId)}>
                                                Reject
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                </Flex>
                            </Box>
                        ))
                    ) : (
                        <Text>No applications for this job</Text>
                    )}
                </DrawerBody>

                <DrawerFooter>
                    <Button colorScheme="blue" onClick={onClose}>
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ShowApplicationsDrawer;