import React, { useContext, useEffect, useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { FaHistory } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Default from '../assets/default.jpeg'
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import axios from 'axios'

const MyProfile = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false)

    const options = [
        { 
            id: 'profile',  
            icon:<CgProfile className='w-6 h-6 text-[#9E182B]' />,  
            title:'Profile' 
        },
        { 
            id: 'history',  
            icon:<FaHistory className='w-6 h-6 text-[#9E182B]' />,  
            title:'History' 
        },
        { 
            id: 'logout',   
            icon:<IoIosLogOut className='w-6 h-6 text-[#9E182B]' />, 
            title:'Log out' 
        },
    ];

    const navigate = useNavigate()
    const { url, token, setToken, user, setUser } = useContext(AppContext)
    const [data, setData] = useState({ name:'', email:'' })

    useEffect(() => {
        if (user) {
            setData({ name:user.name, email:user.email })
        }
    }, [user])

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        navigate('/')
    }

    const onChangeHandler = e => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onUpdateHandler = async e => {
        e.preventDefault()
        try {
            const res = await axios.put(
                `${url}/api/update`,
                { userId:user._id, name:data.name, email:data.email },
                { headers:{ token } }
            )
            if (res.data.success) {
                setUser(res.data.user)
                alert('Profile updated!')
                setShowUpdateForm(false)
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.error(err)
            alert('Update failed')
        }
    }

    const onDeleteHandler = async () => {
        try {
            const res = await axios.delete(`${url}/api/remove`, { headers:{ token } })
            if (res.data.success) {
                logout()
                alert('Account deleted!')
            } else {
                alert(res.data.message)
            }
        } catch (err) {
            console.error(err)
            alert('Account deletion failed')
        }
    }

    if (!user) return null

    const Profile = () => (
        <div className='flex flex-col gap-y-5'>
            {/* Profile Card */}
            <div className='bg-[#F9CBD6] rounded-2xl shadow-xl border border-[#F2E0D2] p-8'>
                <div className='text-[#9E182B] flex flex-col items-center gap-3'>
                    <img src={Default} alt='Avatar' className='h-24 w-24 md:h-32 md:w-32 rounded-full border-2'/>
                    <p className='bold-16 text-[#9E182B]'>Name: {user.name}</p>
                    <p className='bold-16 text-[#9E182B]'>Email: {user.email}</p>

                    <div className='flex gap-3'>
                        <button onClick={()=>setShowUpdateForm(!showUpdateForm)} className='bg-[#9E182B] text-white bold-8 md:bold-14 py-2 px-4 rounded-full hover:bg-[#8c1527] flex items-center gap-1'>
                            <MdOutlineSystemUpdateAlt className='w-8 h-8 md:w-4 md:h-4'/> Update your profile
                        </button>
                        <button onClick={onDeleteHandler} className='bg-[#9E182B] text-white bold-8 md:bold-14 py-2 px-4 rounded-full hover:bg-[#8c1527] flex items-center gap-1'>
                            <RiDeleteBin5Fill className='w-8 h-8 md:w-4 md:h-4'/> Delete your profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Update Form */}
            {showUpdateForm && (
                <div className='bg-[#F9CBD6] rounded-2xl shadow-xl border border-[#F2E0D2] p-8'>
                    <form onSubmit={onUpdateHandler} className='flex flex-col gap-4'>
                        <h3 className='text-[#9E182B]'>Update Profile</h3>
                        <input name='name' value={data.name} onChange={onChangeHandler} placeholder='Name' className='p-2 border rounded-md'/>
                        <input name='email' value={data.email} onChange={onChangeHandler} placeholder='Email' className='p-2 border rounded-md'/>
                    
                        <button className='bg-[#9E182B] text-white py-2 rounded-full hover:bg-[#8c1527]'>
                            Save changes
                        </button>
                    </form>
                </div>
            )}
        </div>
    );

    const History = () => {
        const [entries, setEntries] = useState([]);
        const [loading, setLoading] = useState(true);
        const [err, setErr] = useState('');
    
        useEffect(() => {
            const fetchHistory = async () => {
                try {
                    const res = await axios.get(`${url}/api/symptoms/result`, {
                        headers: { token }
                    });
                    if (res.data.success) {
                        setEntries(res.data.data);
                    } else {
                        setErr(res.data.message);
                    }
                } catch (e) {
                    console.error(e);
                    setErr('Failed to load history');
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }, [url, token]);
    
        if (loading) {
            return <p className='text-center text-[#9E182B]'>Loading history…</p>;
        }
        if (err) {
            return <p className='text-center text-[#9E182B]'>{err}</p>;
        }
        if (entries.length === 0) {
            return <p className='text-center text-[#9E182B]'>No history yet.</p>;
        }
    
        return (
            <div className='bg-[#F9CBD6] rounded-2xl shadow-xl border border-[#F2E0D2] p-8 space-y-6'>
                {entries.map(entry => (
                    <div key={entry._id} className='border-b border-[#9E182B] pb-4'>
                        <p className='bold-20 text-[#9E182B] mb-5'>
                            {new Date(entry.date).toLocaleString()}
                        </p>
                        <div className='flex gap-x-2 mb-4'>
                            <h2 className='bold-24 text-[#9E182B]'>Prediction Result:</h2>
                            <p className='bold-24 text-[#9E182B]'>
                                {entry.prediction?.label === 'Positive' ? 'PCOS' : 'No PCOS'}
                            </p>
                        </div>
                        
                        {entry.prediction?.confidence && (
                            <div className='mb-4'>
                                <p className='bold-16 text-[#9E182B]'>Confidence:</p>
                                <ul className='ml-4'>
                                    <li className='text-[#9E182B]'>No PCOS: {entry.prediction.confidence['No PCOS']}%</li>
                                    <li className='text-[#9E182B]'>PCOS: {entry.prediction.confidence['PCOS']}%</li>
                                </ul>
                            </div>
                        )}
                        
                        <ul className='list-disc list-inside space-y-1 text-[#9E182B]'>
                            {[
                                'age', 'weight', 'height', 'bloodGroup', 'cycle', 'cycleLength',
                                'weightGain', 'hairGrowth', 'hairLoss',
                                'darkPatches', 'pimples', 'fastFoods', 'pregnancy', 'pcos'
                            ].map(field => (
                                <li key={field}>
                                    <strong className='capitalize'>{field.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
                                    {typeof entry[field] === 'boolean' 
                                        ? (entry[field] ? 'Yes' : 'No') 
                                        : String(entry[field])}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };

    const Logout = () => (
        <div className='bg-[#F9CBD6] rounded-2xl shadow-xl border border-[#F2E0D2] p-8 text-center space-y-4'>
            <p className='text-[#9E182B]'>Are you sure you want to log out?</p>
            <div className='flex justify-center gap-4'>
                <button onClick={logout} className='bg-[#9E182B] text-white py-2 px-4 rounded-full'>
                Yes
                </button>
                <button onClick={() => setSelectedOption(null)} className='bg-[#9E182B] text-white py-2 px-4 rounded-full'>
                No
                </button>
            </div>
        </div>
    )

    return (
        <section className='flex flex-col md:flex-row gap-6 p-8 min-h-screen'>
            {/* Sidebar */}
            <div className='md:w-1/4 flex flex-col gap-4'>
                {options.map(opt => (
                <div key={opt.id} onClick={() => setSelectedOption(opt.id)} className={`bg-[#F9CBD6] flex items-center gap-3 p-4 border rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition ${selectedOption===opt.id?'border-2 border-[#9E182B]':''}`}>
                    {opt.icon}
                    <h3 className='text-lg font-bold text-[#9E182B]'>{opt.title}</h3>
                </div>
                ))}
            </div>

            {/* Content Area */}
            <div className='md:w-3/4'>
                {selectedOption === 'profile'  && <Profile  />}
                {selectedOption === 'history'  && <History  />}
                {selectedOption === 'language' && <Language />}
                {selectedOption === 'logout'   && <Logout   />}
                {!selectedOption && (
                <div className='text-center text-[#9E182B] bg-[#F9CBD6] p-10 rounded-xl border border-[#F2E0D2] shadow-md'>
                    Please select an option.
                </div>
                )}
            </div>
        </section>
    );
};

export default MyProfile;