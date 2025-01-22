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
    useDisclosure, Badge
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
        if (user && user.userId) {
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
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        console.log("Wybrano plik:", file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: "application/pdf" // Możesz zmienić typ plików na inny, np. *.docx
    });

    return(
        <Card
            width="90%"
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
        >


            <Stack>
                <CardBody>
                    <Heading size='md'>{title}</Heading>

                    <Text py='2'>
                        Requirements: {requirements}
                    </Text>

                    <Text py='2'>
                        Salary: {salary} PLN
                    </Text>

                    <Text py='2'>
                       Description: {description}
                    </Text>

                    <Text py='2'>
                        Created by: {companyHr?.login}
                    </Text>
                </CardBody>

                <CardFooter>
                    <Flex justifyContent="space-between">
                        <ButtonGroup gap='2'>

                            {role === "CANDIDATE" && (
                                <>
                                    <Button onClick={onApplyOpen} colorScheme='blue'>Apply for the job</Button>
                                </>
                            )}
                            {/*<Button colorScheme='blue'>Apply for the job</Button>*/}

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
                        {/* Status aplikacji wyświetlany po prawej stronie */}
                        {role === 'CANDIDATE' && applicationStatuses[jobId] && (
                            <Badge
                                colorScheme={
                                    applicationStatuses[jobId] === 'ACCEPTED'
                                        ? 'green'
                                        : applicationStatuses[jobId] === 'REJECTED'
                                            ? 'red'
                                            : 'yellow'
                                }
                            >
                                {applicationStatuses[jobId]}
                            </Badge>
                        )}
                    </Flex>
                </CardFooter>
                <Drawer isOpen={isEditOpen} onClose={onEditClose} size={"xl"}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Edit Job Post</DrawerHeader>

                        <DrawerBody>
                            <EditJobPostForm jobId={jobId}/>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button
                                leftIcon={<CloseIcon/>}
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
                            {/* Dropzone do przesyłania plików */}
                            <div
                                {...getRootProps({
                                    onDrop: (acceptedFiles) => {
                                        if (acceptedFiles && acceptedFiles.length > 0) {
                                            setSelectedFile(acceptedFiles[0]); // Zaktualizuj stan wybranym plikiem
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
                                    <p>Click here or drag a file to upload</p>
                                )}
                            </div>
                            {/* Wyświetlenie nazwy wybranego pliku */}
                            {selectedFile && (
                                <Text mt={4}>
                                    Selected file: <strong>{selectedFile.name}</strong>
                                </Text>
                            )}

                            {/* Przycisk do wysłania aplikacji */}
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
                                            onApplyClose(); // Zamknięcie okna po sukcesie
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
            </Stack>
        </Card>
    )

}
