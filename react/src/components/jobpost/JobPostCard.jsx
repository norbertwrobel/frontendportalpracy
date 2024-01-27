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
    useDisclosure
} from '@chakra-ui/react';
import CreateJobPostForm from "./CreateJobPostForm.jsx";
import EditJobPostForm from "./EditJobPostForm.jsx";
import {useAuth} from "../context/AuthContext.jsx";


export default function CardWithJobPost({jobId, title, requirements, salary, description,companyHr}){
    const CloseIcon = () => "x";
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user} = useAuth()
    console.log(user,"gowno")
    console.log(companyHr,"ciec")
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
                            <Button colorScheme='blue'>Apply for the job</Button>
                            {companyHr?.userId == user?.userId &&<Button onClick={onOpen} colorScheme='green'>Edit Post</Button>}
                        </ButtonGroup>
                    </Flex>
                </CardFooter>
                <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
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
                                onClick={onClose}>
                                Close
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Stack>
        </Card>
    )

}
