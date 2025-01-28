import {Form, Formik, useField} from "formik";
import * as Yup from "yup";
import {createJobPost, editJobPost} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {Alert, AlertIcon, Box, Button, FormLabel, Input, Stack} from "@chakra-ui/react";
import CreateJobPostForm from "./CreateJobPostForm.jsx";

const MyTextInput = ({label, ...props}) => {

    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};
const EditJobPostForm = ({jobId, onClose}) => {
    return (
        <>
            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    requirements: '',
                    salary: ''
                }}
                validationSchema={Yup.object({
                    title: Yup.string()
                        .max(50, 'Must be 50 characters or less')
                        .required('Required'),
                    description: Yup.string()
                        .required('Required'),
                    requirements: Yup.string()
                        .max(100, 'Must be 100 characters or less')
                        .required('Required'),
                    salary: Yup.number()
                        .required('Required'),
                })}
                onSubmit={async (values, {setSubmitting}) => {
                    setSubmitting(true);
                    try {
                        await editJobPost(jobId, values);
                        successNotification('Job post updated successfully', 'The job post was successfully updated.');
                    } catch (error) {
                        console.error('Error during job post editing:', error);
                        errorNotification(error.message);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({isValid, isSubmitting}) => (
                    <Form>
                        <Stack spacing={"24px"}>
                            <MyTextInput
                                label="Title"
                                name="title"
                                type="text"
                                placeholder="Java dev"
                            />

                            <MyTextInput
                                label="Requirements"
                                name="requirements"
                                type="text"
                                placeholder="Spring Boot"
                            />

                            <MyTextInput
                                label="Salary"
                                name="salary"
                                type="number"
                                placeholder="5000"
                            />

                            <MyTextInput
                                label="Description"
                                name="description"
                                type="text"
                                placeholder="Type in description of the position"
                            />

                            <Button disabled={!isValid || isSubmitting} type={"submit"}>Submit</Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default EditJobPostForm;