import React, { useState } from "react";
import {
    Drawer, DrawerBody, DrawerCloseButton, DrawerContent,
    DrawerFooter, DrawerHeader, Button, Text, useDisclosure, DrawerOverlay
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { applyForTheJob } from "../../services/client.js";

const ApplyDrawer = ({ isOpen, onClose, jobId, user }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    // funkcja obslugujaca wybor pliku
    const onDrop = (acceptedFiles, rejectedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
        }

        if (rejectedFiles.length > 0) {
            alert("Only .pdf files are allowed!");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: "application/pdf",
    });

    const handleApply = () => {
        if (!selectedFile) {
            alert("Please select a file before submitting!");
            return;
        }

        applyForTheJob(selectedFile, user.userId, jobId)
            .then(() => {
                alert("Application submitted successfully!");
                onClose();
            })
            .catch((error) => alert("Error submitting application: " + error.message));
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Apply for the Job</DrawerHeader>

                <DrawerBody>
                    <div
                        {...getRootProps()}
                        style={{
                            border: "2px dashed #ddd",
                            borderRadius: "10px",
                            padding: "50px",
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the file here...</p>
                        ) : (
                            <p>Click here or drag a .pdf file to upload</p>
                        )}
                    </div>
                    {selectedFile && (
                        <Text mt={4}>Selected file: <strong>{selectedFile.name}</strong></Text>
                    )}

                    <Button mt={4} colorScheme="blue" onClick={handleApply}>
                        Submit Application
                    </Button>
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

export default ApplyDrawer;