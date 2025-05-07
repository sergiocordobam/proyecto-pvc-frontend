import axios from 'axios';

const API_URL = 'http://localhost:8080';

class DocumentsService {
  async getAllUserDocumentsByID(userId) {
    try {
      const response = await axios.get(`${API_URL}/files/${userId}`);
        return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async uploadDocument(file, metadata) {
    const formData = new FormData();
    formData.append('file', file);

    // Add any metadata
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    try {
      const response = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async deleteDocument(filename) {
    try {
      const response = await axios.delete(`${API_URL}/documents/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
  async verifyDocument(filename) {

  }
  async sendDocument(filename) {

  }
  async downloadDocuments(filename) {

  }
}

export default new DocumentsService();