import axios from 'axios';

const API_URL = 'http://localhost:8000/interop/comunication';

class TransferService {
    async initiateCitizenTransfer(citizenId, operatorId) {
        const requestBody = {
            citizenId,
            operatorId
        };

        try {
            const response = await axios.post(`${API_URL}/transfers/process-transfer`, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            }
            });
            return response.data;
        } catch (error) {
            console.error('Error initiating citizen transfer:', error);
            throw error;
        }
    }

    async fetchOperators() {
        try {
            const response = await axios.get(`${API_URL}/operators`);
            return response.data;
        } catch (error) {
            console.error('Error fetching operators:', error);
            throw error;
        }
    }
}

export default new TransferService();