import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure
} from "@chakra-ui/react";
import CreateJobPostForm from "./CreateJobPostForm.jsx";
import UpdateUserForm from "../user/UpdateUserForm.jsx";

const AddIcon = () => "+";
const CloseIcon = () => "x";

const CreateJobPostDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return <>
        <Button
            leftIcon={<AddIcon/>}
            colorScheme={"teal"}
            onClick={onOpen}
        >
            Create Job Post
        </Button>
        <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create Job Post</DrawerHeader>

                {/*<DrawerBody>*/}
                {/*    <CreateJobPostForm*/}
                {/*    />*/}
                {/*</DrawerBody>*/}

                <DrawerBody>
                    <CreateJobPostForm onClose={onClose} />
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
    </>

}

export default CreateJobPostDrawer;