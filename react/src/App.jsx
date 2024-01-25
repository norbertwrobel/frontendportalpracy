import React from 'react';
import ReactDOM from 'react-dom/client';
import User from './User.jsx';
import { ChakraProvider, createStandaloneToast} from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Login from './components/login/Login.jsx';
import Signup from './components/signup/Signup';
import AuthProvider from './components/context/AuthContext.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import './index.css';
import Home from './Home.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const toast = createStandaloneToast();

    return (
        <React.StrictMode>
            <ChakraProvider>
                <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="dashboard" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                        <Route path="dashboard/users" element={<ProtectedRoute><User/></ProtectedRoute>}/>
                    </Routes>

                    <ToastContainer/>
                </BrowserRouter>
                </AuthProvider>
            </ChakraProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
