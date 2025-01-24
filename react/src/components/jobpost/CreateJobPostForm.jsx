import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';
import {Alert, AlertIcon, Box, Button, FormLabel, Input, Select, Stack} from "@chakra-ui/react";
import {saveUser, register, login, createJobPost, addUserToJobPost, findUser} from "../../services/client.js";
import {successNotification, errorNotification} from "../../services/notification.js";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";

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

// const MySelect = ({label, ...props}) => {
//     const [field, meta] = useField(props);
//     return (
//         <Box>
//             <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
//             <Select {...field} {...props} />
//             {meta.touched && meta.error ? (
//                 <Alert className="error" status={"error"} mt={2}>
//                     <AlertIcon/>
//                     {meta.error}
//                 </Alert>
//             ) : null}
//         </Box>
//     );
// };


const CreateJobPostForm = ({ onClose }) => {
    // const [token,setToken] = useState('')
    const {user,setUser} = useAuth()
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await findUser(user.login);
                setUserId(response.data.userId); // Zakładam, że odpowiedź zawiera `userId` w `response.data`
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        if (user && user.login) {
            fetchUserId();
        }
    }, [user]);

    return (
        <>
            <Formik
                initialValues={{
                    title: '',
                    description:'',
                    requirements:'',
                    salary:''
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
                    console.log("dupskoo");
                    setSubmitting(true);
                    try {
                        const response = await createJobPost(values);
                        await addUserToJobPost(response.data.jobId, userId);
                        successNotification("Job post created successfully");
                        //onClose();
                    } catch (error) {
                        console.error('Error during job post creation:', error);
                        errorNotification(error.message);
                        setSubmitting(false);
                    }
                    navigate("/dashboard");
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

export default CreateJobPostForm;