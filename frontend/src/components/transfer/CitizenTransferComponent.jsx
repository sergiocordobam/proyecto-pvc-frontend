//import React, { useEffect, useState } from 'react';
//import axios from 'axios';
//import './CitizenTransfer.css';
//
//const API_URL = 'http://localhost:8000/interop/comunication'; // or your configured base URL
//
//const CitizenTransferComponent = () => {
//    const [citizenId, setCitizenId] = useState(''); // could be set from context/auth
//    const [operators, setOperators] = useState([]);
//    const [selectedOperator, setSelectedOperator] = useState('');
//    const [statusMessage, setStatusMessage] = useState('');
//    const [statusClass, setStatusClass] = useState('');
//
//    useEffect(() => {
//            const fetchOperators = async () => {
//            try {
//                console.log(`${API_URL}/operators`);
//                const response = await axios.get(`${API_URL}/operators`);
//                
//                console.log('REASPUESTA:', response.data);
//                setOperators(response.data);
//            } catch (error) {
//                console.error('Error fetching operators:', error);
//                setStatusMessage('Error fetching operators');
//                setStatusClass('error');
//            }
//            };
//
//            fetchOperators();
//        }, []);
//
//        const handleTransfer = async () => {
//            try {
//            const payload = {
//                citizenId: citizenId,
//                operatorId: selectedOperator,
//            };
//
//            await axios.post(`${API_URL}/transfers/process-transfer`, payload);
//            setStatusMessage('Citizen transfer initiated successfully!');
//            setStatusClass('success');
//            } catch (error) {
//            console.error('Transfer failed:', error);
//            setStatusMessage('Citizen transfer failed.');
//            setStatusClass('error');
//            }
//        };
//
//        return (
//            <div className="card transfer-card">
//            <h2>Transfer Citizen</h2>
//
//            <div className="mb-3">
//                    <label htmlFor="operatorSelect" className="form-label">
//                        Select Target Operator:
//                    </label>
//                        <select
//                            className="form-select"
//                            id="operatorSelect"
//                            value={selectedOperator}
//                            onChange={(e) => setSelectedOperator(e.target.value)}
//                        >
//                    <option value="">-- Choose Operator --</option>
//                        {operators.map((op) => (
//                            <option key={op._id} value={op._id}>
//                            {op.operatorName}
//                            </option>
//                        ))}
//                    </select>
//                </div>
//
//                <button
//                    className="btn btn-primary"
//                    onClick={handleTransfer}
//                    disabled={!selectedOperator || !citizenId}
//                    >
//                    Initiate Transfer
//                </button>
//                    {statusMessage && (
//                        <div className={`status-message ${statusClass}`}>
//                        {statusMessage}
//                        </div>
//                    )}
//            </div>
//        );
//};
//
//export default CitizenTransferComponent;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarPvc from '../base/Navbar'; // ✅ import Navbar component
import './CitizenTransfer.css';

const API_URL = 'http://localhost:8000/interop/comunication';
const USER_ID_STORAGE_KEY = "document_id"; 

const CitizenTransferComponent = () => {
    const [citizenId, setCitizenId] = useState('');
    const [operators, setOperators] = useState([]);
    const [selectedOperator, setSelectedOperator] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusClass, setStatusClass] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
        console.log('Stored User ID:', storedUserId);

        if (!storedUserId) {
            navigate('/login');
            return;
        }

        setCitizenId(storedUserId);

        const fetchOperators = async () => {
            try {
                const response = await axios.get(`${API_URL}/operators`);
                setOperators(response.data);
            } catch (error) {
                console.error('Error fetching operators:', error);
                setStatusMessage('Error fetching operators');
                setStatusClass('error');
            }
        };

        fetchOperators();
    }, [navigate]);

    const handleTransfer = async () => {
        try {
            const payload = {
                citizenId,
                operatorId: selectedOperator,
            };

            await axios.post(`${API_URL}/transfers/process-transfer`, payload);
            setStatusMessage('Citizen transfer initiated successfully!');
            setStatusClass('success');
        } catch (error) {
            console.error('Transfer failed:', error);
            setStatusMessage('Citizen transfer failed.');
            setStatusClass('error');
        }
    };

    return (
        <>
            <NavbarPvc /> {/* ✅ Include the navbar */}
            <div className="card transfer-card">
                <h2>Transfer Citizen</h2>

                <div className="mb-3">
                    <label htmlFor="operatorSelect" className="form-label">
                        Select Target Operator:
                    </label>
                    <select
                        className="form-select"
                        id="operatorSelect"
                        value={selectedOperator}
                        onChange={(e) => setSelectedOperator(e.target.value)}
                    >
                        <option value="">-- Choose Operator --</option>
                        {operators.map((op) => (
                            <option key={op._id} value={op._id}>
                                {op.operatorName}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleTransfer}
                    disabled={!selectedOperator}
                >
                    Initiate Transfer
                </button>

                {statusMessage && (
                    <div className={`status-message ${statusClass}`}>
                        {statusMessage}
                    </div>
                )}
            </div>
        </>
    );
};

export default CitizenTransferComponent;