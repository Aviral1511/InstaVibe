import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { USER_API_ENDPOINT } from '@/utils/ApiEndPoints';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate();

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        // console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_ENDPOINT}/signup`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                });
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center justify-center h-screen w-screen bg-blue-50'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col p-8 gap-5 bg-blue-100'>
                <div className='my-3'>
                    <h1 className='text-xl font-bold text-center my-2'>SIGNUP</h1>
                    <span className='text-red-500 font-medium text-lg'>Capture Life&apos;s moments <span className='text-purple-500'>and</span> share your vibes</span>
                </div>
                <div>
                    <Label >Username : </Label>
                    <Input type="text" placeholder="Dilraj" name="username" value={input.username} onChange={changeEventHandler} className='my-2' />
                </div>
                <div>
                    <Label >Email : </Label>
                    <Input type="email" placeholder="Dilraj@gmail.com" name="email" value={input.email} onChange={changeEventHandler} className='my-2' />
                </div>
                <div>
                    <Label>Password : </Label>
                    <Input type="password" placeholder="Enter your password" name="password" value={input.password} onChange={changeEventHandler} className='my-2' />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please Wait
                        </Button>
                    ) : ( <Button type='submit'>Signup</Button>)
                }
                <span className='font-normal text-center'>Already have an account? <Link className='font-medium text-blue-600 hover:underline' to={'/login'}>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup
