import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormLabel,
    Heading,
    Image,
    Input,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import {Formik, Form, useField} from "formik";
import * as Yup from 'yup';
import {useAuth} from "../context/AuthContext.jsx";
import {errorNotification} from "../../services/notification.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import logo from '../../assets/logo.png';
import front from '../../assets/front.png';
import {findUser,login} from "../../services/client.js";

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

const LoginForm = () => {
    const { user,setUser } = useAuth();
    const navigate = useNavigate();

    return (
        <Formik
            // validateOnMount={false}
            // validationSchema={
            //     Yup.object({
            //         username: Yup.string()
            //             .email("Must be valid email")
            //             .required("Email is required"),
            //         password: Yup.string()
            //             .max(20, "Password cannot be more than 20 characters")
            //             .required("Password is required")
            //     })
            // }
            initialValues={{login: '', password: ''}}
            onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true);
                await login(values).then(res => {
                    setUser(values)
                    console.log(res,"res!")
                    localStorage.removeItem("access_token")
                    localStorage.setItem("access_token",res.data.jwt)
                    console.log(res, "siemaaa")
                    navigate("/dashboard")
                    console.log("Successfully logged in");
                }).catch(err => {
                    errorNotification(
                        err.code,
                        err.response.data.message
                    )
                }).finally(() => {
                    setSubmitting(false);
                })
                const currentUser = await findUser(values.login)
                console.log("odjeb",currentUser);
                setUser(currentUser.data)
            }}>

            {({isValid, isSubmitting}) => (
                <Form>
                    <Stack mt={15} spacing={15}>
                        <MyTextInput
                            label={"Login"}
                            name={"login"}
                            placeholder={"Type your login"}
                        />
                        <MyTextInput
                            label={"Password"}
                            name={"password"}
                            type={"password"}
                            placeholder={"Type your password"}
                        />

                        <Button
                            type={"submit"}
                            disabled={!isValid || isSubmitting}>
                            Login
                        </Button>
                    </Stack>
                </Form>
            )}

        </Formik>
    )
}

const Login = () => {

    const { user,setUser } = useAuth();
    const navigate = useNavigate();
    console.log(user,"user")
    useEffect(() => {
        if (user) {
            navigate("/dashboard/users");
        }
    })

    return (
        <Stack minH={'100vh'} direction={{base: 'column', md: 'row'}}>
            <Flex p={8} flex={1} alignItems={'center'} justifyContent={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Image
                        src={logo}
                        boxSize={"250px"}
                        borderRadius='full'
                        alt={"Pikej Logo"}
                        alignSelf={"center"}
                    />
                    <Heading fontSize={'2xl'} mb={15}>Sign in to your account</Heading>
                    <LoginForm/>
                    <Link color={"blue.500"} href={"/signup"}>
                        Dont have an account? Signup now.
                    </Link>
                </Stack>
            </Flex>
            <Flex
                flex={1}
                p={10}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                bgGradient={{sm: 'linear(to-r, blue.600, purple.600)'}}
            >
                <Text fontSize={"6xl"} color={'white'} fontWeight={"bold"} mb={5}>
                    <Link target={"_blank"} href={"https://www.merito.pl/"}>
                        Enrol Now
                    </Link>
                </Text>
                <Image
                    alt={'Front Image'}
                    objectFit={'scale-down'}
                    src={front}
                />
            </Flex>
        </Stack>
    );
}

export default Login;