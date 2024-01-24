import SidebarWithHeader from "./components/shared/SideBar.jsx";
import {Text, Wrap, WrapItem, Spinner, VStack, Button} from "@chakra-ui/react";
import {getJobPosts} from "./services/client.js";
import {errorNotification} from "./services/notification.js";
import {useEffect, useState} from "react";
import CardWithImage from "./components/user/UserCard.jsx";
import CardWithJobPost from "./components/jobpost/JobPostCard.jsx";
import {useAuth} from "./components/context/AuthContext.jsx";


const Home = () => {
    const {user} = useAuth();

    console.log(user,"szmata")
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchJobPosts = () => {
        setLoading(true);
        getJobPosts().then(res => {
            setJobPosts(res.data)
        }).catch(err => {
            // setError(err.response.data.message)
            errorNotification(
                err.code,
                err.response.data.message
            )
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        fetchJobPosts();
    }, [])

    if (loading){
        return(
            <SidebarWithHeader>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </SidebarWithHeader>
        )
    }
    if(jobPosts.length <= 0){
        return(
            <SidebarWithHeader>
                <Text>No Job Posts</Text>
            </SidebarWithHeader>
        )
    }
    return (

        <SidebarWithHeader>
            {user?.role == "COMPANY_HR" && <Button>Create a job post</Button>}
            <VStack align="center" spacing={"30px"}>
                    {jobPosts.map(jobPost => (
                        //<div key={jobPost.id}>{jobPost.title}</div>
                        <CardWithJobPost {...jobPost}/>
                    ))}
            </VStack>
        </SidebarWithHeader>
    )
}

export default Home;