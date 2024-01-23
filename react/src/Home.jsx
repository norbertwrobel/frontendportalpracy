import SidebarWithHeader from "./components/shared/SideBar.jsx";
import {Text, Wrap, WrapItem} from "@chakra-ui/react";
import {getJobPosts} from "./services/client.js";
import {errorNotification} from "./services/notification.js";
import {useEffect, useState} from "react";
import CardWithImage from "./components/user/UserCard.jsx";

const Home = () => {
    const [jobPosts, setJobPosts] = useState([]);
    const fetchJobPosts = () => {
        // setLoading(true);
        getJobPosts().then(res => {
            setJobPosts(res.data)
        }).catch(err => {
            // setError(err.response.data.message)
            errorNotification(
                err.code,
                err.response.data.message
            )
        }).finally(() => {
            // setLoading(false)
        })
    }
    useEffect(() => {
        fetchJobPosts();
    }, [])
    return (
        <SidebarWithHeader>
            <Text fontSize={"6xl"}>Dashboard</Text>

            <Wrap justify={"center"} spacing={"30px"}>
                <WrapItem>
                    {jobPosts.map(jobPost => (
                        <div key={jobPost.id}>{jobPost.title}</div>
                    ))}
                </WrapItem>
            </Wrap>
        </SidebarWithHeader>
    )
}

export default Home;