import React, { useContext, useEffect, useState } from 'react'
import { FaPerson, FaCheck, FaXmark } from "react-icons/fa6";
import { MdDeviceThermostat } from "react-icons/md";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoMdWatch } from 'react-icons/io'
import { useRef } from 'react';

const Form = ({ onSymptomsSuccess }) => {
    const [selectedForm, setSelectedForm] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false)
    const [wearableDataReceived, setWearableDataReceived] = useState(false);
    const [wearableData, setWearableData] = useState({
        spo2: null,
        pulse: null,
        respiratoryRate: null,
        ecg: null,
        gsr: null
    });
    const socketRef = useRef(null);
    const parts = [
        { 
            id: 'wearable', 
            icon: <IoMdWatch className='w-8 h-8 text-[#9E182B] mx-auto mb-4'/>, 
            title: 'Wearable Device' 
        },
        { 
            id: 'personal', 
            icon: <FaPerson className='w-8 h-8 text-[#9E182B] mx-auto mb-4'/>, 
            title: 'Personal Information' 
        },
        { 
            id: 'symptoms', 
            icon: <MdDeviceThermostat className='w-8 h-8 text-[#9E182B] mx-auto mb-4'/>, 
            title: 'Symptoms Information' 
        },
    ];

    const { url, token, user } = useContext(AppContext);

    const [data, setData] = useState({
        age: '', weight: '', height: '', bloodGroup: '', cycle: '', cycleLength: '',
        weightGain: '', hairGrowth: '', hairLoss: '', darkPatches: '', pimples: '',
        fastFoods: '', pregnancy: '', pcos: '', pulse: null, respiratoryRate: null
    });


    const [formStatus, setFormStatus] = useState({ personal: false, symptoms: false, wearable: false });

    const getKey = key => user?._id ? `${key}_${user._id}` : key;

    useEffect(() => {
        if (!user?._id) return;
            const savedData   = localStorage.getItem(getKey('formData'));
            const savedStatus = localStorage.getItem(getKey('formStatus'));
        if (savedData)   setData(JSON.parse(savedData));
        if (savedStatus) setFormStatus(JSON.parse(savedStatus));
    }, [user]);

    useEffect(() => {
        if (!user?._id) return;
            localStorage.setItem(getKey('formData'), JSON.stringify(data));
            localStorage.setItem(getKey('formStatus'), JSON.stringify(formStatus));
    }, [data, formStatus, user]);

    useEffect(() => {
        if (data) {
            checkPersonalFormStatus();
            checkSymptomsFormStatus();
        }
    }, [data]);

    useEffect(() => {
        setFormStatus(prev => ({ ...prev, wearable: wearableDataReceived }));
    }, [wearableDataReceived]);

    useEffect(() => {
        if (wearableDataReceived) {
            setData(prev => ({
                ...prev, 
                pulse: wearableData.pulse,
                respiratoryRate: wearableData.respiratoryRate
            }));
        }
    }, [wearableData, wearableDataReceived]);

    useEffect(() => {
        const tryPredict = async () => {
            const allDone = Object.values(formStatus).every(v => v === true);
            if (allDone) {
                try {
                    const predictionRes = await axios.get(`${url}/api/predict/result`, {
                        headers: { token }
                    });
                    
                    if (predictionRes.data.success !== false) {
                        onSymptomsSuccess?.(predictionRes.data);
                    }
                } catch (predErr) {
                    toast.error("Prediction error:", predErr);
                }
            }
        };
        tryPredict();
    }, [formStatus]);

    const onChangeHandler = e => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const checkPersonalFormStatus = () => {
        const isComplete = ['age', 'weight', 'height', 'bloodGroup', 'cycle', 'cycleLength']
            .every(f => data[f]?.toString().trim() !== '');
        setFormStatus(prev => ({ ...prev, personal: isComplete }));
        return isComplete;
    };

    const checkSymptomsFormStatus = () => {
        const isComplete = ['weightGain', 'hairGrowth', 'hairLoss', 'darkPatches', 'pimples', 'fastFoods', 'pregnancy', 'pcos']
            .every(f => data[f] !== '');
        setFormStatus(prev => ({ ...prev, symptoms: isComplete }));
        return isComplete;
    };

    const onSubmitHandler = async (e, type) => {
        e.preventDefault();
        
        if (type === 'personal') {
            const isComplete = checkPersonalFormStatus();
            if (isComplete) {
                toast.success('Personal Submitted');
                setSelectedForm(null);
            } else {
                toast.error('Please complete all fields');
                return;
            }
        } else if (type === 'symptoms') {
            const isComplete = checkSymptomsFormStatus();
            if (!isComplete) {
                toast.error('Please complete all fields');
                return;
            }
            
            try {
                const submissionData = {
                    ...data,
                    pulse: data.pulse || 75,
                    respiratoryRate: data.respiratoryRate || 13
                };
                
                const res = await axios.post(`${url}/api/symptoms/create`, 
                    submissionData, { 
                        headers: { 
                            token, 'Content-Type': 'application/json' 
                        } 
                    });
                if (res.data.success) {
                    toast.success('Symptoms submitted!');
                    onSymptomsSuccess?.(res.data);
                    setData({ 
                        age: '', weight: '', height: '', bloodGroup: '', cycle: '', cycleLength: '',
                        weightGain: '', hairGrowth: '', hairLoss: '', darkPatches: '', pimples: '',
                        fastFoods: '', pregnancy: '', pcos: '',
                        pulse: null,
                        respiratoryRate: null
                    });
                    setSelectedForm(null);
                }
            } catch (err) {
                toast.error(err.message || 'Failed to submit symptoms');
            }
        }
        else if (type === 'wearable') {
            if (wearableDataReceived) {
                toast.success('Wearable Device Connected');
                setSelectedForm(null);
            } else {
                toast.error('Wearable Device Not Connected');
                return;
            }
        }
    };

    const connectSocket = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        if (socketRef.current) {
            socketRef.current.close();
        }

        const ws = new WebSocket('https://pm-pcosbackend.onrender.com');

        ws.onopen = () => { 
            setSocketConnected(true);
            toast.info('Connecting to wearable device...');
        };

        ws.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            console.log('Received data from wearable:', receivedData);
            setWearableData(receivedData);
            setWearableDataReceived(true);
            toast.success('Wearable data received!');
        };

        ws.onclose = () => { 
            setSocketConnected(false);
        };

        ws.onerror = err => {
            console.error('WebSocket error:', err);
            toast.error('Error connecting to wearable device');
        };
        socketRef.current = ws;
    };

    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setSocketConnected(false);
    };

    useEffect(() => {
        if (selectedForm === 'wearable') connectSocket();
        return () => {
            if (selectedForm === 'wearable') disconnectSocket();
        };
    }, [selectedForm]);

    useEffect(() => {
        if (!user) {
            setWearableDataReceived(false);
            setWearableData({
                spo2: null,
                pulse: null,
                respiratoryRate: null,
                ecg: null,
                gsr: null
            });
        }
    }, [user]);


    const WearableDevice = () => (
        <div className='bg-[#F9CBD6] p-6 rounded-2xl shadow-xl border border-[#F2E0D2]'>
            <div className='flex justify-between mb-4'>
                <h4 className='text-xl font-bold text-[#9E182B]'>Wearable Device</h4>
                <FaXmark className='cursor-pointer text-[#9E182B]' onClick={() => setSelectedForm(null)} />
            </div>
            
            <div className='mb-4'>
                <p className='text-[#9E182B]'>Connection Status: {socketConnected ? 'Connected' : 'Not Connected'}</p>
                <p className='text-[#9E182B]'>Data Status: {wearableDataReceived ? 'Data Received' : 'Waiting for Data'}</p>
            </div>
            
            {wearableDataReceived && (
                <div className='bg-[#F9CBD6] rounded-lg mb-4'>
                    <h5 className='bold-24 text-[#9E182B] mb-2'>Vital Signs</h5>
                    <div className='grid grid-cols-2 gap-2 p-4'>
                        <div className='border bg-[#9E182B] p-2 rounded-lg'>
                            <p className='bold-20 text-[#F9CBD6]'>SpO2</p>
                            <p className='bold-16 font-bold text-[#F9CBD6]'>{wearableData.spo2}%</p>
                        </div>
                        <div className='border bg-[#9E182B] p-2 rounded-lg'>
                            <p className='bold-20 text-[#F9CBD6]'>Pulse Rate</p>
                            <p className='bold-16 text-[#F9CBD6]'>{wearableData.pulse} bpm</p>
                        </div>
                        <div className='border bg-[#9E182B] p-2 rounded-lg'>
                            <p className='bold-20 text-[#F9CBD6]'>Respiratory Rate</p>
                            <p className='bold-16 text-[#F9CBD6]'>{wearableData.respiratoryRate} breaths/min</p>
                        </div>
                        <div className='border bg-[#9E182B] p-2 rounded-lg'>
                            <p className='bold-20 text-[#F9CBD6]'>GSR</p>
                            <p className='bold-16 text-[#F9CBD6]'>{wearableData.gsr}</p>
                        </div>
                        <div className='border mt-2 p-2 bg-[#9E182B] rounded-lg'>
                            <p className='bold-20 text-[#F9CBD6]'>ECG</p>
                            <p className='bold-16 text-[#F9CBD6]'>{wearableData.ecg}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <button 
                type='button' 
                onClick={socketConnected ? disconnectSocket : connectSocket} 
                className='mt-4 bg-[#9E182B] text-white py-2 px-4 rounded-full w-full hover:bg-[#8c1527] transition'
            >
                {socketConnected ? 'Disconnect Device' : 'Connect Device'}
            </button>
            
            <button 
                type='button' 
                onClick={(e) => onSubmitHandler(e, 'wearable')} 
                className='mt-2 bg-[#9E182B] text-white py-2 px-4 rounded-full w-full hover:bg-[#8c1527] transition'
                disabled={!wearableDataReceived}
            >
                Save Wearable Data
            </button>
        </div>
    );

    const PersonalForm = () => (
        <div className='bg-[#F9CBD6] p-6 rounded-2xl shadow-xl border border-[#F2E0D2]'>
            <form onSubmit={e => onSubmitHandler(e, 'personal')}>
                <div className='flex justify-between mb-4'>
                    <h4 className='text-xl font-bold text-[#9E182B]'>Personal Information</h4>
                    <FaXmark className='cursor-pointer text-[#9E182B]' onClick={() => setSelectedForm(null)} />
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {[
                        { label:'Enter your age', name:'age', type:'number', placeholder:'e.g. 20' },
                        { label:'Enter your weight (kg)', name:'weight', type:'number', placeholder:'e.g. 70' },
                        { label:'Enter your height (cm)', name:'height', type:'number', placeholder:'e.g. 170' },
                        { label:'Enter your blood group', name:'bloodGroup', type:'select', options:['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
                        { label:'What is your cycle pattern?', name:'cycle', type:'select', 
                            options:[
                                'Regular (21-35 days)','Irregular (varies by more than 7 days)',
                                'Infrequent (more than 35 days)','Absent for more than 3 months'
                            ]
                        },
                        { label:'What is your cycle length?', name:'cycleLength', type:'select', 
                            options:[
                                'Less than 3 days','3-7 days','More than 7 days'
                            ]
                        }
                    ].map(({label,name,type,placeholder,options}) => (
                        <div key={name}>
                            <label className='text-[#9E182B] mb-1'>{label}</label>
                                {type==='select' ? (
                                    <select name={name} value={data[name]} onChange={onChangeHandler} className='w-full p-2 border rounded-md text-[#9E182B] outline-none' required>
                                        <option value=''>Select</option>
                                            {options.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                ) : (
                                    <input type={type} name={name} value={data[name]} onChange={onChangeHandler} placeholder={placeholder} className='w-full p-2 border rounded-md text-[#9E182B] outline-none' required/>
                                )}
                        </div>
                        ))
                    }
                </div>

                <button type='submit' className='mt-6 bg-[#9E182B] text-white py-2 px-4 rounded-full w-full hover:bg-[#8c1527] transition'>
                    Submit Personal Info
                </button>
            </form>
        </div>
    );

    const SymptomsForm = () => (
        <div className='bg-[#F9CBD6] p-6 rounded-2xl shadow-xl border border-[#F2E0D2]'>
            <form onSubmit={e => onSubmitHandler(e, 'symptoms')}>
                <div className='flex justify-between mb-4'>
                    <h4 className='text-xl font-bold text-[#9E182B]'>Symptoms Information</h4>
                    <FaXmark className='cursor-pointer text-[#9E182B]' onClick={() => setSelectedForm(null)} />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {[
                        { label:'Have you experienced any sudden weight gain?', name:'weightGain' },
                        { label:'Have you experienced excessive hair growth?', name:'hairGrowth' },
                        { label:'Have you experienced hair loss?', name:'hairLoss' },
                        { label:'Do you have any dark patches?', name:'darkPatches' },
                        { label:'Do you have pimples?', name:'pimples' },
                        { label:'Do you eat fast foods frequently?', name:'fastFoods' },
                        { label:'Are you pregnant?', name:'pregnancy' },
                        { label:'Have you ever been diagnosed with PCOS?', name:'pcos' },
                    ].map(({label,name}) => (
                        <div key={name}>
                            <label className='text-[#9E182B] mb-1'>{label}</label>
                            <select name={name} value={data[name]} onChange={onChangeHandler} className='w-full p-2 border rounded-md text-[#9E182B] outline-none' required>
                                <option value=''>Select</option>
                                <option value='true'>Yes</option>
                                <option value='false'>No</option>
                            </select>
                        </div>
                    ))}
                </div>

                {data.pulse && data.respiratoryRate && (
                    <div className='mt-4 p-4 bg-white rounded-lg'>
                        <h5 className='text-lg font-semibold text-[#9E182B] mb-2'>Wearable Data</h5>
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='border p-2 rounded-lg'>
                                <p className='text-sm text-[#9E182B]'>Pulse Rate</p>
                                <p className='text-lg font-bold text-[#9E182B]'>{data.pulse} bpm</p>
                            </div>
                            <div className='border p-2 rounded-lg'>
                                <p className='text-sm text-[#9E182B]'>Respiratory Rate</p>
                                <p className='text-lg font-bold text-[#9E182B]'>{data.respiratoryRate} breaths/min</p>
                            </div>
                        </div>
                    </div>
                )}

                <button type='submit' className='mt-6 bg-[#9E182B] text-white py-2 px-4 rounded-full w-full hover:bg-[#8c1527] transition'>
                    Submit Symptoms
                </button>
            </form>
        </div>
    );


    return (
        <section className='flex flex-col md:flex-row px-6 md:pt-6 py-6 gap-6 min-h-screen'>
            {/* Sidebar */}
            <div className='md:w-1/3 space-y-4 relative'>
                {parts.map(p => (
                    <div key={p.id} onClick={() => setSelectedForm(p.id)} className={`bg-[#F9CBD6] border rounded-2xl p-6 text-center shadow-lg cursor-pointer transform hover:scale-105 transition ${selectedForm===p.id? 'border-2 border-[#9E182B]':''}`}>
                        <div className='absolute'>
                            {formStatus[p.id] ? <FaCheck className='text-white bg-green-500 p-2 rounded-full'/> : <FaXmark className='text-white bg-red-500 p-2 rounded-full'/>}
                        </div>
                        {p.icon}
                        <h3 className='text-lg font-bold text-[#9E182B] mb-2'>{p.title}</h3>
                        <p className='text-sm text-[#9E182B] mb-3'>
                            {formStatus[p.id] ? 'Completed' : 'Not completed'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Form */}
            <div className='md:w-2/3'>
                {!user ? <p className='text-center text-[#9E182B]'>Please log in to access the forms.</p>
                    : selectedForm === 'wearable' ? <WearableDevice/>
                    : selectedForm === 'personal' ? <PersonalForm/>
                    : selectedForm === 'symptoms' ? <SymptomsForm/>
                    : <p className='text-center text-[#9E182B] bold-14'>Select a form to begin.</p>
                }

                <p className='text-center text-[#9E182B] mt-4 bold-16'>
                    Note: This form should only be filled by <span className='underline'>women</span>
                </p>
            </div>
        </section>
    );
};

export default Form;