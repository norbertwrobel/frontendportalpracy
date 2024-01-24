import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import {getUsers, login as performLogin} from "../../services/client.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    // const setUserFromToken = () => {
    //     let token = localStorage.getItem("access_token");
    //     if (token) {
    //         token = jwtDecode(token);
    //         setUser({
    //             login: token.sub,
    //             roles: token.scopes
    //         })
    //     }
    // }
    // useEffect(() => {
    //     setUserFromToken()
    // }, [])


    const login = async (usernameAndPassword) => {
        return new Promise((resolve, reject) => {
            performLogin(usernameAndPassword).then(res => {
                localStorage.setItem("access_token", res.data.jwt);
                console.log("siemko",res.data.jwt)
                const decodedToken = jwtDecode(res.data.jwt);
                console.log(decodedToken,"dekod")
                setUser({
                    login: decodedToken.sub,
                    roles: decodedToken.scopes
                })
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    const logOut = () => {
        localStorage.removeItem("access_token")
        setUser(null)
    }

    const isUserAuthenticated = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            return false;
        }
        const { exp: expiration } = jwtDecode(token);
        if (Date.now() > expiration * 1000) {
            logOut()
            return false;
        }
        return true;
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logOut,
            isUserAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;