import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';
import {Alert, AlertIcon, Box, Button, FormLabel, Input, Select, Stack} from "@chakra-ui/react";
import {saveUser,register,login} from "../../services/client.js";
import {successNotification, errorNotification} from "../../services/notification.js";
import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";

const MyTextInput = ({label, ...props}) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input>. We can use field meta to show an error
    // message if the field is invalid and it has been touched (i.e. visited)
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

const MySelect = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Select {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

// And now we can use these
const CreateUserForm = ({ onSuccess }) => {
    const [token,setToken] = useState('')
    const {user,setUser} = useAuth()
    return (
        <>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName:'',
                    login:'',
                    password:'',
                    email: '',
                    role:''
                }}
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
                        .required('Required'),
                    role: Yup.string()
                        .oneOf(
                            ['CANDIDATE', 'COMPANY_HR'],
                            'Invalid role'
                        )
                        .required('Required'),
                })}
                onSubmit={async (user, {setSubmitting}) => {
                    console.log(user,"dupskie")
                    setSubmitting(true);
                    try {
                        const registerResponse = await register(user);
                        const jwtToken = registerResponse.data.jwt;

                        console.log(jwtToken, "res");
                        localStorage.setItem("access_token", jwtToken);
                        login({login: user.login, password: user.password}, jwtToken).then(res =>{
                            console.log(res.data.jwt,"pipskie")
                            localStorage.setItem("access_token", res.data.jwt);
                        });
                        setUser(user)


                        // saveUser(user)
                        //     .then(res => {
                        //         console.log(res);
                        //         successNotification(
                        //             "User saved",
                        //             `${user.name} was successfully saved`
                        //         )
                        //         // onSuccess(res.headers["authorization",token]);
                        //     }).catch(err => {
                        //     console.log(err);
                        //     errorNotification(
                        //         err.code,
                        //         err.response.data.message
                        //     )
                        // }).finally(() => {
                        //     setSubmitting(false);
                        // })

                    } catch (registerError) {
                        console.error('Error during registration:', registerError);
                        // Handle registration error if needed
                        errorNotification(
                            registerError.code,
                            registerError.response?.data.message || 'Registration failed'
                        );
                        setSubmitting(false);
                        return;
                    }

                    navigate("/dashboard");


                }}
            >
                {({isValid, isSubmitting}) => (
                    <Form>
                        <Stack spacing={"24px"}>
                            <MyTextInput
                                label="First Name"
                                name="firstName"
                                type="text"
                                placeholder="John"
                            />

                            <MyTextInput
                                label="Last Name"
                                name="lastName"
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

                            <MySelect label="User type" name="role">
                                <option value="">Select user type</option>
                                <option value="CANDIDATE">Candidate</option>
                                <option value="COMPANY_HR">Company HR</option>
                            </MySelect>

                            <Button disabled={!isValid || isSubmitting} type={"submit"}>Submit</Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default CreateUserForm;