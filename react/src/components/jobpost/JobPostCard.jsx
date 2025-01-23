import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Stack,
    Heading,
    Button,
    Text,
    Flex,
    Spacer,
    ButtonGroup,
    Image,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Drawer,
    useDisclosure, Badge, Box
} from '@chakra-ui/react';
import CreateJobPostForm from "./CreateJobPostForm.jsx";
import EditJobPostForm from "./EditJobPostForm.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {applyForTheJob, deleteJobPost, getApplication, getApplicationsForUser} from "../../services/client.js";
import {useDropzone} from "react-dropzone";
import {useEffect, useState} from "react";


export default function CardWithJobPost({jobId, title, requirements, salary, description, companyHr}){
    const CloseIcon = () => "x";
    // const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isApplyOpen, onOpen: onApplyOpen, onClose: onApplyClose } = useDisclosure();
    const [selectedFile, setSelectedFile] = useState(null);
    const {user} = useAuth()
    const role = localStorage.getItem("role");
    const [applicationStatuses, setApplicationStatuses] = useState({});
    console.log(user,"gowno")
    console.log(companyHr,"ciec")

    useEffect(() => {
        if (user && user.userId && user.role === 'CANDIDATE') {
            // Pobierz aplikacje użytkownika
            getApplicationsForUser(user.userId)
                .then((response) => {
                    const statuses = {};
                    response.data.forEach((application) => {
                        statuses[application.jobId] = application.status; // Przypisz status aplikacji do jobId
                    });
                    setApplicationStatuses(statuses); // Zaktualizuj stan statusów aplikacji
                })
                .catch((error) => {
                    console.error('Błąd podczas pobierania aplikacji:', error);
                });
        }
    }, [user]);


    // Funkcja obsługująca wybranie pliku
    const onDrop = (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            console.log("Wybrano plik:", file);
        }

        if (rejectedFiles.length > 0) {
            alert("Only .pdf files are allowed!");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: "application/pdf" // Możesz zmienić typ plików na inny, np. *.docx
    });

    return(
        <Card
            width="90%"
            direction={{ base: 'column', sm: 'row' }}  // Keep it column for small screens
            overflow='hidden'
            variant='outline'
        >
            <Stack
                direction={{ base: 'column', sm: 'row' }}  // Flexbox direction for large screens
                width="100%"  // Ensure it takes full width
            >
                {/* Left Column: 85% for text content */}
                <Box flex="8" p={4}>  {/* Takes 85% of the width */}
                    <CardBody>
                        <Heading size='md' mb={4}>{title}</Heading>

                        <Badge colorScheme='purple' borderRadius="md" fontSize="sm" px={2} py={1}>
                            Requirements:
                        </Badge>
                        <Text py='2'>
                            {requirements}
                        </Text>

                        <Badge colorScheme='green' borderRadius="md" fontSize="sm" px={2} py={1}>
                            Salary:
                        </Badge>
                        <Text py='2'>
                            {salary} PLN
                        </Text>

                        <Badge colorScheme='gray' borderRadius="md" fontSize="sm" px={2} py={1}>
                            Description:
                        </Badge>
                        <Text py='2' color="gray.600">
                            {description}
                        </Text>

                        <Badge colorScheme='pink' borderRadius="md" fontSize="sm" px={2} py={1}>
                            Created by: {companyHr?.login}
                        </Badge>
                    </CardBody>

                    <CardFooter>
                        <Flex width="100%" justifyContent="space-between" alignItems="center">
                            <ButtonGroup gap='2'>
                                {role === "CANDIDATE" && (
                                    // Sprawdzamy, czy aplikacja już istnieje (czyli czy istnieje jakikolwiek status)
                                    !applicationStatuses[jobId] ? (
                                        <Button onClick={onApplyOpen} colorScheme='blue'>
                                            Apply for the job
                                        </Button>
                                    ) : null
                                )}

                                {(role === "COMPANY_HR") && (
                                    <>
                                        {companyHr?.userId === user?.userId && (
                                            <>
                                                <Button onClick={onEditOpen} colorScheme='green'>Edit Post</Button>
                                                <Button onClick={() => deleteJobPost(jobId)} colorScheme='red'>Delete Post</Button>
                                            </>
                                        )}
                                    </>
                                )}

                                {role === "ADMIN" && (
                                    <>
                                        <Button onClick={onEditOpen} colorScheme='green'>Edit Post</Button>
                                        <Button onClick={() => deleteJobPost(jobId)} colorScheme='red'>Delete Post</Button>
                                    </>
                                )}
                            </ButtonGroup>
                        </Flex>
                    </CardFooter>
                </Box>

                {/* Right Column: For Status Badge (15% width) */}
                <Box flex="2" p={4} display={{ base: 'none', sm: 'block' }}>
                    {/* This box will take 15% width */}
                    <Box
                        position="sticky"  // Make sure badge stays visible when scrolling
                        top="20px"  // Keep it a little lower than the top
                        display="flex"
                        justifyContent="flex-end"  // Align the badge to the right
                        alignItems="center"
                        height="100%"  // Ensure it spans the whole height
                        mr={10}
                    >
                        {user?.role === 'CANDIDATE' && applicationStatuses[jobId] && (
                            <Badge
                                colorScheme={
                                    applicationStatuses[jobId] === 'ACCEPTED'
                                        ? 'green'
                                        : applicationStatuses[jobId] === 'REJECTED'
                                            ? 'red'
                                            : 'yellow'
                                }
                                px={8} // Padding inside
                                py={4} // Padding inside
                                fontSize="l" // Smaller font size
                                borderRadius="full" // Rounded corners
                            >
                                {applicationStatuses[jobId]}
                            </Badge>
                        )}
                    </Box>
                </Box>
            </Stack>

            {/* Drawers for editing and applying */}
            <Drawer isOpen={isEditOpen} onClose={onEditClose} size={"xl"}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Edit Job Post</DrawerHeader>

                    <DrawerBody>
                        <EditJobPostForm jobId={jobId} />
                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            leftIcon={<CloseIcon />}
                            colorScheme={"teal"}
                            onClick={onEditClose}>
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Drawer isOpen={isApplyOpen} onClose={onApplyClose} size={"xl"}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Apply for the Job</DrawerHeader>

                    <DrawerBody>
                        {/* Dropzone for file upload */}
                        <div
                            {...getRootProps({
                                onDrop: (acceptedFiles) => {
                                    if (acceptedFiles && acceptedFiles.length > 0) {
                                        setSelectedFile(acceptedFiles[0]); // Update the state with the selected file
                                    }
                                }
                            })}
                            style={{
                                border: "2px dashed #ddd",
                                borderRadius: "10px",
                                padding: "50px",
                                textAlign: "center",
                                cursor: "pointer"
                            }}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Drop the file here...</p>
                            ) : (
                                <p>Click here or drag a .pdf file to upload</p>
                            )}
                        </div>
                        {/* Display the selected file name */}
                        {selectedFile && (
                            <Text mt={4}>
                                Selected file: <strong>{selectedFile.name}</strong>
                            </Text>
                        )}

                        {/* Button to submit application */}
                        <Button
                            mt={4}
                            colorScheme="blue"
                            onClick={() => {
                                if (!selectedFile) {
                                    alert("Please select a file before submitting!");
                                    return;
                                }
                                applyForTheJob(selectedFile, user.userId, jobId)
                                    .then(() => {
                                        alert("Application submitted successfully!");
                                        onApplyClose(); // Close the modal after success
                                    })
                                    .catch((error) =>
                                        alert("Error submitting application: " + error.message)
                                    );
                            }}
                        >
                            Submit
                        </Button>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button colorScheme="blue" onClick={onApplyClose}>Close</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Card>
    )

}
