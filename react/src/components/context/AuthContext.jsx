import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import {getUsers, login as performLogin} from "../../services/client.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext({});

const AuthProvider = ({ children,navigate }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // odczytaj dane uzytkownika z localStorage przy starcie aplikacji
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("role");

        if (token && role) {
            const decodedToken = jwtDecode(token);
            setUser({
                login: jwtDecode(token).sub,
                role: role,
                userId: decodedToken.userId
            });
        }
    }, []); //tylko przy pierwszym renderowaniu

    const login = async (usernameAndPassword) => {
        return new Promise((resolve, reject) => {
            performLogin(usernameAndPassword).then(res => {
                const token = res.data.jwt
                localStorage.setItem("access_token", token);

                const decodedToken = jwtDecode(token);
                const role = decodedToken.scopes?.[0];
                if (role){
                    localStorage.setItem("role", role);
                }

                setUser({
                    login: decodedToken.sub,
                    role: decodedToken.scopes
                })
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    const logOut = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("role")
        setUser(null)
        navigate("/");
    }

    const isUserAuthenticated = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            return false;
        }
        const { exp: expiration } = jwtDecode(token);
        // if (Date.now() > expiration * 1000) {
        //     logOut()
        //     return false;
        // }
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