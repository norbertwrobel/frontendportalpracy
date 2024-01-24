import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';
import {Alert, AlertIcon, Box, Button, FormLabel, Image, Input, Stack, VStack} from "@chakra-ui/react";
import {updateUser} from "../../services/client.js";
import {errorNotification, successNotification} from "../../services/notification.js";
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";

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




const UpdateUserForm = ({fetchUsers, initialValues, userId}) => {
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    firstName: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    lastName: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    login: Yup.string()
                        .min(5, 'Must be at least 5 characters')
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    password: Yup.string()
                        .min(4, 'Must be 4 characters or more')
                        .max(15, 'Must be 15 characters or less')
                        .required('Required'),
                    email: Yup.string()
                        .email('Must be 20 characters or less')
                        .required('Required')
                })}
                onSubmit={(updatedUser, {setSubmitting}) => {
                    setSubmitting(true);
                    updateUser(userId, updatedUser)
                        .then(res => {
                            console.log(res);
                            successNotification(
                                "User updated",
                                `${updatedUser.name} was successfully updated`
                            )
                            fetchUsers();
                        }).catch(err => {
                        console.log(err);
                        errorNotification(
                            err.code,
                            err.response.data.message
                        )
                    }).finally(() => {
                        setSubmitting(false);
                    })
                }}
            >
                {({isValid, isSubmitting, dirty}) => (
                    <Form>
                        <Stack spacing={"24px"}>
                            <MyTextInput
                                label="First Name"
                                name="firstname"
                                type="text"
                                placeholder="John"
                            />

                            <MyTextInput
                                label="Last Name"
                                name="lastname"
                                type="text"
                                placeholder="Doe"
                            />

                            <MyTextInput
                                label="Login"
                                name="login"
                                type="text"
                                placeholder="johnie123"
                            />

                            <MyTextInput
                                label="Password"
                                name="password"
                                type="password"
                                placeholder={"Pick a secure password"}
                            />

                            <MyTextInput
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="johnd@gmail.com"
                            />

                            <Button disabled={!(isValid && dirty) || isSubmitting} type="submit">Submit</Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default UpdateUserForm;