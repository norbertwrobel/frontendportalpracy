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
import EditJobPostForm from "./EditJobPostForm.jsx";
import UpdateUserForm from "../user/UpdateUserForm.jsx";

const AddIcon = () => "+";
const CloseIcon = () => "x";

const EditJobPostDrawer = ({jobId, isOpen, onClose}) => {
    //const { isOpen, onOpen, onClose } = useDisclosure()

    return <>
        {/*<Button*/}
        {/*    colorScheme={"green"}*/}
        {/*    onClick={onOpen}*/}
        {/*>*/}
        {/*    Edit Post*/}
        {/*</Button>*/}
        <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Edit Job Post</DrawerHeader>

                <DrawerBody>
                    <EditJobPostForm jobId={jobId} onClose={onClose} />
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

export default EditJobPostDrawer;