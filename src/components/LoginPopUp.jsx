import React, { useContext, useState } from 'react';
import { FaXmark, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

// Helper function to decode JWT without using library
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const LoginPopUp = ({ setShowLogin }) => {
    const { url, setToken } = useContext(AppContext);
    const [state, setState] = useState('Login');
    const [seePassword, setSeePassword] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate()

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const endpoint = state === 'Login' ? '/api/login' : '/api/register';
        const response = await axios.post(url + endpoint, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
            toast.success(state === 'Login' ? 'Logged in successfully!' : 'Account created successfully!');
            navigate('/myform')
            setData({ name: "", email: "", password: "" });
        } else {
            toast.error(response.data.message);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const decoded = decodeJwt(credentialResponse.credential);
            if (!decoded) {
                toast.error('Unable to decode Google credentials');
                return;
            }
            
            const { email, name, sub } = decoded;
    
            const response = await axios.post(`${url}/api/google-login`, {
                email,
                name,
                googleId: sub,
            });
    
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
                toast.success('Google login successful!');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Something went wrong during Google login');
            console.log(error);
        }
    };
    

    return (
        <div className='absolute h-full w-full bg-black/40 backdrop-blur-sm z-50 flexCenter text-[#9E182B]'>
            <form onSubmit={onSubmitHandler} className='bg-[#F9CBD6] w-[366px] m-3 p-7 rounded-2xl shadow-xl border border-[#F2E0D2]'>
                <div className='flex justify-between items-baseline'>
                    <h4 className='bold-28'>{state}</h4>
                    <FaXmark onClick={() => setShowLogin(false)} className='medium-20 cursor-pointer text-[#9E182B]' />
                </div>

                <div className='flex flex-col gap-4 my-6'>
                    {state === 'Sign Up' && (
                        <input name='name' type='text' onChange={onChangeHandler} value={data.name} placeholder='Name' required className='bg-white text-[#9E182B] placeholder:text-[#D97483] border border-[#F2AFBC] p-2 rounded-md outline-none focus:ring-2 focus:ring-[#F2AFBC]' />
                    )}
                    <input name='email' type='email' onChange={onChangeHandler} value={data.email} placeholder='Email' required className='bg-white text-[#9E182B] placeholder:text-[#D97483] border border-[#F2AFBC] p-2 rounded-md outline-none focus:ring-2 focus:ring-[#F2AFBC]' />
                    <div className='relative'>
                        <input name='password' type={seePassword ? "text" : "password"} onChange={onChangeHandler} value={data.password} placeholder='Password' required className='bg-white text-[#9E182B] placeholder:text-[#D97483] border border-[#F2AFBC] p-2 pl-4 w-full rounded-md outline-none focus:ring-2 focus:ring-[#F2AFBC]'/>
                        <button type='button' onClick={() => setSeePassword(!seePassword)} className='absolute inset-y-0 end-5 grid place-content-center text-[#9E182B]'>
                            {seePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                </div>

                <button type='submit' className='bg-[#9E182B] text-white p-2 rounded-full w-full hover:bg-[#8c1527] transition'>
                    {state === 'Sign Up' ? 'Create account' : 'Login'}
                </button>

                <p className='mt-2 mb-2 text-xs text-[#9E182B] flex flexEnd'>
                    {state === 'Sign Up' ? '' : 'Forgot password?'}
                </p>

                <div className='my-3 flexCenter'>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => toast.error('Google login failed.')}
                    />
                </div>

                <div className='flex items-start gap-x-3 my-3'>
                    <input type='checkbox' required />
                    <p className='text-xs text-[#9E182B]'>
                        By continuing you agree to our <span className='underline'>Terms of Service</span> and <span className='underline'>Privacy Policy</span>
                    </p>
                </div>

                <p className='text-[#9E182B]'>
                    {state === 'Sign Up' ? 'Already have an account?' : 'Do not have an account? '}
                    <span onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')} className='cursor-pointer hover:underline'>
                        {state === 'Sign Up' ? 'Login' : 'Sign Up'}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginPopUp;