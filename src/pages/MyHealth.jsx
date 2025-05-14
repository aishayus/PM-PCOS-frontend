import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, 
        Area, BarChart, Bar, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import { FaHeartbeat, FaTint, FaLungs, FaWaveSquare, FaBolt } from 'react-icons/fa';

const metricsConfig = [
    { id: 'pulse', title: 'Pulse Rate', icon: <FaHeartbeat />, key: 'pulse', unit: 'bpm', chartType: 'line', color: '#dc2626',  thresholds: { warn: 100, critical: 120 }, },
    { id: 'spo2', title: 'SpO₂', icon: <FaTint />, key: 'spo2', unit: '%', chartType: 'area', color: '#2563eb',  thresholds: { warn: 95, critical: 90 }, },
    { id: 'respiratoryRate', title: 'Respiratory Rate', icon: <FaLungs />, key: 'respiratoryRate', unit: 'rpm', chartType: 'bar', color: '#7c3aed', thresholds: { warn: 20, critical: 30 }, },
    { id: 'ecg', title: 'ECG', icon: <FaWaveSquare />, key: 'ecg', unit: 'mV', chartType: 'line', color: '#ca8a04' },
    { id: 'gsr', title: 'GSR', icon: <FaBolt />, key: 'gsr', unit: 'μS', chartType: 'area', color: '#16a34a' },
];

const MyHealthPage = () => {
    const { url } = useContext(AppContext);
    const [liveData, setLiveData] = useState({
        pulse: [], 
        spo2: [], 
        respiratoryRate: [], 
        ecg: [], 
        gsr: []
    });
    const [selected, setSelected] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const socketRef = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            socketRef.current = new WebSocket('https://pm-pcosbackend.onrender.com');

            socketRef.current.onmessage = (evt) => {
                const data = JSON.parse(evt.data);
                const timestamp = new Date();
                setLastUpdated(timestamp);
        
                setLiveData(prev => {
                    const updated = {};
                    metricsConfig.forEach(m => {
                        const val = parseFloat(data[m.key]);
                        const arr = prev[m.key] ? [...prev[m.key]] : [];
                        arr.push({ 
                            name: timestamp, 
                            value: val,
                            formattedTime: timestamp.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })
                        });
                        if (arr.length > 60) arr.shift();
                        updated[m.key] = arr;
                    });
                    return updated;
                });
            };

            socketRef.current.onclose = () => {
                setTimeout(connectWebSocket, 3000);
            };
        };

        connectWebSocket();
        return () => socketRef.current?.close();
    }, [url]);

    const getValueStatus = (metric, value) => {
        if (!metric.thresholds) return 'normal';
        if (value >= metric.thresholds.critical) return 'critical';
        if (value >= metric.thresholds.warn) return 'warn';
        return 'normal';
    };

    const renderChart = (metric) => {
        const currentData = liveData[metric.key];
        const latestValue = currentData.slice(-1)[0]?.value;
        const status = getValueStatus(metric, latestValue);

        return (
            <div className="relative py-10 pr-10 h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                    {metric.chartType === 'area' ? (
                        <AreaChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="formattedTime" stroke={metric.color} fill={metric.color} />
                            <YAxis stroke={metric.color} fill={metric.color} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                }}
                                itemStyle={{ color: '#f9fafb' }}
                            />

                            {metric.thresholds && (
                                <ReferenceLine y={metric.thresholds.warn} stroke={metric.color} strokeDasharray="4 4" strokeOpacity={0.5} />
                            )}
                            <Area dataKey="value" stroke={metric.color} fill={metric.color} fillOpacity={0.1} strokeWidth={2}/>
                        </AreaChart>
                    ) : metric.chartType === 'bar' ? (
                        <BarChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="formattedTime" stroke={metric.color}  fill={metric.color} />
                            <YAxis stroke={metric.color}  fill={metric.color} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                }}
                                itemStyle={{ color: '#f9fafb' }}
                            />
                            <Bar dataKey="value" fill={metric.color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    ) : metric.chartType === 'scatter' ? (
                        <ScatterChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="formattedTime" stroke={metric.color}  fill={metric.color} />
                            <YAxis stroke={metric.color} fill={metric.color} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                }}
                                itemStyle={{ color: '#f9fafb' }}
                            />
                            <Scatter dataKey="value" fill={metric.color} stroke={metric.color} strokeWidth={1} />
                        </ScatterChart>
                    ) : (
                        <LineChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="formattedTime" stroke={metric.color}  fill={metric.color}/>
                            <YAxis stroke={metric.color}  fill={metric.color} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                }}
                                itemStyle={{ color: '#f9fafb' }}
                            />
                            <Line type="monotone" dataKey="value" stroke={metric.color} strokeWidth={2}/>
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <section className="flex flex-col lg:flex-row px-4 lg:px-6 py-6 min-h-screen">
            {/* Side Bar */}
            <div className="w-full lg:w-1/4 mb-6 lg:mb-0 lg:pr-4 space-y-4">
                {metricsConfig.map((m) => {
                    const latestValue = liveData[m.key].slice(-1)[0]?.value;
                    const status = getValueStatus(m, latestValue);
                    const previousValue = liveData[m.key].slice(-2)[0]?.value;

                    return (
                        <div key={m.key} onClick={() => setSelected(m.key)} onKeyPress={(e) => e.key === 'Enter' && setSelected(m.key)} role="button" tabIndex={0}
                            className={`group relative p-4 rounded-xl transition-all duration-100
                                ${selected === m.key ? 'bg-[#F9CBD6] ring-2 ring-red-600 ring-offset-2 shadow-lg' : 'bg-[#F9CBD6] hover:shadow-md border border-white'} `}
                            style={{ [selected === m.key ? 'ringColor' : '']: m.color }}
                        >
                            <div className="absolute left-0 top-0 h-full w-1 rounded-l-full" style={{ backgroundColor: m.color }} />
                                <div className="flex items-start">
                                    <div className={`p-2 rounded-full ${selected === m.key ? 'bg-opacity-20' : 'bg-opacity-10'}`} style={{ backgroundColor: m.color }}>
                                        {React.cloneElement(m.icon, { className: 'w-8 h-8', style: { color: m.color } })}
                                    </div>

                                    <div className="ml-4 flex-1">
                                        <div className={`flex justify-between items-start ${status === 'critical' ? 'text-red-600' : status === 'warn' ? 'text-amber-600' : 'text-[#9E182B]'}`}>
                                            <span className="medium-16">{m.title}</span>
                                        </div>

                                        <div className={`mt-1 flex items-baseline  ${status === 'critical' ? 'text-red-600' : status === 'warn' ? 'text-amber-600' : 'text-[#9E182B]'}`}>
                                            <span className="bold-20">
                                                {latestValue?.toFixed(1) || '--'}
                                            </span>
                                            <span className="ml-1 medium-12 text-[#9E182B]">
                                                {m.unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    );
                })}
            </div>

            {/* Graph Area */}
            <div className="w-full lg:w-3/4 bg-[#F9CBD6] border border-white h-full rounded-2xl shadow-sm">
                {selected ? ( renderChart(metricsConfig.find(m => m.key === selected))) : (
                    <div className="h-full flex flex-col items-center justify-center">
                        <p className="bold-14 text-[#9E182B]">
                            Select a sign to view detailed trends
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default MyHealthPage;